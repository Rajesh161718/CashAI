import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function TabLayout() {

    const insets = useSafeAreaInsets();

    const colors = {
        tabBarBg: '#2d2d2d',
        activeColor: '#a8e6cf',
        inactiveColor: '#666666',
    };

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: [
                    styles.tabBar,
                    {
                        backgroundColor: colors.tabBarBg,
                        height: (Platform.OS === 'ios' ? 85 : 65) + insets.bottom,
                        paddingBottom: (Platform.OS === 'ios' ? 20 : 8) + insets.bottom,
                    }
                ],
                tabBarShowLabel: false,
                tabBarActiveTintColor: colors.activeColor,
                tabBarInactiveTintColor: colors.inactiveColor,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Loans',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[styles.iconContainer, focused && { backgroundColor: 'rgba(168, 230, 207, 0.15)' }]}>
                            <Ionicons
                                name={focused ? "people" : "people-outline"}
                                size={24}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Cash Flow',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[styles.iconContainer, focused && { backgroundColor: 'rgba(168, 230, 207, 0.15)' }]}>
                            <Ionicons
                                name={focused ? "wallet" : "wallet-outline"}
                                size={24}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    title: 'Add',
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.addButtonWrapper}>
                            <LinearGradient
                                colors={['#a8e6cf', '#7bc9a6']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.addButton}
                            >
                                <Ionicons
                                    name="add"
                                    size={32}
                                    color="#1a1a1a"
                                />
                            </LinearGradient>
                        </View>
                    ),
                }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        navigation.navigate('add');
                    },
                })}
            />
            <Tabs.Screen
                name="reports"
                options={{
                    title: 'Reports',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[styles.iconContainer, focused && { backgroundColor: 'rgba(168, 230, 207, 0.15)' }]}>
                            <Ionicons
                                name={focused ? "bar-chart" : "bar-chart-outline"}
                                size={24}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[styles.iconContainer, focused && { backgroundColor: 'rgba(168, 230, 207, 0.15)' }]}>
                            <Ionicons
                                name={focused ? "settings" : "settings-outline"}
                                size={24}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        // Height and paddingBottom are now handled dynamically in the component
        borderTopWidth: 0,
        elevation: 0,
        paddingTop: 8,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonWrapper: {
        top: -20,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#2d2d2d', // Matches tabBarBg
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    addButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
