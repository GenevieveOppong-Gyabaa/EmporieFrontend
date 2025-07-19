import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Link } from 'expo-router';

export default function UserInfoScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');

  const handleContinue = () => {
    if (!firstName || !lastName || !password) {
      Alert.alert('Missing Info', 'Please fill in all fields.');
      return;
    }

    // You can store or send the data here (e.g., via API)
    Alert.alert('Welcome', `Hi ${firstName} ${lastName}!`);

    router.replace('./(tabs)/Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let's Get to Know You</Text>

      <TextInput
        placeholder="First Name"
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholderTextColor="#888"
      />

      <TextInput
        placeholder="Last Name"
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholderTextColor="#888"
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />
       <Text style={{ marginTop: 2 }}>
              Forgot Password?{" "}
              <Link href="/ForgotPassword" style={{ color: 'blue' }}>
                Change
              </Link>
            </Text>

      <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    marginBottom: 100,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 30,
  },
  continueBtn: {
    backgroundColor: '#4B2994',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
