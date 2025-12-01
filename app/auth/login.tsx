import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../lib/supabase';
import { useData } from '../context/DataContext';

export default function LoginScreen() {
    const router = useRouter();
    const { isDarkMode } = useData();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'input' | 'otp'>('input');
    const [loading, setLoading] = useState(false);

    const colors = {
        bg: isDarkMode ? '#0f172a' : '#f8f9fa',
        text: isDarkMode ? '#f1f5f9' : '#1a1a1a',
        textSecondary: isDarkMode ? '#94a3b8' : '#64748b',
        inputBg: isDarkMode ? '#1e293b' : 'white',
        inputBorder: isDarkMode ? '#334155' : '#e5e7eb',
        inputText: isDarkMode ? '#f1f5f9' : '#1a1a1a',
        label: isDarkMode ? '#cbd5e1' : '#374151',
    };

    const handleSendOtp = async () => {
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email: email.toLowerCase().trim(),
            });

            if (error) throw error;

            setStep('otp');
            Alert.alert('OTP Sent', 'Check your email for the verification code.');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            Alert.alert('Invalid OTP', 'Please enter the 6-digit code.');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.verifyOtp({
                email: email.toLowerCase().trim(),
                token: otp,
                type: 'email',
            });

            if (error) throw error;

            if (router.canGoBack()) {
                router.back();
            } else {
                router.replace('/(tabs)');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: colors.bg }]}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>
                    {step === 'input' ? 'Welcome Back' : 'Verify OTP'}
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    {step === 'input'
                        ? 'Enter your email address'
                        : `Enter the code sent to ${email}`}
                </Text>
            </View>

            <View style={styles.form}>
                {step === 'input' ? (
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.label }]}>Email Address</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.inputText }]}
                            placeholder="you@example.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor={isDarkMode ? '#64748b' : '#9ca3af'}
                            autoFocus
                        />
                    </View>
                ) : (
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.label }]}>OTP Code</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.inputText, letterSpacing: 8, textAlign: 'center', fontSize: 24 }]}
                            placeholder="000000"
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="number-pad"
                            maxLength={6}
                            placeholderTextColor={isDarkMode ? '#64748b' : '#9ca3af'}
                            autoFocus
                        />
                    </View>
                )}

                <TouchableOpacity
                    onPress={step === 'input' ? handleSendOtp : handleVerifyOtp}
                    activeOpacity={0.8}
                    disabled={loading}
                >
                    <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.submitButton}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Text style={styles.submitButtonText}>
                                    {step === 'input' ? 'Send Code' : 'Verify & Login'}
                                </Text>
                                <Ionicons name="arrow-forward" size={20} color="white" />
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>

                {step === 'otp' && (
                    <TouchableOpacity onPress={() => setStep('input')} style={styles.changePhoneButton}>
                        <Text style={[styles.changePhoneText, { color: colors.textSecondary }]}>
                            Change Email
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    header: {
        marginTop: 40,
        marginBottom: 40,
    },
    backButton: {
        marginBottom: 20,
    },
    title: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 32,
        marginBottom: 8,
    },
    subtitle: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 16,
    },
    form: {
        gap: 24,
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
        fontSize: 18,
        borderWidth: 1,
    },
    submitButton: {
        flexDirection: 'row',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
        gap: 10,
    },
    submitButtonText: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 18,
        color: 'white',
    },
    changePhoneButton: {
        alignItems: 'center',
        marginTop: 10,
    },
    changePhoneText: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});
