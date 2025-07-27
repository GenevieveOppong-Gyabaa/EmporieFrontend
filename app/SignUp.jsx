import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { API_ENDPOINTS } from '../constants/config';
import { useUser } from '../context/userContext';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Missing Info', 'Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Registration error response:', errorData);
        throw new Error(errorData.message || 'Sign up failed');
      }
      const data = await response.json();
      console.log('Registration backend response:', data);
      if (!data.id || !data.accessToken) {
        throw new Error('Registration did not return user id or token');
      }
      setUser({ id: data.id, email: data.email, token: data.accessToken });
      Alert.alert('Success', 'Account created!');
      router.replace('./(tabs)/Home');
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', error.message || 'Could not connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Text style={styles.title}>Create an account</Text>
      <Image source={require('../assets/images/signUpImage.png')} style={styles.girl}/>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#888"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={styles.signUpBtn} onPress={handleSignUp} disabled={loading}>
        <Text style={styles.signUpText}>{loading ? 'Signing up...' : 'Sign Up'}</Text>
      </TouchableOpacity>
      <Text style={{ marginTop: 16 }}>
        Already have an account?{' '}
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: 80,
  },
  girl: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#361696',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 28,
    alignItems: 'center',
    width: '80%',
    marginTop: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    opacity: 0.5,
    marginTop: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#361696',
    marginTop: 40,
  },
  signUpBtn: {
    backgroundColor: '#361696',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 28,
    alignItems: 'center',
    width: '80%',
    marginTop: 20,
  },
  signUpText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
