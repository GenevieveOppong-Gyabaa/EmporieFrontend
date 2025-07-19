import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform
} from 'react-native';

const OrderHistoryScreen = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]); // Fetch this from backend eventually

  useEffect(() => {
    StatusBar.setBarStyle('light-content'); // white text/icons
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={['#361696', '#7A5FFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
      </LinearGradient>

      {/* Main content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {orders.length === 0 ? (
          <View style={styles.emptyState}>
            <Image
              source={require('../assets/images/empty-cart.png')}
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.subText}>Your orders will appear here once placed.</Text>
          </View>
        ) : (
          orders.map((order, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.orderTitle}>Order #{order.id}</Text>
                <Text style={styles.orderDate}>{order.date}</Text>
              </View>
              <Text style={styles.orderAmount}>₵{order.total}</Text>
              <Text style={styles.orderStatus}>Status: {order.status}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: STATUS_BAR_HEIGHT + 12,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    zIndex: 2,
  },
  backButton: {
    marginRight: 16,
    padding: 6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyImage: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#361696',
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EDEDED',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  orderDate: {
    fontSize: 13,
    color: '#999',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#361696',
    marginBottom: 6,
  },
  orderStatus: {
    fontSize: 14,
    color: '#444',
  },
});

export default OrderHistoryScreen;
