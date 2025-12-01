import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useData } from '../context/DataContext';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';

const { width } = Dimensions.get('window');

type TimeRange = 'daily' | 'weekly' | 'monthly';

export default function ReportsScreen() {
    const { income, expenses, isDarkMode } = useData();
    const [timeRange, setTimeRange] = useState<TimeRange>('weekly');

    const colors = {
        bg: isDarkMode ? '#1a1a1a' : '#f5f5f5',
        cardBg: isDarkMode ? '#2d2d2d' : '#ffffff',
        text: isDarkMode ? '#ffffff' : '#1a1a1a',
        textSecondary: isDarkMode ? '#a3a3a3' : '#666666',
        textTertiary: isDarkMode ? '#666666' : '#999999',
        accent: '#a8e6cf',
        accentDark: '#7bc9a6',
        red: '#ff6b6b',
        redDark: '#ff5252',
        border: isDarkMode ? '#404040' : '#e5e5e5',
    };

    const stats = useMemo(() => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const filterDate = (dateStr: string) => {
            const date = new Date(dateStr);
            switch (timeRange) {
                case 'daily': return date >= startOfDay;
                case 'weekly': return date >= startOfWeek;
                case 'monthly': return date >= startOfMonth;
                default: return true;
            }
        };

        const filteredIncome = income.filter(i => filterDate(i.date));
        const filteredExpenses = expenses.filter(e => filterDate(e.date));

        const totalIncome = filteredIncome.reduce((sum, i) => sum + i.amount, 0);
        const totalExpense = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
        const netBalance = totalIncome - totalExpense;

        // Group expenses by category
        const expensesByCategory = filteredExpenses.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {} as Record<string, number>);

        const topCategories = Object.entries(expensesByCategory)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);

        return {
            totalIncome,
            totalExpense,
            netBalance,
            topCategories,
            transactionCount: filteredIncome.length + filteredExpenses.length
        };
    }, [income, expenses, timeRange]);

    const ChartBar = ({ label, value, total, color }: { label: string, value: number, total: number, color: string }) => (
        <View style={styles.chartRow}>
            <View style={styles.chartLabelContainer}>
                <Text style={[styles.chartLabel, { color: colors.textSecondary }]} numberOfLines={1}>{label}</Text>
            </View>
            <View style={styles.chartBarContainer}>
                <View style={[styles.chartBarBg, { backgroundColor: isDarkMode ? '#404040' : '#e5e5e5' }]}>
                    <MotiView
                        from={{ width: '0%' }}
                        animate={{ width: `${total > 0 ? (value / total) * 100 : 0}%` }}
                        transition={{ type: 'timing', duration: 1000 }}
                        style={[styles.chartBarFill, { backgroundColor: color }]}
                    />
                </View>
            </View>
            <Text style={[styles.chartValue, { color: colors.text }]}>₹{value.toLocaleString()}</Text>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.bg }]}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Header Card */}
                    <View style={[styles.headerCard, { backgroundColor: colors.cardBg }]}>
                        <Text style={[styles.headerTitle, { color: colors.text }]}>Financial Report</Text>

                        <View style={[styles.segmentControl, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' }]}>
                            {(['daily', 'weekly', 'monthly'] as const).map((range) => (
                                <TouchableOpacity
                                    key={range}
                                    style={[
                                        styles.segmentButton,
                                        timeRange === range && { backgroundColor: colors.cardBg, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }
                                    ]}
                                    onPress={() => setTimeRange(range)}
                                >
                                    <Text style={[
                                        styles.segmentText,
                                        { color: timeRange === range ? colors.text : colors.textSecondary, fontWeight: timeRange === range ? '600' : '400' }
                                    ]}>
                                        {range.charAt(0).toUpperCase() + range.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Summary Card */}
                    <View style={[styles.summaryCard, { backgroundColor: colors.cardBg }]}>
                        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Net Balance ({timeRange})</Text>
                        <Text style={[styles.summaryAmount, { color: stats.netBalance >= 0 ? colors.accent : colors.red }]}>
                            {stats.netBalance >= 0 ? '+' : ''}₹{stats.netBalance.toLocaleString()}
                        </Text>
                        <View style={styles.summaryRow}>
                            <View style={styles.summaryItem}>
                                <View style={[styles.iconCircle, { backgroundColor: colors.accent + '20' }]}>
                                    <Ionicons name="arrow-down" size={16} color={colors.accent} />
                                </View>
                                <View>
                                    <Text style={[styles.summaryItemLabel, { color: colors.textSecondary }]}>Income</Text>
                                    <Text style={[styles.summaryItemValue, { color: colors.text }]}>₹{stats.totalIncome.toLocaleString()}</Text>
                                </View>
                            </View>
                            <View style={[styles.divider, { backgroundColor: colors.border }]} />
                            <View style={styles.summaryItem}>
                                <View style={[styles.iconCircle, { backgroundColor: colors.red + '20' }]}>
                                    <Ionicons name="arrow-up" size={16} color={colors.red} />
                                </View>
                                <View>
                                    <Text style={[styles.summaryItemLabel, { color: colors.textSecondary }]}>Expense</Text>
                                    <Text style={[styles.summaryItemValue, { color: colors.text }]}>₹{stats.totalExpense.toLocaleString()}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Expense Breakdown */}
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 200 }}
                        style={[styles.section, { backgroundColor: colors.cardBg }]}
                    >
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Expenses</Text>
                        {stats.topCategories.length > 0 ? (
                            stats.topCategories.map(([category, amount], index) => (
                                <ChartBar
                                    key={category}
                                    label={category}
                                    value={amount}
                                    total={stats.totalExpense}
                                    color={colors.red}
                                />
                            ))
                        ) : (
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No expenses in this period</Text>
                        )}
                    </MotiView>

                    {/* Insights */}
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 300 }}
                        style={[styles.section, { backgroundColor: colors.cardBg }]}
                    >
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Insights</Text>
                        <View style={styles.insightRow}>
                            <Ionicons name="information-circle-outline" size={24} color={colors.textSecondary} />
                            <Text style={[styles.insightText, { color: colors.textSecondary }]}>
                                {stats.netBalance >= 0
                                    ? "You're saving money! Keep it up. 👏"
                                    : "You're spending more than you earn. Watch out! ⚠️"}
                            </Text>
                        </View>
                    </MotiView>

                    <View style={{ height: 100 }} />
                </ScrollView>
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
    content: {
        padding: 20,
        paddingTop: 60,
    },
    headerCard: {
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
    },
    headerTitle: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 28,
        marginBottom: 20,
    },
    segmentControl: {
        flexDirection: 'row',
        padding: 4,
        borderRadius: 12,
        height: 44,
    },
    segmentButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    segmentText: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 14,
    },
    summaryCard: {
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    summaryLabel: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 14,
        marginBottom: 8,
    },
    summaryAmount: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 36,
        marginBottom: 24,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    summaryItemLabel: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 12,
    },
    summaryItemValue: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 16,
    },
    divider: {
        width: 1,
        height: 30,
    },
    section: {
        padding: 20,
        borderRadius: 24,
        marginBottom: 20,
    },
    sectionTitle: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 18,
        marginBottom: 20,
    },
    chartRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    chartLabelContainer: {
        width: 80,
    },
    chartLabel: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 14,
    },
    chartBarContainer: {
        flex: 1,
        marginHorizontal: 12,
    },
    chartBarBg: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    chartBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    chartValue: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 14,
        width: 60,
        textAlign: 'right',
    },
    emptyText: {
        fontFamily: 'Outfit_400Regular',
        textAlign: 'center',
        paddingVertical: 20,
    },
    insightRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    insightText: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 14,
        flex: 1,
        lineHeight: 20,
    },
});
