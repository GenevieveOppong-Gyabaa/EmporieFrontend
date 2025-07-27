import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import EmporieLogo from '../assets/images/Emporie-logo.png'; // Update the path if different


const CustomerInfoScreen = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const validateAndSave = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter your name.');
      return;
    }
    if (!phone.trim() || !/^\d{10,15}$/.test(phone)) {
      Alert.alert('Validation Error', 'Please enter a valid phone number.');
      return;
    }
    if (
      !email.trim() ||
      !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
    ) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    Alert.alert('Success', 'Your information has been updated!');
  };

  const fadeAnim = useRef(new Animated.Value(0.2)).current;

useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.08,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0.2,
        duration: 2000,
        useNativeDriver: true,
      }),
    ])
  ).start();
}, []);

  return (
    <SafeAreaView style={styles.container}>
  <StatusBar barStyle="dark-content" backgroundColor="#fff" />

  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1 }}
  >
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.form}>
        <Text style={styles.heading}>Update Your Information</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={validateAndSave}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>

  {/* Logo watermark */}
 <Animated.Image source={EmporieLogo} style={[styles.logoWatermark, { opacity: fadeAnim }]} />
</SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
 scrollContent: {
  flexGrow: 1,
  paddingTop: 40, // Adjust as needed
  paddingHorizontal: 16,
  paddingBottom: 40,
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#361696',
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
 logoWatermark: {
  position: 'absolute',
  bottom: 20,
  right: 20,
  width: 60,
  height: 60,
  borderRadius: 30,
  opacity: 0.05,
  backgroundColor: '#fff', // Optional: to help it blend softly
  overflow: 'hidden',
},


},


);

export default CustomerInfoScreen;
