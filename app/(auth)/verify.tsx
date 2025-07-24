import { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, ActivityIndicator, Button, StyleSheet } from 'react-native';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const token = params.token;
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    if (!token) return;
    fetch(`http://localhost:8081/api/auth/verify-email?token=${token}`)
      .then(res => res.ok ? setStatus('success') : setStatus('error'))
      .catch(() => setStatus('error'));
  }, [token]);

  if (status === 'verifying') return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  if (status === 'success')
    return (
      <View style={styles.center}>
        <Text style={styles.success}>Email verified! You can now log in.</Text>
        <Button title="Go to Login" onPress={() => router.replace('/login')} />
      </View>
    );
  return <View style={styles.center}><Text style={styles.error}>Invalid or expired verification link.</Text></View>;
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  success: { color: 'green', fontSize: 18, marginBottom: 16, textAlign: 'center' },
  error: { color: 'red', fontSize: 18, textAlign: 'center' },
}); 