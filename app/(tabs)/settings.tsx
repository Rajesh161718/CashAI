import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, SafeAreaView, Alert, Share, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { useData } from '../context/DataContext';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
// Import legacy API as suggested by the error message
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

export default function SettingsScreen() {
    const { userProfile, isDarkMode, toggleDarkMode, loans, income, expenses, clearAllData, saveUserProfile } = useData();
    const { user, signOut } = useAuth();
    const router = useRouter();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editName, setEditName] = useState(userProfile?.name || '');
    const [editMobile, setEditMobile] = useState(userProfile?.mobile || user?.phone || '');
    const [editEmail, setEditEmail] = useState(userProfile?.email || user?.email || '');

    const handleSaveProfile = () => {
        if (!editName.trim()) {
            Alert.alert('Error', 'Name cannot be empty');
            return;
        }

        saveUserProfile({
            name: editName.trim(),
            mobile: editMobile.trim(),
            email: editEmail.trim(),
            age: userProfile?.age || '',
            country: userProfile?.country || ''
        });
        setIsEditingProfile(false);
        Alert.alert('Success', 'Profile updated successfully');
    };

    const colors = {
        bg: isDarkMode ? '#1a1a1a' : '#f5f5f5',
        cardBg: isDarkMode ? '#2d2d2d' : '#ffffff',
        text: isDarkMode ? '#ffffff' : '#1a1a1a',
        textSecondary: isDarkMode ? '#a3a3a3' : '#666666',
        border: isDarkMode ? '#3d3d3d' : '#e5e5e5',
        accent: '#a8e6cf',
        red: '#ff6b6b',
    };

    const handleBackupData = async () => {
        try {
            const data = {
                userProfile,
                loans,
                income,
                expenses,
                exportDate: new Date().toISOString(),
                appVersion: '1.0.0'
            };

            const jsonData = JSON.stringify(data, null, 2);
            const fileName = `cashloop_backup_${new Date().getTime()}.json`;
            // Use cacheDirectory for better sharing support
            const fileUri = FileSystem.cacheDirectory + fileName;

            await FileSystem.writeAsStringAsync(fileUri, jsonData, {
                encoding: 'utf8'
            });

            const canShare = await Sharing.isAvailableAsync();
            if (canShare) {
                await Sharing.shareAsync(fileUri, {
                    mimeType: 'application/json',
                    dialogTitle: 'Save CashLoop Backup',
                    UTI: 'public.json'
                });
            } else {
                Alert.alert('Info', 'Sharing is not available on this device');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to create backup. Please try again.');
            console.error('Backup error:', error);
        }
    };

    const handleClearData = () => {
        Alert.alert(
            'Clear All Data',
            'Are you sure you want to delete all your data? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete All',
                    style: 'destructive',
                    onPress: () => {
                        clearAllData();
                        Alert.alert('Success', 'All data has been cleared.');
                    }
                }
            ]
        );
    };

    const handleShareApp = async () => {
        try {
            await Share.share({
                message: 'Check out CashLoop - The best app to manage your loans, income, and expenses! 💰',
                title: 'CashLoop App'
            });
        } catch (error) {
            console.error('Share error:', error);
        }
    };

    const handleRateApp = () => {
        Alert.alert(
            'Rate CashLoop',
            'Thank you for using CashLoop! Would you like to rate us on the app store?',
            [
                { text: 'Later', style: 'cancel' },
                {
                    text: 'Rate Now',
                    onPress: () => {
                        // In production, replace with actual app store link
                        Alert.alert('Thank you!', 'This would open the app store in production.');
                    }
                }
            ]
        );
    };

    const handleAboutApp = () => {
        Alert.alert(
            'About CashLoop',
            'CashLoop v1.0.0\n\nA simple and elegant app to manage your loans, income, and expenses.\n\nDeveloped by Rajesh with ❤️ using React Native & Expo',
            [{ text: 'OK' }]
        );
    };

    const handlePrivacyPolicy = () => {
        Alert.alert(
            'Privacy Policy',
            'CashLoop stores all your data locally on your device. We do not collect, share, or transmit any of your personal information to external servers.\n\nYour data is completely private and secure.',
            [{ text: 'OK' }]
        );
    };

    const handleHelp = () => {
        Alert.alert(
            'Help & Support',
            'Need help with CashLoop?\n\n• Tap the + button to add transactions\n• Swipe to delete items\n• Use the Settle button to mark loans as returned\n• Enable Dark Mode for better night viewing\n\nFor more support, contact us at support@cashloop.app',
            [{ text: 'OK' }]
        );
    };

    const handleExportCSV = async () => {
        try {
            // Create CSV content
            let csvContent = 'Type,Name,Amount,Date,Note,Status\n';

            loans.forEach(loan => {
                csvContent += `Loan,${loan.name},${loan.amount},${loan.date},"${loan.note || ''}",${loan.returned ? 'Returned' : 'Active'}\n`;
            });

            const fileName = `cashloop_export_${new Date().getTime()}.csv`;
            // Use cacheDirectory for better sharing support
            const fileUri = FileSystem.cacheDirectory + fileName;

            await FileSystem.writeAsStringAsync(fileUri, csvContent, {
                encoding: 'utf8'
            });

            const canShare = await Sharing.isAvailableAsync();
            if (canShare) {
                await Sharing.shareAsync(fileUri, {
                    mimeType: 'text/csv',
                    dialogTitle: 'Export CashLoop Data',
                    UTI: 'public.comma-separated-values-text'
                });
            } else {
                Alert.alert('Info', 'Sharing is not available on this device');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to export data. Please try again.');
            console.error('Export error:', error);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.bg }]}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.headerSection}>
                        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
                    </View>


                    {/* Profile Section */}
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 100 }}
                        style={styles.section}
                    >
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ACCOUNT</Text>

                        {user ? (
                            <View style={[styles.profileCard, { backgroundColor: colors.cardBg }]}>
                                <LinearGradient
                                    colors={['#a8e6cf', '#7bc9a6']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.profileAvatar}
                                >
                                    <Text style={styles.profileAvatarText}>
                                        {userProfile?.name?.charAt(0).toUpperCase() || 'U'}
                                    </Text>
                                </LinearGradient>
                                <View style={styles.profileInfo}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text style={[styles.profileName, { color: colors.text }]}>{userProfile?.name || 'User'}</Text>
                                        <TouchableOpacity onPress={() => {
                                            setEditName(userProfile?.name || '');
                                            setEditMobile(userProfile?.mobile || user?.phone || '');
                                            setEditEmail(userProfile?.email || user?.email || '');
                                            setIsEditingProfile(true);
                                        }}>
                                            <Ionicons name="pencil" size={20} color={colors.accent} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={[styles.profileDetailText, { color: colors.textSecondary, marginBottom: 4 }]}>
                                        {userProfile?.mobile || user?.phone}
                                    </Text>
                                    {userProfile?.email && (
                                        <Text style={[styles.profileDetailText, { color: colors.textSecondary, marginBottom: 8 }]}>
                                            {userProfile.email}
                                        </Text>
                                    )}
                                    <TouchableOpacity
                                        onPress={signOut}
                                        style={{ backgroundColor: colors.red + '20', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start' }}
                                    >
                                        <Text style={{ color: colors.red, fontFamily: 'Outfit_600SemiBold', fontSize: 12 }}>Sign Out</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <TouchableOpacity
                                onPress={() => router.push('/auth/login')}
                                activeOpacity={0.9}
                            >
                                <LinearGradient
                                    colors={['#a8e6cf', '#7bc9a6']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={[styles.profileCard, { borderWidth: 0 }]}
                                >
                                    <View style={[styles.iconBg, { backgroundColor: 'rgba(0,0,0,0.1)' }]}>
                                        <Ionicons name="log-in-outline" size={24} color="#1a1a1a" />
                                    </View>
                                    <View style={styles.profileInfo}>
                                        <Text style={[styles.profileName, { color: '#1a1a1a' }]}>Sign In to CashLoop</Text>
                                        <Text style={{ color: 'rgba(0,0,0,0.6)', fontFamily: 'Outfit_400Regular' }}>
                                            Sync your loans and connect with friends
                                        </Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={24} color="#1a1a1a" />
                                </LinearGradient>
                            </TouchableOpacity>
                        )}
                    </MotiView>

                    {/* Preferences Section */}
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 200 }}
                        style={styles.section}
                    >
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>PREFERENCES</Text>

                        <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
                            <View style={styles.row}>
                                <View style={styles.rowLeft}>
                                    <View style={[styles.iconBg, { backgroundColor: colors.accent + '20' }]}>
                                        <Ionicons name="moon" size={20} color={colors.accent} />
                                    </View>
                                    <Text style={[styles.rowLabel, { color: colors.text }]}>Dark Mode</Text>
                                </View>
                                <Switch
                                    value={isDarkMode}
                                    onValueChange={toggleDarkMode}
                                    trackColor={{ false: '#e5e7eb', true: colors.accent }}
                                    thumbColor={isDarkMode ? '#ffffff' : '#f3f4f6'}
                                />
                            </View>

                            <View style={[styles.divider, { backgroundColor: colors.border }]} />

                            <View style={styles.row}>
                                <View style={styles.rowLeft}>
                                    <View style={[styles.iconBg, { backgroundColor: '#ff9800' + '20' }]}>
                                        <Ionicons name="notifications" size={20} color="#ff9800" />
                                    </View>
                                    <Text style={[styles.rowLabel, { color: colors.text }]}>Notifications</Text>
                                </View>
                                <Switch
                                    value={notificationsEnabled}
                                    onValueChange={setNotificationsEnabled}
                                    trackColor={{ false: '#e5e7eb', true: colors.accent }}
                                    thumbColor={notificationsEnabled ? '#ffffff' : '#f3f4f6'}
                                />
                            </View>
                        </View>
                    </MotiView>

                    {/* Data Management Section */}
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 300 }}
                        style={styles.section}
                    >
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>DATA MANAGEMENT</Text>

                        <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
                            <TouchableOpacity style={styles.row} onPress={handleBackupData}>
                                <View style={styles.rowLeft}>
                                    <View style={[styles.iconBg, { backgroundColor: '#2196f3' + '20' }]}>
                                        <Ionicons name="cloud-upload" size={20} color="#2196f3" />
                                    </View>
                                    <Text style={[styles.rowLabel, { color: colors.text }]}>Backup Data</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                            </TouchableOpacity>

                            <View style={[styles.divider, { backgroundColor: colors.border }]} />

                            <TouchableOpacity style={styles.row} onPress={handleExportCSV}>
                                <View style={styles.rowLeft}>
                                    <View style={[styles.iconBg, { backgroundColor: '#4caf50' + '20' }]}>
                                        <Ionicons name="document-text" size={20} color="#4caf50" />
                                    </View>
                                    <Text style={[styles.rowLabel, { color: colors.text }]}>Export CSV</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                            </TouchableOpacity>

                            <View style={[styles.divider, { backgroundColor: colors.border }]} />

                            <TouchableOpacity style={styles.row} onPress={handleClearData}>
                                <View style={styles.rowLeft}>
                                    <View style={[styles.iconBg, { backgroundColor: colors.red + '20' }]}>
                                        <Ionicons name="trash" size={20} color={colors.red} />
                                    </View>
                                    <Text style={[styles.rowLabel, { color: colors.red }]}>Clear All Data</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    </MotiView>

                    {/* App Section */}
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 400 }}
                        style={styles.section}
                    >
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>APP</Text>

                        <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
                            <TouchableOpacity style={styles.row} onPress={handleShareApp}>
                                <View style={styles.rowLeft}>
                                    <View style={[styles.iconBg, { backgroundColor: '#9c27b0' + '20' }]}>
                                        <Ionicons name="share-social" size={20} color="#9c27b0" />
                                    </View>
                                    <Text style={[styles.rowLabel, { color: colors.text }]}>Share App</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                            </TouchableOpacity>

                            <View style={[styles.divider, { backgroundColor: colors.border }]} />

                            <TouchableOpacity style={styles.row} onPress={handleRateApp}>
                                <View style={styles.rowLeft}>
                                    <View style={[styles.iconBg, { backgroundColor: '#ffc107' + '20' }]}>
                                        <Ionicons name="star" size={20} color="#ffc107" />
                                    </View>
                                    <Text style={[styles.rowLabel, { color: colors.text }]}>Rate App</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                            </TouchableOpacity>

                            <View style={[styles.divider, { backgroundColor: colors.border }]} />

                            <TouchableOpacity style={styles.row} onPress={handleHelp}>
                                <View style={styles.rowLeft}>
                                    <View style={[styles.iconBg, { backgroundColor: '#009688' + '20' }]}>
                                        <Ionicons name="help-circle" size={20} color="#009688" />
                                    </View>
                                    <Text style={[styles.rowLabel, { color: colors.text }]}>Help & Support</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    </MotiView>

                    {/* About Section */}
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 500 }}
                        style={styles.section}
                    >
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ABOUT</Text>

                        <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
                            <TouchableOpacity style={styles.row} onPress={handleAboutApp}>
                                <View style={styles.rowLeft}>
                                    <View style={[styles.iconBg, { backgroundColor: '#e91e63' + '20' }]}>
                                        <Ionicons name="information-circle" size={20} color="#e91e63" />
                                    </View>
                                    <Text style={[styles.rowLabel, { color: colors.text }]}>About App</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                            </TouchableOpacity>

                            <View style={[styles.divider, { backgroundColor: colors.border }]} />

                            <TouchableOpacity style={styles.row} onPress={handlePrivacyPolicy}>
                                <View style={styles.rowLeft}>
                                    <View style={[styles.iconBg, { backgroundColor: '#3f51b5' + '20' }]}>
                                        <Ionicons name="shield-checkmark" size={20} color="#3f51b5" />
                                    </View>
                                    <Text style={[styles.rowLabel, { color: colors.text }]}>Privacy Policy</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    </MotiView>

                    <View style={styles.footer}>
                        <Text style={[styles.version, { color: colors.textSecondary }]}>CashLoop v1.0.0</Text>
                        <Text style={[styles.copyright, { color: colors.textSecondary }]}>Made with ❤️ for better finance management</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>

            {/* Edit Profile Modal */}
            <Modal
                visible={isEditingProfile}
                transparent
                animationType="slide"
                onRequestClose={() => setIsEditingProfile(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalContainer}
                >
                    <View style={[styles.modalContent, { backgroundColor: colors.cardBg }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Profile</Text>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Full Name</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }]}
                                value={editName}
                                onChangeText={setEditName}
                                placeholder="Enter your name"
                                placeholderTextColor={colors.textSecondary}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Mobile Number</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }]}
                                value={editMobile}
                                onChangeText={setEditMobile}
                                placeholder="Enter mobile number"
                                placeholderTextColor={colors.textSecondary}
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Email Address</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }]}
                                value={editEmail}
                                onChangeText={setEditEmail}
                                placeholder="Enter email address"
                                placeholderTextColor={colors.textSecondary}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: colors.bg }]}
                                onPress={() => setIsEditingProfile(false)}
                            >
                                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: colors.accent }]}
                                onPress={handleSaveProfile}
                            >
                                <Text style={[styles.modalButtonText, { color: '#1a1a1a' }]}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
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
        paddingBottom: 120,
    },
    headerSection: {
        marginBottom: 24,
        paddingTop: 40,
    },
    headerTitle: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 32,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 12,
        marginBottom: 12,
        marginLeft: 4,
        letterSpacing: 1.2,
    },
    card: {
        borderRadius: 24,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    profileCard: {
        flexDirection: 'row',
        padding: 20,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    profileAvatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    profileAvatarText: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 28,
        color: '#1a1a1a',
    },
    profileInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    profileName: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 20,
        marginBottom: 8,
    },
    profileDetails: {
        gap: 6,
    },
    profileDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    profileDetailText: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 14,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    divider: {
        height: 1,
        marginHorizontal: 16,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBg: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    rowLabel: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 16,
    },
    footer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
        gap: 8,
    },
    version: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 14,
    },
    copyright: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 12,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        padding: 24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        minHeight: 300,
    },
    modalTitle: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 24,
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 14,
        marginBottom: 8,
    },
    input: {
        fontFamily: 'Outfit_500Medium',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 16,
    },
    modalButton: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalButtonText: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 16,
    },
});
