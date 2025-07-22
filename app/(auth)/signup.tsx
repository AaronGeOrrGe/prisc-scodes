// app/signup.tsx
import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Image, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/Colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing } from 'react-native-reanimated';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [fontsLoaded] = useFonts({
    'JetBrainsMono-Medium': require('../../assets/fonts/fonts/ttf/JetBrainsMono-Medium.ttf'),
  });

  // Animations
  const scale = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(50);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    headerOpacity.value = withTiming(1, { duration: 800 });
    cardTranslateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.ease) });
    cardOpacity.value = withTiming(1, { duration: 800 });
  }, []);

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ scale: scale.value }],
  }));
  const animatedCardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSignup = async () => {
    setError('');
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill out all fields.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      setError('Password must be 8+ characters and include uppercase, lowercase, number, and symbol.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      // Simulate a successful signup
      setTimeout(() => {
        router.replace('/(drawer)/(tabs)/mirror');
      }, 1000);
    } catch (err) {
      setError('Network error. Please check your connection.');
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#A07BB7", "#F6F2F7"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled" enableOnAndroid>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
              {/* Logo and header */}
              <Animated.View style={[{ alignItems: 'center', marginBottom: 24 }, animatedHeaderStyle]}>
                <Image source={require('../../assets/images/homepage (1).png')} style={{ width: 80, height: 80, marginBottom: 12, borderRadius: 40, borderWidth: 2, borderColor: '#fff' }} resizeMode="cover" />
                <Text style={{ fontFamily: 'JetBrainsMono-Medium', fontSize: 28, color: '#fff', fontWeight: 'bold', letterSpacing: 1 }}>Create Account</Text>
                <Text style={{ color: '#fff', fontSize: 16, marginTop: 4, opacity: 0.85 }}>Join Forge and start designing!</Text>
              </Animated.View>
              {/* Card */}
              <Animated.View style={[styles.card, animatedCardStyle]}>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={18} color="#888" style={{ marginRight: 10 }} />
                  <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor="#aaa"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={18} color="#888" style={{ marginRight: 10 }} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="#aaa"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={18} color="#888" style={{ marginRight: 10 }} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    placeholderTextColor="#aaa"
                  />
                  <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)} style={{ padding: 8 }}>
                    <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={18} color="#888" />
                  </TouchableOpacity>
                </View>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={18} color="#888" style={{ marginRight: 10 }} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    autoCapitalize="none"
                    placeholderTextColor="#aaa"
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword((prev) => !prev)} style={{ padding: 8 }}>
                    <Ionicons name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={18} color="#888" />
                  </TouchableOpacity>
                </View>
                {/* Gradient Button */}
                <TouchableOpacity
                  style={{ marginTop: 10, marginBottom: 10 }}
                  activeOpacity={0.85}
                  onPress={handleSignup}
                  disabled={loading}
                >
                  <LinearGradient colors={["#A07BB7", "#6C47A6"]} style={styles.signupButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    <Text style={styles.buttonText}>{loading ? 'Signing up...' : 'Sign Up'}</Text>
                  </LinearGradient>
                </TouchableOpacity>
                {/* Divider */}
                <View style={styles.dividerRow}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.divider} />
                </View>
                {/* Social login placeholder */}
                <TouchableOpacity style={styles.socialButton} disabled>
                  <Ionicons name="logo-google" size={20} color="#EA4335" />
                  <Text style={styles.socialButtonText}>Continue with Google</Text>
                </TouchableOpacity>
                {/* Switch to login */}
                <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                  <Text style={styles.switchText}>
                    Already have an account? <Text style={styles.link}>Log in</Text>
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </KeyboardAwareScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#A07BB7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#faf7fd',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 8,
    fontSize: 16,
    color: '#333',
    fontFamily: 'JetBrainsMono-Medium',
  },
  signupButton: {
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#A07BB7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 15,
  },
  switchText: {
    textAlign: 'center',
    fontSize: 15,
    marginTop: 10,
  },
  link: {
    color: '#A07BB7',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#aaa',
    fontWeight: 'bold',
    fontSize: 13,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingVertical: 10,
    marginBottom: 10,
    opacity: 0.7,
  },
  socialButtonText: {
    marginLeft: 8,
    color: '#333',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
