import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useUser } from '../context/userContext';

export default function ProfileScreen({ route }) {
  const router = useRouter();
  const { user } = useUser();
  const userEmail = user?.email || 'user@example.com';

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={['#361696', '#9C4DCC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
      </LinearGradient>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Ionicons name="person-circle" size={130} color="#361696" />
        <Text style={styles.userEmail}>{userEmail}</Text>
      </View>

      {/* Menu Options */}
      <View style={styles.menu}>
        <TouchableOpacity
          style={[styles.menuItem, styles.purple]}
          onPress={() => router.push('./Purchases')}
        >
          <MaterialIcons name="storefront" size={24} color="#fff" />
          <Text style={styles.menuText}>Purchases</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.orange]}
          onPress={() => router.push('./Sell')}
        >
          <FontAwesome5 name="store" size={22} color="#fff" />
          <Text style={styles.menuText}>Sell</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.teal]}
          onPress={() => router.push('./Settings')}
        >
          <Feather name="settings" size={23} color="#fff" />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.green]}
          onPress={() => router.push('./CustomerSupport')}
        >
          <Feather name="help-circle" size={23} color="#fff" />
          <Text style={styles.menuText}>Support</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.pink]}
          onPress={() => router.push('./Reviews')}
        >
          <MaterialCommunityIcons name="star-circle" size={24} color="#fff" />
          <Text style={styles.menuText}>Reviews</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.red]}
          onPress={() => router.push('./SignOut')}
        >
          <MaterialIcons name="logout" size={24} color="#fff" />
          <Text style={styles.menuText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 120,
    marginBottom: 20,
  },
  userEmail: {
    fontSize: 18,
    fontWeight: '600',
    color: '#361696',
    marginTop: 10,
  },
  menu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
  },
  menuItem: {
    width: '45%',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 18,
    alignItems: 'center',
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    elevation: 4,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  purple: {
    backgroundColor: '#6A1B9A',
  },
  orange: {
    backgroundColor: '#FB8C00',
  },
  teal: {
    backgroundColor: '#00897B',
  },
  green: {
    backgroundColor: '#43A047',
  },
  pink: {
    backgroundColor: '#D81B60',
  },
  red: {
    backgroundColor: '#E53935',
  },
});
