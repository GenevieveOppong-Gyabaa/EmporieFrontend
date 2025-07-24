import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useEffect } from 'react';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SettingsScreen() {
  const router = useRouter();

  const settings = [
    {
      icon: 'create-outline',
      label: 'Edit Info',
      gradient: ['#4ECDC4', '#66E9E4'],
      route: './EditInfo',
    },
    {
      icon: 'time-outline',
      label: 'Order History',
      gradient: ['#FFD93D', '#FFE275'],
      route: './OrderHistory',
    },
    {
      icon: 'card-outline',
      label: 'Payment Methods',
      gradient: ['#1A8FE3', '#4CB7F5'],
      route: './PaymentDisplay',
    },
    {
      icon: 'sync-outline',
      label: 'Updates',
      gradient: ['#A55EEA', '#BE8CFF'],
      route: './Update',
    },
    {
      icon: 'log-out-outline',
      label: 'Sign Out',
      gradient: ['#FF3B30', '#FF6F61'],
      route: './SignOut',
    },
  ];

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={['#1A8FE3', '#A55EEA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerText}>Settings</Text>
      </LinearGradient>

      <View style={styles.content}>
        {settings.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => router.push(item.route)}
            style={styles.row}
          >
            <LinearGradient
              colors={item.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconWrapper}
            >
              <Ionicons name={item.icon} size={18} color="#fff" />
            </LinearGradient>
            <Text
              style={[
                styles.label,
                item.label === 'Sign Out' && { color: item.gradient[0] },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
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
    width: SCREEN_WIDTH,
    paddingTop: STATUS_BAR_HEIGHT + 12,
    paddingBottom: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 1,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    marginTop: STATUS_BAR_HEIGHT + 80, // pushes content below the header visually
    zIndex: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  label: {
    fontSize: 18,
    color: '#000',
  },
});
