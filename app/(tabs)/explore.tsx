import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, RefreshControl, Alert } from 'react-native';
import { useData, Income, Expense } from '../context/DataContext';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';

type TransactionItem = (Income | Expense) & { type: 'income' | 'expense' };
type FilterType = 'all' | 'income' | 'expense';

export default function CashFlowScreen() {
    const { income, expenses, deleteIncome, deleteExpense, isDarkMode } = useData();
    const [filter, setFilter] = useState<FilterType>('all');
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        // Simulate refresh
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    const handleDelete = (item: TransactionItem) => {
        Alert.alert(
            'Delete Transaction',
            'Are you sure you want to delete this transaction?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        if (item.type === 'income') {
                            deleteIncome(item.id);
                        } else {
                            deleteExpense(item.id);
                        }
                    }
                }
            ]
        );
    };

    const colors = {
        bg: isDarkMode ? '#1a1a1a' : '#f5f5f5',
        cardBg: isDarkMode ? '#2d2d2d' : '#ffffff',
        text: isDarkMode ? '#ffffff' : '#1a1a1a',
        textSecondary: isDarkMode ? '#a3a3a3' : '#666666',
        textTertiary: isDarkMode ? '#666666' : '#999999',
        accent: '#a8e6cf',
        red: '#ff6b6b',
    };

    const allTransactions: TransactionItem[] = [
        ...income.map(i => ({ ...i, type: 'income' as const })),
        ...expenses.map(e => ({ ...e, type: 'expense' as const }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const filteredTransactions = allTransactions.filter(t => {
        if (filter === 'all') return true;
        return t.type === filter;
    });

    const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netBalance = totalIncome - totalExpense;

    const renderItem = ({ item, index }: { item: TransactionItem; index: number }) => {
        const isIncome = item.type === 'income';
        const title = isIncome ? (item as Income).source : (item as Expense).category;

        return (
            <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ delay: index * 50, type: 'spring', damping: 20, stiffness: 200 }}
            >
                <View style={[styles.itemCard, { backgroundColor: colors.cardBg }]}>
                    <View style={styles.itemContent}>
                        <View style={styles.itemLeft}>
                            <View style={[styles.iconCircle, { backgroundColor: isIncome ? colors.accent : colors.red }]}>
                                <Ionicons
                                    name={isIncome ? "wallet" : "cart"}
                                    size={20}
                                    color="#1a1a1a"
                                />
                            </View>
                            <View style={styles.itemInfo}>
                                <Text style={[styles.itemTitle, { color: colors.text }]}>{title}</Text>
                                <Text style={[styles.itemMeta, { color: colors.textTertiary }]}>
                                    {new Date(item.date).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short'
                                    })}
                                    {item.note ? ` • ${item.note}` : ''}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.itemRight}>
                            <Text style={[styles.itemAmount, { color: isIncome ? colors.accent : colors.red }]}>
                                {isIncome ? '+' : '-'}₹{item.amount.toLocaleString()}
                            </Text>
                            <TouchableOpacity
                                onPress={() => handleDelete(item)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Ionicons name="trash-outline" size={16} color={colors.textTertiary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </MotiView>
        );
    };

    const ListHeader = () => (
        <View style={styles.headerContainer}>
            {/* Header Card */}
            <View style={[styles.headerCard, { backgroundColor: colors.cardBg }]}>
                <View style={styles.accountRow}>
                    <View style={[styles.accountIcon, { backgroundColor: colors.accent }]}>
                        <Ionicons name="stats-chart" size={20} color="#1a1a1a" />
                    </View>
                    <Text style={[styles.accountText, { color: colors.text }]}>Cash Flow Overview</Text>
                </View>

                <View style={styles.balanceSection}>
                    <Text style={[styles.balanceAmount, {
                        color: netBalance >= 0 ? colors.accent : colors.red
                    }]}>
                        {netBalance >= 0 ? '+' : ''}₹{netBalance.toLocaleString()}
                    </Text>
                    <Text style={[styles.balanceSubtext, { color: colors.textSecondary }]}>
                        Current Net Balance
                    </Text>
                </View>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
                <View style={[styles.statCard, { backgroundColor: colors.cardBg }]}>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Income</Text>
                    <Text style={[styles.statAmount, { color: colors.accent }]}>
                        ₹{totalIncome.toLocaleString()}
                    </Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: colors.cardBg }]}>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Expense</Text>
                    <Text style={[styles.statAmount, { color: colors.red }]}>
                        ₹{totalExpense.toLocaleString()}
                    </Text>
                </View>
            </View>

            {/* Filter Pills */}
            <View style={styles.filterContainer}>
                {(['all', 'income', 'expense'] as const).map((f) => (
                    <TouchableOpacity
                        key={f}
                        style={[
                            styles.filterButton,
                            filter === f ?
                                { backgroundColor: colors.text } :
                                { backgroundColor: colors.cardBg, borderWidth: 1, borderColor: colors.bg }
                        ]}
                        onPress={() => setFilter(f)}
                    >
                        <Text style={[
                            styles.filterText,
                            { color: filter === f ? (isDarkMode ? '#1a1a1a' : '#ffffff') : colors.textSecondary }
                        ]}>
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.bg }]}>
            <SafeAreaView style={styles.safeArea}>
                <FlatList
                    data={filteredTransactions}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
                    }
                    ListHeaderComponent={ListHeader}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <View style={[styles.emptyIcon, { backgroundColor: colors.cardBg }]}>
                                <Ionicons name="document-text-outline" size={32} color={colors.textSecondary} />
                            </View>
                            <Text style={[styles.emptyText, { color: colors.text }]}>No transactions</Text>
                            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                                {filter === 'all' ? 'Start adding income and expenses' : `No ${filter} records found`}
                            </Text>
                        </View>
                    }
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    listContent: {
        padding: 20,
        paddingTop: 60,
        paddingBottom: 100,
    },
    headerContainer: {
        marginBottom: 20,
    },
    // Header Card
    headerCard: {
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
    },
    accountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    accountIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    accountText: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 14,
        flex: 1,
    },
    balanceSection: {
        marginBottom: 0,
    },
    balanceAmount: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 48,
        letterSpacing: -2,
        marginBottom: 4,
    },
    balanceSubtext: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 14,
    },
    // Stats Row
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        borderRadius: 16,
        padding: 16,
    },
    statLabel: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 12,
        marginBottom: 8,
    },
    statAmount: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 20,
        letterSpacing: -0.5,
    },
    // Filter
    filterContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 8,
    },
    filterButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    filterText: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 13,
    },
    // List Items
    itemCard: {
        borderRadius: 20,
        marginBottom: 12,
        padding: 18,
    },
    itemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    itemInfo: {
        flex: 1,
    },
    itemTitle: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 15,
        marginBottom: 2,
    },
    itemMeta: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 12,
    },
    itemRight: {
        alignItems: 'flex-end',
        gap: 6,
    },
    itemAmount: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 16,
    },
    // Empty State
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyText: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 18,
        marginBottom: 8,
    },
    emptySubtext: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 14,
    },
});
