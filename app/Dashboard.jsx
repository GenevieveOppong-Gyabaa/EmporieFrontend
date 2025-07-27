import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BACKEND_URL } from '../constants/config';

const SellerDashboardScreen = ({ route }) => {
  const userId = route?.params?.userId || 'sample-user-id';
  const [dashboard, setDashboard] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

 const fetchDashboardData = async () => {
  try {
    const [dashRes, prodRes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/seller/${userId}/dashboard`),
      fetch(`${BACKEND_URL}/api/seller/${userId}/products`)
    ]);

    // Check if responses are OK before parsing
    if (!dashRes.ok) {
      throw new Error(`Dashboard fetch failed: ${dashRes.status}`);
    }
    if (!prodRes.ok) {
      throw new Error(`Products fetch failed: ${prodRes.status}`);
    }

    const dashData = await dashRes.json();
    const prodData = await prodRes.json();

    setDashboard(dashData);
    setProducts(prodData);
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    Alert.alert('Error', 'Could not load dashboard data. Please check your connection or try again later.');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Gradient Header */}
      <LinearGradient
        colors={['#361696', '#6E44FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient, { paddingTop: insets.top + 16 }]}
      >
        <Text style={styles.headerText}>My Seller Dashboard</Text>
      </LinearGradient>

      {/* All content via FlatList */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.container}>
            <View style={styles.cardContainer}>
              <LinearGradient colors={['#361696', '#6E44FF']} style={styles.card}>
                <Text style={styles.cardTitle}>Listed</Text>
                <Text style={styles.cardValue}>{dashboard?.productsListed}</Text>
              </LinearGradient>

              <LinearGradient colors={['#361696', '#6E44FF']} style={styles.card}>
                <Text style={styles.cardTitle}>In Carts</Text>
                <Text style={styles.cardValue}>{dashboard?.inCarts}</Text>
              </LinearGradient>

              <LinearGradient colors={['#361696', '#6E44FF']} style={styles.card}>
                <Text style={styles.cardTitle}>Sold</Text>
                <Text style={styles.cardValue}>{dashboard?.itemsSold}</Text>
              </LinearGradient>

              <LinearGradient colors={['#361696', '#6E44FF']} style={styles.card}>
                <Text style={styles.cardTitle}>Earnings</Text>
                <Text style={styles.cardValue}>${dashboard?.earnings.toFixed(2)}</Text>
              </LinearGradient>
            </View>
            <Text style={styles.subHeader}>My Products</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text>Views: {item.views} | Carts: {item.carts} | Sold: {item.sold}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  headerGradient: {
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  container: {
    marginTop: 12,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 3,
  },
  cardTitle: {
    fontSize: 15,
    color: '#fff',
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  subHeader: {
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
    marginBottom: 12,
  },
  productCard: {
    backgroundColor: '#f0f0f0',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
});

export default SellerDashboardScreen;
