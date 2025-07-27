// Emporie/app/CategoryItems.js
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BACKEND_URL } from '../constants/config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Fallback mock data for when backend is not available
const mockProducts = [
  { id: '1', title: "Mixed-beads for male and female", price: 30.00, rating: 4.3, image: require('../assets/images/Item1.png') },
  { id: '2', title: "Lil's beads", price: 20.00, rating: 4.3, image: require('../assets/images/Item2.png') },
  { id: '3', title: 'Scrunchy', price: 10.00, rating: 4.7, image: require('../assets/images/Item3.png') },
  { id: '4', title: "Peach-colored hair holder", price: 10.00, rating: 4.2, image: require('../assets/images/Item4.png') },
  { id: '5', title: 'Trendy hair holder', price: 10.00, rating: 4.5, image: require('../assets/images/Item5.png') },
];

const ProductCard = ({ id, image, title, price, rating, onPress }) => (
  <TouchableOpacity 
    style={styles.productCard}
    onPress={onPress}
  >
    <Image source={image} style={styles.productImg} />

    <Text numberOfLines={1} style={styles.title}>
      {title}
    </Text>

    <View style={styles.ratingRow}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Ionicons
          key={i}
          name={i < Math.round(rating) ? 'star' : 'star-outline'}
          size={12}
          color="#000"
        />
      ))}
      <Text style={styles.ratingText}>{Math.round(rating * 10) / 10}</Text>
    </View>

    <View style={styles.priceRow}>
      <Text style={styles.price}>GHC{price.toFixed(2)}</Text>
    </View>
  </TouchableOpacity>
);

export default function CategoryItemsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { categoryName, categoryId } = useLocalSearchParams();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryProducts();
  }, [categoryId]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/products?categoryId=${categoryId}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.log('Backend not available, using mock data');
        // Fallback to mock data if backend is not available
        setProducts(mockProducts);
      }
    } catch (error) {
      console.log('Error fetching category products, using mock data:', error);
      // Fallback to mock data
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: 0 }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName || 'Category'}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading {categoryName} products...</Text>
          </View>
        ) : products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="bag-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No products found in this category</Text>
          </View>
        ) : (
          <FlatList
            data={products}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            keyExtractor={(item) => item.id?.toString() || item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <ProductCard 
                {...item} 
                onPress={() => {
                  router.push({
                    pathname: './Details',
                    params: { productId: item.id?.toString() || item.id }
                  });
                }}
              />
            )}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#222',
  },
  headerRight: {
    width: 40,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  productCard: {
    width: SCREEN_WIDTH * 0.48,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 14,
    elevation: 2,
    overflow: 'hidden',
  },
  productImg: { 
    width: '100%', 
    height: 180, 
    resizeMode: 'cover' 
  },
  title: { 
    fontSize: 13, 
    marginTop: 4, 
    marginHorizontal: 4, 
    fontWeight: '500' 
  },
  ratingRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginHorizontal: 4, 
    marginTop: 2 
  },
  ratingText: { 
    fontSize: 12, 
    marginLeft: 4, 
    color: '#555' 
  },
  priceRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginHorizontal: 4, 
    marginTop: 2 
  },
  price: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: '#DC6300' 
  },
});