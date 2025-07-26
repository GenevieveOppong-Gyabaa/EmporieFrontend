import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function OrderHistoryScreen() {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://your-backend.com/api/orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message || 'Could not fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#361696" />;
  if (error) return <View style={styles.center}><Text style={{ color: 'red' }}>{error}</Text></View>;
  if (!orders.length) return <View style={styles.center}><Text>No orders found.</Text></View>;

  return (
    <FlatList
      data={orders}
      keyExtractor={item => item.id?.toString() || Math.random().toString()}
      renderItem={({ item }) => (
        <View style={styles.orderItem}>
          <Text style={styles.orderTitle}>{item.title || 'Order'}</Text>
          <Text style={styles.orderDate}>{item.date}</Text>
          <Text style={styles.orderStatus}>{item.status}</Text>
        </View>
      )}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}

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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  orderItem: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, elevation: 2 },
  orderTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  orderDate: { color: '#666', marginBottom: 2 },
  orderStatus: { color: '#361696', fontWeight: '600' },
});
