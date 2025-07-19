import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useFonts } from 'expo-font';
import { Poppins_700Bold } from '@expo-google-fonts/poppins';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', password: '' });

  const [fontsLoaded] = useFonts({
    PoppinsBold: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const handleLogin = async () => {
    let usernameError = '';
    let passwordError = '';

    if (!username) usernameError = 'Username is required.';
    if (!password) passwordError = 'Password is required.';

    setErrors({ username: usernameError, password: passwordError });
    if (usernameError || passwordError) return;

    try {
      const response = await fetch('http://your-backend-url.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        Alert.alert('Login Failed', error.message || 'Invalid credentials.');
        return;
      }

      const data = await response.json();
      Alert.alert('Login Successful', `Welcome ${data.username}!`);
    } catch (error) {
      Alert.alert('Network Error', 'Please try again later.');
    }
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      {/* Watermark image */}
      <Image
        source={require('../assets/images/Emporie-logo.png')} // Replace with your logo
        style={styles.watermark}
        resizeMode="contain"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.innerContainer}
      >
        <Text style={[styles.header, { fontFamily: 'PoppinsBold' }]}>Login</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.text}>Username</Text>
          <TextInput
            style={styles.textInput}
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              if (text) setErrors((prev) => ({ ...prev, username: '' }));
            }}
            autoCapitalize="none"
          />
          {errors.username ? <Text style={styles.helperText}>{errors.username}</Text> : null}
        </View>

        <View style={[styles.inputContainer, { marginTop: 24 }]}>
          <Text style={styles.text}>Password</Text>
          <TextInput
            style={styles.textInput}
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (text) setErrors((prev) => ({ ...prev, password: '' }));
            }}
          />
          {errors.password ? <Text style={styles.helperText}>{errors.password}</Text> : null}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  watermark: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    width: '80%',
    height: '40%',
    opacity: 0.06,
    zIndex: -1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#391696',
    marginBottom: 50,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
  },
  textInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#c3c3c3',
    borderRadius: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  helperText: {
    fontSize: 13,
    color: '#cc0000',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#391696',
    marginTop: 50,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  text: {
    color: '#361696',
    marginBottom: 10,
    fontSize: 16,
  },
});
