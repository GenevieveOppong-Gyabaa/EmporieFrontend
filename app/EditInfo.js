import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const STATUS_BAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function EditInfoScreen() {
  const navigation = useNavigation();

  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
  };

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }
  }, []);

  const handleUpdate = async () => {
    if (!name || !email || !phone) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('https://your-backend-api.com/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Information updated successfully!');
        navigation.goBack();
      } else {
        console.error('Backend error:', data);
        Alert.alert('Update Failed', data.message || 'An error occurred');
      }
    } catch (err) {
      console.error('Network error:', err);
      Alert.alert('Error', 'Could not connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* White background to prevent color showing behind header */}
      <View style={styles.whiteBackground} />

      <LinearGradient
        colors={['#361696', '#9C4DCC', '#DABEFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Info</Text>
      </LinearGradient>

      <View style={styles.formContainer}>
        <View style={styles.form}>
          <Text style={styles.heading}>Update Your Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor="#aaa"
          />

          <TouchableOpacity
            style={[styles.saveButton, loading && { backgroundColor: '#ccc' }]}
            onPress={handleUpdate}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Ensures full screen background is white
    paddingTop: STATUS_BAR_HEIGHT,
  },
  whiteBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: -1, // Ensure it stays under everything
  },
  header: {
    position: 'absolute',
    top: 0,
    width: SCREEN_WIDTH,
    paddingTop: STATUS_BAR_HEIGHT + 10,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 10,
  },
  backButton: {
    padding: 6,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 0,
  },
  form: {
    width: '100%',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  saveButton: {
    backgroundColor: '#361696',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 100,
    textAlign: 'center',
  },
});
 