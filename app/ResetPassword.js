import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
//import Layout from '../components/Layout';

const ResetPasswordScreen = ({ route, navigation }) => {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (route.params) {
      setUsername(route.params.username || '');
      setToken(route.params.token || '');
    }
  }, [route.params]);

  const handleResetPassword = async () => {
    if (!username || !token || !newPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('https://your-backend.com/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, token, newPassword }),
      });

      const text = await response.text();

      if (text.includes('successful')) {
        Alert.alert('Success', 'Your password has been reset.', [
          { text: 'OK', onPress: () => navigation.replace('SignIn') },
        ]);
      } else {
        Alert.alert('Error', text);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong.');
      console.error(error);
    }
  };

  return (
    <Layout noScroll>
      <Text style={styles.title}>Reset Your Password</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Reset Token"
        value={token}
        onChangeText={setToken}
        style={styles.input}
      />
      <TextInput
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </Layout>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
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
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
