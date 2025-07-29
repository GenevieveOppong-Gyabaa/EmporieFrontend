import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '../context/userContext';
import { API_ENDPOINTS } from '../constants/config';

const SellerDashboardScreen = ({ route }) => {
  const { user } = useUser();
  const [dashboard, setDashboard] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  const fetchDashboardData = async () => {
    if (!user || !user.id) {
      Alert.alert('Error', 'Please log in to view your dashboard');
      return;
    }

    try {
      setLoading(true);
      
      // Fetch dashboard stats and products for the current user
      const [dashRes, prodRes] = await Promise.all([
        fetch(`${API_ENDPOINTS.BACKEND_URL}/api/seller/${user.id}/dashboard`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${API_ENDPOINTS.BACKEND_URL}/api/seller/${user.id}/products`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        })
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
  }, [user]);

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Please log in to view your dashboard</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" style={styles.loader} />
      </SafeAreaView>
    );
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
        keyExtractor={(item) => item.id?.toString() || item.id}
        ListHeaderComponent={
          <View style={styles.container}>
            <View style={styles.cardContainer}>
              <LinearGradient colors={['#361696', '#6E44FF']} style={styles.card}>
                <Text style={styles.cardTitle}>Listed</Text>
                <Text style={styles.cardValue}>{dashboard?.productsListed || 0}</Text>
              </LinearGradient>

              <LinearGradient colors={['#361696', '#6E44FF']} style={styles.card}>
                <Text style={styles.cardTitle}>In Carts</Text>
                <Text style={styles.cardValue}>{dashboard?.inCarts || 0}</Text>
              </LinearGradient>

              <LinearGradient colors={['#361696', '#6E44FF']} style={styles.card}>
                <Text style={styles.cardTitle}>Sold</Text>
                <Text style={styles.cardValue}>{dashboard?.itemsSold || 0}</Text>
              </LinearGradient>

              <LinearGradient colors={['#361696', '#6E44FF']} style={styles.card}>
                <Text style={styles.cardTitle}>Earnings</Text>
                <Text style={styles.cardValue}>${(dashboard?.earnings || 0).toFixed(2)}</Text>
              </LinearGradient>
            </View>
            <Text style={styles.subHeader}>My Products</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productStats}>
              Views: {item.views || 0} | Carts: {item.carts || 0} | Sold: {item.sold || 0}
            </Text>
            {item.price && (
              <Text style={styles.productPrice}>Price: ${item.price}</Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products listed yet</Text>
            <Text style={styles.emptySubText}>Start selling by adding your first product!</Text>
          </View>
        }
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  productStats: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#361696',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default SellerDashboardScreen;
