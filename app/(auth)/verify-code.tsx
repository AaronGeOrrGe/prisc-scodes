import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function VerifyCodeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = typeof params.email === 'string' ? params.email : '';
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleVerify = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8081/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.replace('/(drawer)/(tabs)/mirror'), 1000);
      } else {
        const msg = await res.text();
        setError(msg || 'Invalid or expired code.');
      }
    } catch (e) {
      setError('Network error.');
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8081/api/auth/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        Alert.alert('Code resent', 'A new verification code has been sent to your email.');
      } else {
        const msg = await res.text();
        setError(msg || 'Could not resend code.');
      }
    } catch (e) {
      setError('Network error.');
    }
    setResendLoading(false);
  };

  return (
    <LinearGradient colors={["#A07BB7", "#F6F2F7"]} style={{ flex: 1 }}>
      <View style={styles.center}>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>Enter the 6-digit code sent to:</Text>
        <Text style={styles.email}>{email}</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter code"
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
          maxLength={6}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading || code.length !== 6}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.resendBtn} onPress={handleResend} disabled={resendLoading}>
          <Text style={styles.resendText}>{resendLoading ? 'Resending...' : 'Resend Code'}</Text>
        </TouchableOpacity>
        {success && <Text style={styles.success}>Verified! Redirecting...</Text>}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#6C47A6', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#333', marginBottom: 2 },
  email: { fontSize: 16, color: '#A07BB7', marginBottom: 16 },
  input: { width: 180, borderWidth: 1, borderColor: '#A07BB7', borderRadius: 8, padding: 12, fontSize: 20, textAlign: 'center', backgroundColor: '#fff', marginBottom: 12 },
  button: { backgroundColor: '#A07BB7', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 32, marginTop: 8, marginBottom: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  resendBtn: { marginTop: 8 },
  resendText: { color: '#6C47A6', textDecorationLine: 'underline', fontSize: 15 },
  error: { color: '#d32f2f', marginTop: 8, marginBottom: 4, textAlign: 'center' },
  success: { color: 'green', marginTop: 12, fontSize: 16 },
}); 