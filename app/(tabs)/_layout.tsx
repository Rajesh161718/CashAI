import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

// Custom Icons
const LoansIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const IncomeIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M12 19V5M5 12l7-7 7 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const ExpensesIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M12 5v14M5 12l7 7 7-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const SettingsIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2"/>
    <Path d="M12 1v6m0 6v6M23 12h-6m-6 0H1" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <Path d="m18.36 5.64-4.24 4.24m0 4.24 4.24 4.24M5.64 5.64l4.24 4.24m0 4.24-4.24 4.24" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

const PlusIcon = () => (
  <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <Path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  </Svg>
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 15,
          paddingTop: 10,
          borderRadius: 35,
          marginHorizontal: 20,
          marginBottom: 20,
          position: 'absolute',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 4,
        },
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Loans',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconFocused]}>
              <LoansIcon color={color} />
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Income',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconFocused]}>
              <IncomeIcon color={color} />
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="add"
        options={{
          title: '',
          tabBarIcon: () => (
            <View style={styles.addButton}>
              <PlusIcon />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconFocused]}>
              <ExpensesIcon color={color} />
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconFocused]}>
              <SettingsIcon color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  iconFocused: {
    backgroundColor: '#2a2a2a',
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
});