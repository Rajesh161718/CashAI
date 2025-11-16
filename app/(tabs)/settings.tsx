import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GENERAL</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>👤</Text>
            <Text style={styles.settingText}>Profile</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>🔔</Text>
            <Text style={styles.settingText}>Notifications</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>💾</Text>
            <Text style={styles.settingText}>Backup Data</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APP</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>🌙</Text>
            <Text style={styles.settingText}>Dark Mode</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>ℹ️</Text>
            <Text style={styles.settingText}>About</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.version}>
          <Text style={styles.versionText}>Money Manager v1.0</Text>
        </View>
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
    backgroundColor: '#667eea',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  settingArrow: {
    fontSize: 18,
    color: '#ccc',
  },
  version: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  versionText: {
    fontSize: 13,
    color: '#999',
  },
});