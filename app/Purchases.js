import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    View
} from 'react-native';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PurchasesScreen() {
  const navigation = useNavigation();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://your-backend.com/api/purchases');
        if (!response.ok) throw new Error('Failed to fetch purchases');
        const data = await response.json();
        setPurchases(data);
      } catch (err) {
        setError(err.message || 'Could not fetch purchases');
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#361696" />;
  if (error) return <View style={styles.center}><Text style={{ color: 'red' }}>{error}</Text></View>;
  if (!purchases.length) return <View style={styles.center}><Text>No purchases found.</Text></View>;

  return (
    <FlatList
      data={purchases}
      keyExtractor={item => item.id?.toString() || Math.random().toString()}
      renderItem={({ item }) => (
        <View style={styles.purchaseItem}>
          <Text style={styles.purchaseTitle}>{item.title || 'Purchase'}</Text>
          <Text style={styles.purchaseDate}>{item.date}</Text>
          <Text style={styles.purchaseAmount}>{item.amount}</Text>
        </View>
      )}
      contentContainerStyle={{ padding: 16 }}
    />
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
    paddingTop: STATUS_BAR_HEIGHT + 10,
    paddingBottom: 16,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  content: {
    paddingTop: STATUS_BAR_HEIGHT + 90,
    paddingBottom: 40,
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
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
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#F8F8FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#ddd',
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  itemPrice: {
    fontSize: 14,
    color: '#361696',
    marginTop: 4,
  },
  itemDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  purchaseItem: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, elevation: 2 },
  purchaseTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  purchaseDate: { color: '#666', marginBottom: 2 },
  purchaseAmount: { color: '#361696', fontWeight: '600' },
});
