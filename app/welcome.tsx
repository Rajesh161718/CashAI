import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useData } from './context/DataContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';

export default function WelcomeScreen() {
    const { saveUserProfile, isDarkMode } = useData();
    const router = useRouter();

    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [age, setAge] = useState('');
    const [country, setCountry] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const colors = {
        bg: isDarkMode ? '#0f172a' : '#f8f9fa',
        text: isDarkMode ? '#f1f5f9' : '#1a1a1a',
        textSecondary: isDarkMode ? '#94a3b8' : '#64748b',
        inputBg: isDarkMode ? '#1e293b' : 'white',
        inputBorder: isDarkMode ? '#334155' : '#e5e7eb',
        inputText: isDarkMode ? '#f1f5f9' : '#1a1a1a',
        label: isDarkMode ? '#cbd5e1' : '#374151',
        accent: '#667eea',
    };

    const handleSubmit = async () => {
        if (!name || !mobile || !age || !country) {
            return;
        }

        setIsLoading(true);

        // Save profile
        await saveUserProfile({ name, mobile, age, country });

        // Small delay to show the animation
        setTimeout(() => {
            router.replace('/(tabs)');
        }, 800);
    };

    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.bg }]}>
                <MotiView
                    from={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    style={styles.loadingContent}
                >
                    <MotiView
                        from={{ rotate: '0deg' }}
                        animate={{ rotate: '360deg' }}
                        transition={{ type: 'timing', duration: 800, loop: true }}
                    >
                        <LinearGradient
                            colors={['#a8e6cf', '#7bc9a6']}
                            style={styles.loaderCircle}
                        >
                            <Ionicons name="checkmark" size={40} color="#1a1a1a" />
                        </LinearGradient>
                    </MotiView>
                    <Text style={[styles.loadingText, { color: colors.text }]}>Setting up your account...</Text>
                    <View style={[styles.progressBarContainer, { backgroundColor: colors.inputBg }]}>
                        <MotiView
                            from={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ type: 'timing', duration: 600 }}
                            style={styles.progressBar}
                        />
                    </View>
                </MotiView>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: colors.bg }]}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <MotiView
                        from={{ opacity: 0, translateY: -20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'timing', duration: 250 }}
                        style={styles.header}
                    >
                        <Image
                            source={require('../assets/images/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={[styles.title, { color: colors.text }]}>Welcome to CashLoop!</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Let's get to know you better</Text>
                    </MotiView>

                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'timing', duration: 250, delay: 100 }}
                        style={styles.form}
                    >
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.label }]}>Full Name</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.inputText }]}
                                placeholder="John Doe"
                                value={name}
                                onChangeText={setName}
                                placeholderTextColor={isDarkMode ? '#64748b' : '#9ca3af'}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.label }]}>Mobile Number</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.inputText }]}
                                placeholder="+91 98765 43210"
                                value={mobile}
                                onChangeText={setMobile}
                                keyboardType="phone-pad"
                                placeholderTextColor={isDarkMode ? '#64748b' : '#9ca3af'}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={[styles.label, { color: colors.label }]}>Age</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.inputText }]}
                                    placeholder="25"
                                    value={age}
                                    onChangeText={setAge}
                                    keyboardType="numeric"
                                    placeholderTextColor={isDarkMode ? '#64748b' : '#9ca3af'}
                                />
                            </View>
                            <View style={{ width: 16 }} />
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={[styles.label, { color: colors.label }]}>Country</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.inputText }]}
                                    placeholder="India"
                                    value={country}
                                    onChangeText={setCountry}
                                    placeholderTextColor={isDarkMode ? '#64748b' : '#9ca3af'}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={handleSubmit}
                            activeOpacity={0.8}
                            disabled={!name || !mobile || !age || !country}
                        >
                            <LinearGradient
                                colors={['#a8e6cf', '#7bc9a6']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={[styles.submitButton, (!name || !mobile || !age || !country) && styles.disabledButton]}
                            >
                                <Text style={styles.submitButtonText}>Get Started</Text>
                                <Ionicons name="arrow-forward" size={20} color="#1a1a1a" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </MotiView>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
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
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 24,
    },
    title: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 32,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 16,
        textAlign: 'center',
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 14,
        marginLeft: 4,
    },
    input: {
        fontFamily: 'Outfit_500Medium',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
    },
    row: {
        flexDirection: 'row',
    },
    submitButton: {
        flexDirection: 'row',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
        gap: 10,
    },
    disabledButton: {
        opacity: 0.5,
        shadowOpacity: 0,
        elevation: 0,
    },
    submitButtonText: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 18,
        color: '#1a1a1a',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContent: {
        alignItems: 'center',
        gap: 24,
        width: '80%',
    },
    loaderCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#a8e6cf',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    loadingText: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 18,
        textAlign: 'center',
    },
    progressBarContainer: {
        width: '100%',
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#a8e6cf',
        borderRadius: 3,
    },
});
