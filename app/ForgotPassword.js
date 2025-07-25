import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Missing Info', 'Please enter your email.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('https://your-backend.com/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to send reset email');
      }
      Alert.alert('Success', 'Password reset email sent!');
      router.replace('/Login');
    } catch (error) {
      Alert.alert('Error', error.message || 'Could not connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#888"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.resetBtn} onPress={handleForgotPassword} disabled={loading}>
        <Text style={styles.resetText}>{loading ? 'Sending...' : 'Send Reset Email'}</Text>
      </TouchableOpacity>
      <Text style={{ marginTop: 16 }}>
        Remembered your password?{' '}
        <Link href="/Login" style={{ color: 'blue' }}>
          Login
        </Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
    color: '#361696',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  resetBtn: {
    backgroundColor: '#361696',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  resetText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
