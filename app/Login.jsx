import { useFonts } from 'expo-font';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    PoppinsBold: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Info', 'Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://your-backend.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed');
      }
      // Optionally save token here
      Alert.alert('Success', 'Logged in successfully!');
      router.replace('./(tabs)/Home');
    } catch (error) {
      Alert.alert('Error', error.message || 'Could not connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
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
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <View style={[styles.inputContainer, { marginTop: 24 }]}>
          <Text style={styles.text}>Password</Text>
          <TextInput
            style={styles.textInput}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>
        <Text style={{ marginTop: 16 }}>
          Don't have an account?{' '}
          <Link href="/SignUp" style={{ color: 'blue' }}>
            Sign Up
          </Link>
        </Text>
        <Text style={{ marginTop: 8 }}>
          <Link href="/ForgotPassword" style={{ color: 'blue' }}>
            Forgot Password?
          </Link>
        </Text>
      </KeyboardAvoidingView>
    </View>
  );
}

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
