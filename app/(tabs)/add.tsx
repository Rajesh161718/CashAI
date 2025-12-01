import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { supabase } from '../../lib/supabase';

type TransactionType = 'loan' | 'income' | 'expense';
type LoanType = 'given' | 'taken';

export default function AddScreen() {
    const router = useRouter();
    const { addLoan, addIncome, addExpense, isDarkMode } = useData();
    const { user } = useAuth();

    const [type, setType] = useState<TransactionType>('loan');
    const [loanType, setLoanType] = useState<LoanType>('given');

    // Loan Specific State
    const [isSynced, setIsSynced] = useState(false);
    const [searchPhone, setSearchPhone] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [foundUser, setFoundUser] = useState<{ id: string, full_name: string, phone: string } | null>(null);

    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [category, setCategory] = useState('');

    const colors = {
        bg: isDarkMode ? '#0f172a' : '#f8f9fa',
        text: isDarkMode ? '#f1f5f9' : '#1a1a1a',
        textSecondary: isDarkMode ? '#94a3b8' : '#64748b',
        inputBg: isDarkMode ? '#1e293b' : 'white',
        inputBorder: isDarkMode ? '#334155' : '#e5e7eb',
        inputText: isDarkMode ? '#f1f5f9' : '#1a1a1a',
        label: isDarkMode ? '#cbd5e1' : '#374151',
        closeButtonBg: isDarkMode ? '#1e293b' : '#f3f4f6',
        selectorBg: isDarkMode ? '#1e293b' : '#e5e7eb',
        selectorActive: isDarkMode ? '#334155' : 'white',
        typeText: isDarkMode ? '#94a3b8' : '#6b7280',
        typeTextActive: isDarkMode ? '#f1f5f9' : '#1a1a1a',
        accent: '#667eea',
    };

    const handleSearchUser = async () => {
        if (!searchPhone || searchPhone.trim().length < 3) {
            Alert.alert('Invalid Search', 'Please enter at least 3 characters');
            return;
        }

        setIsSearching(true);
        try {
            const searchTerm = searchPhone.trim();
            let query = supabase
                .from('profiles')
                .select('id, full_name, phone');

            // Simple search: Phone or Name
            const cleanTerm = searchTerm.replace(/[\s-]/g, '');
            const isPhone = /^[+\d]+$/.test(cleanTerm);

            if (isPhone) {
                const phoneQuery = cleanTerm.startsWith('+') ? cleanTerm : `+91${cleanTerm}`;
                query = query.eq('phone', phoneQuery);
            } else {
                query = query.ilike('full_name', `%${searchTerm}%`);
            }

            const { data, error } = await query.limit(5);

            if (error) throw error;

            if (!data || data.length === 0) {
                Alert.alert('User not found', 'No CashLoop user found. Try searching by phone or name.');
                setFoundUser(null);
            } else if (data.length === 1) {
                // Single match found
                if (data[0].id === user?.id) {
                    Alert.alert('Error', 'You cannot add yourself!');
                    setFoundUser(null);
                } else {
                    setFoundUser(data[0]);
                    setName(data[0].full_name || 'CashLoop User');
                }
            } else {
                // Multiple matches - show first one (could enhance with a picker later)
                const firstMatch = data[0];
                if (firstMatch.id === user?.id) {
                    Alert.alert('Error', 'You cannot add yourself!');
                    setFoundUser(null);
                } else {
                    setFoundUser(firstMatch);
                    setName(firstMatch.full_name || 'CashLoop User');
                    Alert.alert('Multiple matches', `Found ${data.length} users. Showing: ${firstMatch.full_name}`);
                }
            }
        } catch (e) {
            console.error('Search error:', e);
            Alert.alert('Error', 'Search failed. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleSubmit = () => {
        if (!amount) return;

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) return;

        if (type === 'loan') {
            if (isSynced && !foundUser) {
                Alert.alert('Error', 'Please search and select a user for synced loans.');
                return;
            }
            if (!name && !foundUser) return;

            addLoan({
                name: isSynced ? (foundUser?.full_name || name) : name,
                amount: numAmount,
                note,
                type: loanType,
                isSynced,
                friendId: foundUser?.id,
                friendPhone: foundUser?.phone
            });
        } else if (type === 'income') {
            if (!name) return;
            addIncome({ source: name, amount: numAmount, note });
        } else {
            if (!category) return;
            addExpense({ category, amount: numAmount, note });
        }

        // Clear all form fields
        setName('');
        setAmount('');
        setNote('');
        setCategory('');
        setLoanType('given');
        setFoundUser(null);
        setSearchPhone('');
        setIsSynced(false);

        router.back();
    };

    const getGradientColors = () => {
        if (isDarkMode) {
            switch (type) {
                case 'loan': return ['#4c1d95', '#5b21b6'];
                case 'income': return ['#064e3b', '#065f46'];
                case 'expense': return ['#7f1d1d', '#991b1b'];
            }
        } else {
            switch (type) {
                case 'loan': return ['#667eea', '#764ba2'];
                case 'income': return ['#10b981', '#059669'];
                case 'expense': return ['#ef4444', '#dc2626'];
            }
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: colors.bg }]}
        >
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>New Transaction</Text>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.closeButton, { backgroundColor: colors.closeButtonBg }]}
                >
                    <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <View style={[styles.typeSelector, { backgroundColor: colors.selectorBg }]}>
                {(['loan', 'income', 'expense'] as const).map((t) => (
                    <TouchableOpacity
                        key={t}
                        style={styles.typeButton}
                        onPress={() => setType(t)}
                    >
                        {type === t && (
                            <MotiView
                                style={[styles.activePill, { backgroundColor: colors.selectorActive }]}
                                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            />
                        )}
                        <Text style={[styles.typeText, { color: type === t ? colors.typeTextActive : colors.typeText }]}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView style={styles.form} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                <AnimatePresence exitBeforeEnter>
                    <MotiView
                        key={type}
                        from={{ opacity: 0, translateY: 10 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        exit={{ opacity: 0, translateY: -10 }}
                        transition={{ type: 'timing', duration: 200 }}
                    >
                        {type === 'loan' && (
                            <>
                                <View style={styles.inputGroup}>
                                    <Text style={[styles.label, { color: colors.label }]}>Loan Type</Text>
                                    <View style={[styles.loanTypeSelector, { backgroundColor: colors.selectorBg }]}>
                                        <TouchableOpacity
                                            style={styles.loanTypeButton}
                                            onPress={() => setLoanType('given')}
                                        >
                                            {loanType === 'given' && (
                                                <View style={[styles.loanTypePill, { backgroundColor: colors.selectorActive }]} />
                                            )}
                                            <Ionicons name="arrow-up-circle" size={20} color={loanType === 'given' ? (isDarkMode ? '#818cf8' : '#667eea') : colors.typeText} />
                                            <Text style={[styles.loanTypeText, { color: loanType === 'given' ? colors.typeTextActive : colors.typeText }]}>
                                                I Gave
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.loanTypeButton}
                                            onPress={() => setLoanType('taken')}
                                        >
                                            {loanType === 'taken' && (
                                                <View style={[styles.loanTypePill, { backgroundColor: colors.selectorActive }]} />
                                            )}
                                            <Ionicons name="arrow-down-circle" size={20} color={loanType === 'taken' ? (isDarkMode ? '#f87171' : '#ef4444') : colors.typeText} />
                                            <Text style={[styles.loanTypeText, { color: loanType === 'taken' ? colors.typeTextActive : colors.typeText }]}>
                                                I Took
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Sync Toggle */}
                                {user ? (
                                    <View style={[styles.syncContainer, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
                                        <View style={styles.syncInfo}>
                                            <Ionicons name={isSynced ? "cloud-done" : "cloud-offline"} size={24} color={isSynced ? "#667eea" : colors.textSecondary} />
                                            <View>
                                                <Text style={[styles.syncTitle, { color: colors.text }]}>Sync with Friend</Text>
                                                <Text style={[styles.syncSubtitle, { color: colors.textSecondary }]}>
                                                    {isSynced ? "Transaction will be sent to friend" : "Private transaction only on this device"}
                                                </Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setIsSynced(!isSynced);
                                                if (!isSynced) setFoundUser(null);
                                            }}
                                            style={[styles.toggleButton, { backgroundColor: isSynced ? '#667eea' : colors.selectorBg }]}
                                        >
                                            <View style={[styles.toggleKnob, { transform: [{ translateX: isSynced ? 20 : 0 }] }]} />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        onPress={() => router.push('/auth/login')}
                                        style={[styles.loginPrompt, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}
                                    >
                                        <Ionicons name="log-in-outline" size={24} color="#667eea" />
                                        <Text style={[styles.loginPromptText, { color: colors.text }]}>Login to sync loans with friends</Text>
                                        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                                    </TouchableOpacity>
                                )}

                                {isSynced ? (
                                    <View style={styles.inputGroup}>
                                        <Text style={[styles.label, { color: colors.label }]}>Find Friend</Text>
                                        {!foundUser ? (
                                            <View style={styles.searchRow}>
                                                <TextInput
                                                    style={[styles.input, { flex: 1, backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.inputText }]}
                                                    placeholder="Phone number or name..."
                                                    value={searchPhone}
                                                    onChangeText={setSearchPhone}
                                                    keyboardType="default"
                                                    placeholderTextColor={isDarkMode ? '#64748b' : '#9ca3af'}
                                                    autoCapitalize="none"
                                                />
                                                <TouchableOpacity
                                                    style={styles.searchButton}
                                                    onPress={handleSearchUser}
                                                    disabled={isSearching}
                                                >
                                                    {isSearching ? <ActivityIndicator color="white" /> : <Ionicons name="search" size={24} color="white" />}
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            <View style={[styles.userCard, { backgroundColor: colors.inputBg, borderColor: colors.accent }]}>
                                                <View style={styles.userAvatar}>
                                                    <Text style={styles.userAvatarText}>{foundUser.full_name?.charAt(0).toUpperCase()}</Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={[styles.userName, { color: colors.text }]}>{foundUser.full_name}</Text>
                                                    <Text style={[styles.userPhone, { color: colors.textSecondary }]}>{foundUser.phone}</Text>
                                                </View>
                                                <TouchableOpacity onPress={() => { setFoundUser(null); setSearchPhone(''); }}>
                                                    <Ionicons name="close-circle" size={24} color={colors.textSecondary} />
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                ) : (
                                    <View style={styles.inputGroup}>
                                        <Text style={[styles.label, { color: colors.label }]}>Person's Name</Text>
                                        <TextInput
                                            style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.inputText }]}
                                            placeholder={loanType === 'given' ? "Who owes you?" : "Who did you borrow from?"}
                                            value={name}
                                            onChangeText={setName}
                                            placeholderTextColor={isDarkMode ? '#64748b' : '#9ca3af'}
                                        />
                                    </View>
                                )}
                            </>
                        )}

                        {type === 'income' && (
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.label }]}>Source</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.inputText }]}
                                    placeholder="Salary, Freelance, etc."
                                    value={name}
                                    onChangeText={setName}
                                    placeholderTextColor={isDarkMode ? '#64748b' : '#9ca3af'}
                                />
                            </View>
                        )}

                        {type === 'expense' && (
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.label }]}>Category</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.inputText }]}
                                    placeholder="Food, Transport, etc."
                                    value={category}
                                    onChangeText={setCategory}
                                    placeholderTextColor={isDarkMode ? '#64748b' : '#9ca3af'}
                                />
                            </View>
                        )}

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.label }]}>Amount (₹)</Text>
                            <TextInput
                                style={[styles.input, styles.amountInput, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.inputText }]}
                                placeholder="0.00"
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                                placeholderTextColor={isDarkMode ? '#64748b' : '#9ca3af'}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.label }]}>Note (Optional)</Text>
                            <TextInput
                                style={[styles.input, styles.textArea, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.inputText }]}
                                placeholder="Add a note..."
                                multiline
                                numberOfLines={3}
                                value={note}
                                onChangeText={setNote}
                                placeholderTextColor={isDarkMode ? '#64748b' : '#9ca3af'}
                            />
                        </View>
                    </MotiView>
                </AnimatePresence>

                <TouchableOpacity onPress={handleSubmit} activeOpacity={0.8}>
                    <LinearGradient
                        colors={getGradientColors() as [string, string, ...string[]]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.submitButton}
                    >
                        <Text style={styles.submitButtonText}>Save Transaction</Text>
                        <Ionicons name="arrow-forward" size={20} color="white" />
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    title: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 28,
    },
    closeButton: {
        padding: 8,
        borderRadius: 20,
    },
    typeSelector: {
        flexDirection: 'row',
        borderRadius: 16,
        padding: 4,
        marginBottom: 30,
        height: 50,
    },
    typeButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        zIndex: 1,
    },
    activePill: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    typeText: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 14,
    },
    form: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 14,
        marginBottom: 8,
        marginLeft: 4,
    },
    loanTypeSelector: {
        flexDirection: 'row',
        borderRadius: 16,
        padding: 4,
        height: 60,
    },
    loanTypeButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        gap: 8,
        zIndex: 1,
    },
    loanTypePill: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    loanTypeText: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 14,
    },
    input: {
        fontFamily: 'Outfit_500Medium',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
    },
    amountInput: {
        fontSize: 24,
        fontFamily: 'Outfit_700Bold',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 16,
    },
    submitButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
        gap: 10,
    },
    submitButtonText: {
        fontFamily: 'Outfit_700Bold',
        color: 'white',
        fontSize: 18,
    },
    // New Styles for Sync
    syncContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 24,
    },
    syncInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    syncTitle: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 16,
    },
    syncSubtitle: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 12,
    },
    toggleButton: {
        width: 44,
        height: 24,
        borderRadius: 12,
        padding: 2,
    },
    toggleKnob: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    loginPrompt: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 24,
        gap: 12,
    },
    loginPromptText: {
        flex: 1,
        fontFamily: 'Outfit_500Medium',
        fontSize: 14,
    },
    searchRow: {
        flexDirection: 'row',
        gap: 12,
    },
    searchButton: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#667eea',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        gap: 12,
    },
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#667eea',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userAvatarText: {
        color: 'white',
        fontFamily: 'Outfit_700Bold',
        fontSize: 18,
    },
    userName: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 16,
    },
    userPhone: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 12,
    },
});
