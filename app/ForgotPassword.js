import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

const ForgotPasswordScreen = ({ navigation }) => {
  const [identifier, setIdentifier] = useState(''); // For username or email
  const [token, setToken] = useState('');

  const handleForgotPassword = async () => {
    if (!identifier) {
      Alert.alert('Error', 'Please enter your username or email.');
      return;
    }

    try {
      const response = await fetch('https://your-backend.com/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }), // assuming your backend handles either
      });

      const text = await response.text();

      if (text.includes('Reset token')) {
        const tokenValue = text.split(':')[1].trim();
        setToken(tokenValue);
        Alert.alert('Success', 'Token received. Continue to reset.');
      } else {
        Alert.alert('Error', text);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong.');
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <Text style={styles.title}>Forgot Password</Text>

        <TextInput
          placeholder="Enter your username or email"
          value={identifier}
          onChangeText={setIdentifier}
          style={styles.input}
          placeholderTextColor="#999"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
          <Text style={styles.buttonText}>Request Reset Token</Text>
        </TouchableOpacity>

        {token ? (
          <>
            <Text style={styles.token}>Token: {token}</Text>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() =>
                navigation.navigate('ResetPassword', {
                  identifier,
                  token,
                })
              }
            >
              <Text style={styles.secondaryButtonText}>Request Reset Token</Text>
            </TouchableOpacity>
          </>
        ) : null}
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
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
  button: {
    backgroundColor: '#361696',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  token: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  secondaryButton: {
    borderColor: '#361696',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#361696',
    fontWeight: '600',
    fontSize: 15,
  },
});
