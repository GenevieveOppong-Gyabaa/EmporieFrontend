import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const UpdatesScreen = () => {
  const navigation = useNavigation();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }
    // Fetch updates from backend
    const fetchUpdates = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://your-backend.com/api/updates');
        if (!response.ok) throw new Error('Failed to fetch updates');
        const data = await response.json();
        setUpdates(data);
      } catch (err) {
        setError(err.message || 'Could not fetch updates');
      } finally {
        setLoading(false);
      }
    };
    fetchUpdates();
  }, []);

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={['#361696', '#9C4DCC', '#DABEFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Updates</Text>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        {loading ? (
          <Text>Loading updates...</Text>
        ) : error ? (
          <Text style={{ color: 'red' }}>{error}</Text>
        ) : updates.length === 0 ? (
          <Image
            source={require('../assets/images/no-update.png')}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          updates.map((update, idx) => (
            <View key={idx} style={{ marginBottom: 24, alignItems: 'center' }}>
              <Text style={styles.title}>{update.title}</Text>
              <Text style={styles.subText}>{update.description}</Text>
            </View>
          ))
        )}
        {(!loading && !error && updates.length === 0) && (
          <>
            <Text style={styles.title}>Oops! No updates yet</Text>
            <Text style={styles.subText}>We'll notify you when something new comes up.</Text>
          </>
        )}
      </View>
    </View>
  );
};

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: SCREEN_WIDTH,
    paddingTop: STATUS_BAR_HEIGHT + 8,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 20,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#361696',
    marginBottom: 6,
  },
  subText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default UpdatesScreen;
