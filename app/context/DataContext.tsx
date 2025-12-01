import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';
import { useAuth } from './AuthContext';

export type Loan = {
    id: string;
    name: string;
    amount: number;
    note: string;
    date: string;
    type: 'given' | 'taken';
    returned: boolean;
    // New fields for Hybrid Sync
    isSynced?: boolean;
    remoteId?: string;
    status?: 'PENDING' | 'ACTIVE' | 'SETTLED_PENDING' | 'SETTLED' | 'REJECTED';
    friendId?: string; // Supabase User ID of the other person
    friendPhone?: string; // Phone number to identify friend
    createdBy?: string; // Who created this transaction
};

export type Income = {
    id: string;
    source: string;
    amount: number;
    note: string;
    date: string;
};

export type Expense = {
    id: string;
    category: string;
    amount: number;
    note: string;
    date: string;
};

export type UserProfile = {
    name: string;
    mobile: string;
    email?: string;
    age: string;
    country: string;
};

type DataContextType = {
    loans: Loan[];
    income: Income[];
    expenses: Expense[];
    userProfile: UserProfile | null;
    isOnboarded: boolean;
    isLoading: boolean;
    isDarkMode: boolean;
    addLoan: (loan: Omit<Loan, 'id' | 'date' | 'returned'>) => Promise<void>;
    markLoanReturned: (id: string) => void;
    deleteLoan: (id: string) => void;
    addIncome: (income: Omit<Income, 'id' | 'date'>) => void;
    deleteIncome: (id: string) => void;
    addExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
    deleteExpense: (id: string) => void;
    saveUserProfile: (profile: UserProfile) => void;
    toggleDarkMode: () => void;
    clearAllData: () => void;
    syncLoans: () => Promise<void>;
    acceptLoan: (remoteId: string) => Promise<void>;
    rejectLoan: (remoteId: string) => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [loans, setLoans] = useState<Loan[]>([]);
    const [income, setIncome] = useState<Income[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isOnboarded, setIsOnboarded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (!isLoading) {
            saveData();
        }
    }, [loans, income, expenses, isLoading]);

    useEffect(() => {
        if (user) {
            syncLoans();
        }
    }, [user]);

    const loadData = async () => {
        try {
            const storedLoans = await AsyncStorage.getItem('loans');
            const storedIncome = await AsyncStorage.getItem('income');
            const storedExpenses = await AsyncStorage.getItem('expenses');
            const storedProfile = await AsyncStorage.getItem('userProfile');
            const storedOnboarded = await AsyncStorage.getItem('isOnboarded');
            const storedDarkMode = await AsyncStorage.getItem('isDarkMode');

            if (storedLoans) setLoans(JSON.parse(storedLoans));
            if (storedIncome) setIncome(JSON.parse(storedIncome));
            if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
            if (storedProfile) setUserProfile(JSON.parse(storedProfile));
            if (storedOnboarded) setIsOnboarded(JSON.parse(storedOnboarded));
            if (storedDarkMode) setIsDarkMode(JSON.parse(storedDarkMode));
        } catch (error) {
            console.error('Failed to load data', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveData = async () => {
        try {
            await AsyncStorage.setItem('loans', JSON.stringify(loans));
            await AsyncStorage.setItem('income', JSON.stringify(income));
            await AsyncStorage.setItem('expenses', JSON.stringify(expenses));
        } catch (error) {
            console.error('Failed to save data', error);
        }
    };

    const saveUserProfile = async (profile: UserProfile) => {
        try {
            await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
            await AsyncStorage.setItem('isOnboarded', JSON.stringify(true));
            setUserProfile(profile);
            setIsOnboarded(true);

            // Sync to Supabase if logged in
            if (user) {
                const { error } = await supabase
                    .from('profiles')
                    .upsert({
                        id: user.id,
                        full_name: profile.name,
                        phone: profile.mobile,
                        email: profile.email,
                        updated_at: new Date().toISOString(),
                    });

                if (error) {
                    console.error('Supabase profile sync failed:', error);
                } else {
                    console.log('Profile synced to Supabase');
                }
            }
        } catch (error) {
            console.error('Failed to save user profile', error);
        }
    };

    const toggleDarkMode = async () => {
        try {
            const newMode = !isDarkMode;
            await AsyncStorage.setItem('isDarkMode', JSON.stringify(newMode));
            setIsDarkMode(newMode);
        } catch (error) {
            console.error('Failed to toggle dark mode', error);
        }
    };

    const addLoan = async (loanData: Omit<Loan, 'id' | 'date' | 'returned'>) => {
        const newLoan: Loan = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            returned: false,
            status: loanData.isSynced ? 'PENDING' : 'ACTIVE',
            ...loanData,
        };

        try {
            if (loanData.isSynced && user) {
                // 1. Create transaction in Supabase
                const { data, error } = await supabase
                    .from('transactions')
                    .insert({
                        lender_id: loanData.type === 'given' ? user.id : loanData.friendId,
                        borrower_id: loanData.type === 'taken' ? user.id : loanData.friendId,
                        amount: loanData.amount,
                        note: loanData.note,
                        status: 'PENDING',
                        created_by: user.id
                    })
                    .select()
                    .single();

                if (error) throw error;

                // Update local object with remote ID
                newLoan.remoteId = data.id;
                newLoan.status = 'PENDING';
                newLoan.createdBy = user.id;
            }
        } catch (error) {
            console.error('Failed to sync loan:', error);
            // Fallback: Keep it local but maybe mark as "sync_failed" later
            newLoan.isSynced = false;
        }

        setLoans((prev) => [newLoan, ...prev]);
    };

    // NEW: Accept a pending loan transaction
    const acceptLoan = async (remoteId: string) => {
        if (!user) return;

        try {
            // Update status in Supabase
            const { error } = await supabase
                .from('transactions')
                .update({ status: 'ACTIVE' })
                .eq('id', remoteId);

            if (error) throw error;

            // Update local state
            setLoans((prev) =>
                prev.map((loan) =>
                    loan.remoteId === remoteId
                        ? { ...loan, status: 'ACTIVE' }
                        : loan
                )
            );

            console.log('Loan accepted successfully');
        } catch (error) {
            console.error('Failed to accept loan:', error);
            throw error;
        }
    };

    // NEW: Reject a pending loan transaction
    const rejectLoan = async (remoteId: string) => {
        if (!user) return;

        try {
            // Update status in Supabase
            const { error } = await supabase
                .from('transactions')
                .update({ status: 'REJECTED' })
                .eq('id', remoteId);

            if (error) throw error;

            // Remove from local state (or mark as rejected)
            setLoans((prev) =>
                prev.filter((loan) => loan.remoteId !== remoteId)
            );

            console.log('Loan rejected successfully');
        } catch (error) {
            console.error('Failed to reject loan:', error);
            throw error;
        }
    };

    const markLoanReturned = (id: string) => {
        setLoans((prev) =>
            prev.map((loan) => (loan.id === id ? { ...loan, returned: true } : loan))
        );
    };

    const deleteLoan = (id: string) => {
        setLoans((prev) => prev.filter((loan) => loan.id !== id));
    };

    const addIncome = (incomeData: Omit<Income, 'id' | 'date'>) => {
        const newIncome: Income = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...incomeData,
        };
        setIncome((prev) => [newIncome, ...prev]);
    };

    const deleteIncome = (id: string) => {
        setIncome((prev) => prev.filter((item) => item.id !== id));
    };

    const addExpense = (expenseData: Omit<Expense, 'id' | 'date'>) => {
        const newExpense: Expense = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...expenseData,
        };
        setExpenses((prev) => [newExpense, ...prev]);
    };

    const deleteExpense = (id: string) => {
        setExpenses((prev) => prev.filter((item) => item.id !== id));
    };

    const clearAllData = async () => {
        try {
            setLoans([]);
            setIncome([]);
            setExpenses([]);
            await AsyncStorage.setItem('loans', JSON.stringify([]));
            await AsyncStorage.setItem('income', JSON.stringify([]));
            await AsyncStorage.setItem('expenses', JSON.stringify([]));
        } catch (error) {
            console.error('Failed to clear data', error);
        }
    };

    const syncLoans = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('transactions')
                .select(`
                    *,
                    lender:lender_id(full_name, phone),
                    borrower:borrower_id(full_name, phone)
                `)
                .or(`lender_id.eq.${user.id},borrower_id.eq.${user.id}`)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                setLoans(prev => {
                    const newLoans = [...prev];

                    data.forEach((t: any) => {
                        // Check if we already have this loan (by remoteId)
                        const exists = newLoans.find(l => l.remoteId === t.id);
                        if (!exists) {
                            const isLender = t.lender_id === user.id;
                            const friend = isLender ? t.borrower : t.lender;

                            newLoans.push({
                                id: t.id, // Use Supabase ID as local ID for synced loans
                                remoteId: t.id,
                                name: friend?.full_name || 'Friend',
                                amount: t.amount,
                                note: t.note,
                                date: t.created_at,
                                type: isLender ? 'given' : 'taken',
                                returned: t.status === 'SETTLED',
                                status: t.status,
                                isSynced: true,
                                friendId: isLender ? t.borrower_id : t.lender_id,
                                friendPhone: friend?.phone,
                                createdBy: t.created_by
                            });
                        } else {
                            // Update status if changed
                            if (exists.status !== t.status) {
                                exists.status = t.status;
                                exists.returned = t.status === 'SETTLED';
                            }
                        }
                    });

                    // Sort by date desc
                    return newLoans.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                });
            }
        } catch (error) {
            console.error('Sync failed:', error);
        }
    };

    return (
        <DataContext.Provider
            value={{
                loans,
                income,
                expenses,
                userProfile,
                isOnboarded,
                isLoading,
                isDarkMode,
                addLoan,
                markLoanReturned,
                deleteLoan,
                addIncome,
                deleteIncome,
                addExpense,
                deleteExpense,
                saveUserProfile,
                toggleDarkMode,
                clearAllData,
                syncLoans,
                acceptLoan,
                rejectLoan,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};