import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, RefreshControl, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useData, Loan } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';

type GroupedLoan = {
  name: string;
  netAmount: number;
  type: 'given' | 'taken' | 'settled';
  loans: Loan[];
  lastDate: string;
};

export default function LoansScreen() {
  const { loans, markLoanReturned, isDarkMode, syncLoans, acceptLoan, rejectLoan, deleteLoan } = useData();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);
  const [expandedGroups, setExpandedGroups] = React.useState<{ [key: string]: boolean }>({});

  const toggleGroup = (name: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    if (user) {
      await syncLoans();
    }
    setTimeout(() => setRefreshing(false), 1000);
  }, [user, syncLoans]);

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
    buttonBg: isDarkMode ? '#1a1a1a' : '#000000',
  };

  const groupedLoans: GroupedLoan[] = React.useMemo(() => {
    const groups: { [key: string]: GroupedLoan } = {};

    loans.filter(loan => !loan.returned && (loan.status !== 'PENDING' || (loan.status === 'PENDING' && loan.createdBy === user?.id))).forEach(loan => {
      const key = loan.name.toLowerCase();

      if (!groups[key]) {
        groups[key] = {
          name: loan.name,
          netAmount: 0,
          type: 'settled',
          loans: [],
          lastDate: loan.date,
        };
      }

      groups[key].loans.push(loan);

      if (loan.type === 'given') {
        groups[key].netAmount += loan.amount;
      } else {
        groups[key].netAmount -= loan.amount;
      }

      if (new Date(loan.date) > new Date(groups[key].lastDate)) {
        groups[key].lastDate = loan.date;
      }
    });

    Object.values(groups).forEach(group => {
      if (group.netAmount > 0) {
        group.type = 'given';
      } else if (group.netAmount < 0) {
        group.type = 'taken';
      } else {
        group.type = 'settled';
      }
    });

    return Object.values(groups).filter(g => g.netAmount !== 0);
  }, [loans, user]);

  const totalGiven = loans
    .filter(loan => loan.type === 'given' && !loan.returned && loan.status !== 'PENDING')
    .reduce((sum, loan) => sum + loan.amount, 0);

  const totalTaken = loans
    .filter(loan => loan.type === 'taken' && !loan.returned && loan.status !== 'PENDING')
    .reduce((sum, loan) => sum + loan.amount, 0);

  const netBalance = totalGiven - totalTaken;

  const pendingRequests = React.useMemo(() => {
    if (!user) return [];
    return loans.filter(loan => loan.status === 'PENDING' && loan.createdBy !== user.id);
  }, [loans, user]);

  const handleAcceptLoan = async (loan: Loan) => {
    try {
      await acceptLoan(loan.remoteId!);
      Alert.alert('Success', 'Loan request accepted!');
    } catch (error) {
      Alert.alert('Error', 'Failed to accept loan request');
      console.error('Failed to accept:', error);
    }
  };

  const handleRejectLoan = async (loan: Loan) => {
    Alert.alert(
      'Reject Loan Request',
      `Are you sure you want to reject this ₹${loan.amount.toLocaleString()} loan request from ${loan.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              await rejectLoan(loan.remoteId!);
              Alert.alert('Rejected', 'Loan request rejected');
            } catch (error) {
              Alert.alert('Error', 'Failed to reject loan request');
              console.error('Failed to reject:', error);
            }
          }
        }
      ]
    );
  };

  const handleSettleLoans = (group: GroupedLoan) => {
    Alert.alert(
      'Settle All Loans',
      `Are you sure you want to settle all ${group.loans.length} transaction${group.loans.length > 1 ? 's' : ''} with ${group.name}?\n\nThis will mark ₹${Math.abs(group.netAmount).toLocaleString()} as returned.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Settle',
          style: 'default',
          onPress: () => {
            group.loans.forEach(loan => markLoanReturned(loan.id));
          }
        }
      ]
    );
  };

  const handleDeleteTransaction = (loan: Loan) => {
    const actionText = loan.isSynced
      ? 'This transaction is synced with your friend. Deleting it will send a cancellation request to them.'
      : 'This will permanently delete this transaction.';

    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete this ₹${loan.amount.toLocaleString()} transaction with ${loan.name}?\n\n${actionText}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteLoan(loan.id);
            // TODO: If synced, also update status in Supabase to 'CANCELLED'
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
          }
        >
          {/* Header Card */}
          <View style={[styles.headerCard, { backgroundColor: colors.cardBg }]}>
            <View style={styles.accountRow}>
              <View style={[styles.accountIcon, { backgroundColor: colors.accent }]}>
                <Ionicons name="wallet" size={20} color="#1a1a1a" />
              </View>
              <Text style={[styles.accountText, { color: colors.text }]}>CashLoop Account</Text>
              <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
            </View>

            <View style={styles.balanceSection}>
              <Text style={[styles.balanceAmount, {
                color: netBalance >= 0 ? colors.accent : colors.red
              }]}>
                {netBalance >= 0 ? '+' : ''}₹{netBalance.toLocaleString()}
              </Text>
              <Text style={[styles.balanceSubtext, { color: colors.textSecondary }]}>
                {netBalance >= 0 ? 'You will receive' : 'You need to pay'}
              </Text>
            </View>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: colors.cardBg }]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>You Gave</Text>
              <Text style={[styles.statAmount, { color: colors.accent }]}>
                ₹{totalGiven.toLocaleString()}
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.cardBg }]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>You Took</Text>
              <Text style={[styles.statAmount, { color: colors.red }]}>
                ₹{totalTaken.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Pending Requests Section */}
          {pendingRequests.length > 0 && (
            <View style={styles.loansSection}>
              <View style={styles.pendingHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Pending Requests</Text>
                <View style={[styles.pendingBadge, { backgroundColor: '#f59e0b' }]}>
                  <Text style={styles.pendingBadgeText}>{pendingRequests.length}</Text>
                </View>
              </View>

              <View style={[styles.loansList, { backgroundColor: colors.cardBg }]}>
                {pendingRequests.map((loan, index) => (
                  <MotiView
                    key={loan.id}
                    from={{ opacity: 0, translateX: -20 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{
                      delay: index * 50,
                      type: 'spring',
                      damping: 20,
                      stiffness: 200
                    }}
                  >
                    <View
                      style={[
                        styles.pendingItem,
                        { borderBottomWidth: index !== pendingRequests.length - 1 ? 1 : 0, borderBottomColor: colors.bg }
                      ]}
                    >
                      <View style={styles.pendingContent}>
                        <View style={styles.loanTop}>
                          <View style={styles.loanLeft}>
                            <View style={[styles.loanIcon, { backgroundColor: loan.type === 'given' ? colors.red : colors.accent }]}>
                              <Text style={styles.loanIconText}>
                                {loan.name.charAt(0).toUpperCase()}
                              </Text>
                            </View>
                            <View style={styles.loanInfo}>
                              <Text style={[styles.loanName, { color: colors.text }]}>{loan.name}</Text>
                              <Text style={[styles.loanMeta, { color: colors.textTertiary }]}>
                                {loan.type === 'given' ? 'says they lent you' : 'says you lent them'}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.loanRight}>
                            <Text style={[styles.loanAmount, { color: loan.type === 'given' ? colors.red : colors.accent }]}>
                              ₹{loan.amount.toLocaleString()}
                            </Text>
                          </View>
                        </View>

                        {loan.note && loan.note.trim() !== '' && (
                          <Text style={[styles.pendingNote, { color: colors.textSecondary }]}>
                            Note: "{loan.note}"
                          </Text>
                        )}

                        <Text style={[styles.pendingDate, { color: colors.textTertiary }]}>
                          Requested on {new Date(loan.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </Text>

                        <View style={styles.pendingActions}>
                          <TouchableOpacity
                            style={[styles.rejectButton, { backgroundColor: colors.red + '20', borderColor: colors.red }]}
                            onPress={() => handleRejectLoan(loan)}
                          >
                            <Ionicons name="close-circle" size={16} color={colors.red} />
                            <Text style={[styles.rejectButtonText, { color: colors.red }]}>Reject</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[styles.acceptButton, { backgroundColor: colors.accent }]}
                            onPress={() => handleAcceptLoan(loan)}
                          >
                            <Ionicons name="checkmark-circle" size={16} color="#1a1a1a" />
                            <Text style={styles.acceptButtonText}>Accept</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </MotiView>
                ))}
              </View>
            </View>
          )}

          {/* Active Loans List */}
          <View style={styles.loansSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Loans</Text>

            <View style={[styles.loansList, { backgroundColor: colors.cardBg }]}>
              {groupedLoans.length > 0 ? (
                <>
                  {groupedLoans.map((item, index) => {
                    const isExpanded = expandedGroups[item.name];
                    const displayedLoans = isExpanded ? item.loans : item.loans.slice(0, 1);
                    const hasMore = item.loans.length > 1;

                    return (
                      <MotiView
                        key={item.name}
                        from={{ opacity: 0, translateX: -20 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        transition={{
                          delay: index * 50,
                          type: 'spring',
                          damping: 20,
                          stiffness: 200
                        }}
                      >
                        <View
                          style={[
                            styles.loanItem,
                            index !== groupedLoans.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.bg }
                          ]}
                        >
                          <View style={styles.loanContent}>
                            {/* Top Row: Icon, Name, Amount, Settle Button */}
                            <View style={styles.loanTop}>
                              <View style={styles.loanLeft}>
                                <View style={[styles.loanIcon, { backgroundColor: item.type === 'given' ? colors.accent : colors.red }]}>
                                  <Text style={styles.loanIconText}>
                                    {item.name.charAt(0).toUpperCase()}
                                  </Text>
                                </View>
                                <View style={styles.loanInfo}>
                                  <Text style={[styles.loanName, { color: colors.text }]}>{item.name}</Text>
                                  <Text style={[styles.loanMeta, { color: colors.textTertiary }]}>
                                    {item.loans.length} transaction{item.loans.length > 1 ? 's' : ''}
                                  </Text>
                                </View>
                              </View>
                              <View style={styles.loanRight}>
                                <Text style={[styles.loanAmount, { color: item.type === 'given' ? colors.accent : colors.red }]}>
                                  {item.type === 'given' ? '+' : '-'}₹{Math.abs(item.netAmount).toLocaleString()}
                                </Text>
                                <TouchableOpacity
                                  style={[styles.settleButton, {
                                    backgroundColor: item.type === 'given' ? colors.accent : colors.red
                                  }]}
                                  onPress={() => handleSettleLoans(item)}
                                >
                                  <Text style={styles.settleButtonText}>Settle</Text>
                                </TouchableOpacity>
                              </View>
                            </View>

                            {/* Transaction Details List */}
                            <View style={styles.transactionsList}>
                              {displayedLoans.map((loan) => (
                                <MotiView
                                  key={loan.id}
                                  from={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{
                                    type: 'timing',
                                    duration: 200
                                  }}
                                  style={styles.transactionItem}
                                >
                                  <View style={styles.transactionContent}>
                                    <View style={styles.transactionRow}>
                                      <View style={styles.transactionLeft}>
                                        <Ionicons
                                          name={loan.type === 'given' ? 'arrow-up' : 'arrow-down'}
                                          size={12}
                                          color={colors.textTertiary}
                                        />
                                        <Text style={[styles.transactionText, { color: colors.textSecondary }]}>
                                          {loan.type === 'given' ? 'Gave' : 'Took'} ₹{loan.amount.toLocaleString()}
                                        </Text>
                                      </View>
                                      <View style={styles.transactionRight}>
                                        <Text style={[styles.transactionDate, { color: colors.textTertiary }]}>
                                          {new Date(loan.date).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short'
                                          })}
                                        </Text>
                                        {loan.status === 'PENDING' ? (
                                          <Ionicons
                                            name="time-outline"
                                            size={14}
                                            color={colors.textTertiary}
                                            style={{ marginLeft: 6 }}
                                          />
                                        ) : (loan.isSynced && loan.status === 'ACTIVE') ? (
                                          <Ionicons
                                            name="checkmark-circle"
                                            size={14}
                                            color={colors.accent}
                                            style={{ marginLeft: 6 }}
                                          />
                                        ) : null}
                                        {/* Small Delete Button */}
                                        <TouchableOpacity
                                          onPress={() => handleDeleteTransaction(loan)}
                                          style={styles.deleteButton}
                                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        >
                                          <Ionicons
                                            name="trash-outline"
                                            size={14}
                                            color={colors.textTertiary}
                                          />
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                    {loan.note && loan.note.trim() !== '' && (
                                      <Text style={[styles.transactionNote, { color: colors.textTertiary }]}>
                                        "{loan.note}"
                                      </Text>
                                    )}
                                  </View>
                                </MotiView>
                              ))}
                            </View>

                            {/* Dropdown Button */}
                            {hasMore && (
                              <TouchableOpacity
                                style={styles.expandButton}
                                onPress={() => toggleGroup(item.name)}
                              >
                                <Text style={[styles.expandButtonText, { color: colors.textSecondary }]}>
                                  {isExpanded ? 'Show less' : `Show ${item.loans.length - 1} more transaction${item.loans.length - 1 > 1 ? 's' : ''}`}
                                </Text>
                                <Ionicons
                                  name={isExpanded ? "chevron-up" : "chevron-down"}
                                  size={16}
                                  color={colors.textSecondary}
                                />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </MotiView>
                    );
                  })}

                  <TouchableOpacity style={styles.showAllBtn}>
                    <Text style={[styles.showAllText, { color: colors.text }]}>Show all</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.emptyState}>
                  <View style={[styles.emptyIcon, { backgroundColor: colors.accent }]}>
                    <Ionicons name="checkmark-circle" size={32} color="#1a1a1a" />
                  </View>
                  <Text style={[styles.emptyText, { color: colors.text }]}>All settled up!</Text>
                  <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                    No pending loans
                  </Text>
                </View>
              )}
            </View>
          </View>

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
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
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
  loansSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
    marginBottom: 12,
  },
  pendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  pendingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  pendingBadgeText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
    color: '#ffffff',
  },
  pendingItem: {
    padding: 18,
  },
  pendingContent: {
    gap: 12,
  },
  pendingNote: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    fontStyle: 'italic',
    paddingLeft: 52,
  },
  pendingDate: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    paddingLeft: 52,
  },
  pendingActions: {
    flexDirection: 'row',
    gap: 12,
    paddingLeft: 52,
    marginTop: 4,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  rejectButtonText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 13,
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 20,
  },
  acceptButtonText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 13,
    color: '#1a1a1a',
  },
  loansList: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  loanItem: {
    padding: 18,
  },
  loanContent: {
    gap: 12,
  },
  loanTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loanLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  loanIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  loanIconText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: '#1a1a1a',
  },
  loanInfo: {
    flex: 1,
  },
  loanName: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 15,
    marginBottom: 2,
  },
  loanMeta: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
  },
  loanRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  loanAmount: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    marginBottom: 2,
  },
  settleButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  settleButtonText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 12,
    color: '#1a1a1a',
  },
  transactionsList: {
    gap: 10,
    paddingLeft: 52,
  },
  transactionItem: {
    gap: 4,
  },
  transactionContent: {
    gap: 4,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  transactionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  transactionText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
  },
  transactionDate: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
  },
  deleteButton: {
    marginLeft: 6,
    padding: 4,
  },
  transactionNote: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 2,
  },
  showAllBtn: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  showAllText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 14,
  },
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
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
    marginTop: 4,
  },
  expandButtonText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 12,
  },
});