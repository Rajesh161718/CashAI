import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [loans, setLoans] = useState<any[]>([]);

  const markAsReturned = (id: number) => {
    setLoans(loans.map(loan => 
      loan.id === id ? { ...loan, returned: true } : loan
    ));
  };

  const totalPending = loans
    .filter(loan => !loan.returned)
    .reduce((sum, loan) => sum + loan.amount, 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerLabel}>PENDING AMOUNT</Text>
        <Text style={styles.headerAmount}>₹{totalPending.toFixed(0)}</Text>
        <Text style={styles.headerSubtitle}>
          {loans.filter(l => !l.returned).length} friend{loans.filter(l => !l.returned).length !== 1 ? 's' : ''} owe you
        </Text>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {loans.filter(l => !l.returned).map(loan => (
          <View key={loan.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{loan.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{loan.name}</Text>
                <Text style={styles.cardNote}>{loan.note}</Text>
              </View>
            </View>
            
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardDateLabel}>Lent on</Text>
                <Text style={styles.cardDate}>{loan.date}</Text>
              </View>
              <View style={styles.cardRight}>
                <Text style={styles.cardAmount}>₹{loan.amount}</Text>
                <TouchableOpacity 
                  style={styles.returnButton}
                  onPress={() => markAsReturned(loan.id)}
                >
                  <Text style={styles.returnButtonText}>✓ Paid</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        
        {loans.filter(l => !l.returned).length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🎉</Text>
            <Text style={styles.emptyTitle}>All Clear!</Text>
            <Text style={styles.emptyText}>No one owes you money</Text>
            <Text style={styles.emptyHint}>Tap + below to add a loan</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  headerAmount: {
    color: 'white',
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  cardNote: {
    fontSize: 14,
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  cardDateLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  cardAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#667eea',
    marginBottom: 8,
  },
  returnButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  returnButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  emptyHint: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
  },
});