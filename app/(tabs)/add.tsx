import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AddScreen() {
  const [showModal, setShowModal] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setShowModal(false);
    // We'll handle this differently - for now just close
  };

  return (
    <View style={styles.container}>
      <Modal visible={showModal} transparent={true} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.content}>
            <Text style={styles.title}>Quick Add</Text>
            <Text style={styles.subtitle}>What would you like to add?</Text>

            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => handleOptionSelect('loan')}
              activeOpacity={0.7}
            >
              <View style={styles.optionIcon}>
                <Text style={styles.optionEmoji}>💰</Text>
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Lent Money</Text>
                <Text style={styles.optionSubtitle}>Track money lent to friends</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => handleOptionSelect('income')}
              activeOpacity={0.7}
            >
              <View style={styles.optionIcon}>
                <Text style={styles.optionEmoji}>💵</Text>
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Add Income</Text>
                <Text style={styles.optionSubtitle}>Record money received</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => handleOptionSelect('expense')}
              activeOpacity={0.7}
            >
              <View style={styles.optionIcon}>
                <Text style={styles.optionEmoji}>💸</Text>
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Add Expense</Text>
                <Text style={styles.optionSubtitle}>Track your spending</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.mainContainer}>
        <Text style={styles.mainText}>Tap + to add something</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    fontSize: 16,
    color: '#999',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  optionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionEmoji: {
    fontSize: 24,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  arrow: {
    fontSize: 20,
    color: '#667eea',
  },
  closeButton: {
    marginTop: 12,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 14,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});