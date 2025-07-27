import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { useUser } from '../context/userContext';
import { createChatRoom } from '../services/chatService';
import {
  mockCreateChatRoom,
  mockGetProductDetails,
  mockGetProductReviews,
  mockGetSimilarProducts
} from '../services/mockData';
import { getProductDetails, getProductReviews, getSimilarProducts, Product, Review, SimilarProduct } from '../services/productService';

const { width: W } = Dimensions.get('window');
const PRIMARY = '#361696';

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { productId } = useLocalSearchParams();
  const { user } = useUser();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  useEffect(() => {
    if (productId) {
      loadProductDetails();
    }
  }, [productId]);

  const loadProductDetails = async () => {
    try {
      setLoading(true);
      
      // Try to load from backend first, fallback to mock data
      let productData, reviewsData, similarData;
      
      try {
        [productData, reviewsData, similarData] = await Promise.all([
          getProductDetails(productId as string),
          getProductReviews(productId as string),
          getSimilarProducts(productId as string),
        ]);
      } catch (backendError) {
        console.log('Backend not available, using mock data:', backendError);
        // Use mock data as fallback
        [productData, reviewsData, similarData] = await Promise.all([
          mockGetProductDetails(productId as string),
          mockGetProductReviews(productId as string),
          mockGetSimilarProducts(productId as string),
        ]);
      }
      
      setProduct(productData);
      setReviews(reviewsData);
      setSimilarProducts(similarData);
      
      // Set default selections
      if (productData.sizes && productData.sizes.length > 0) {
        setSelectedSize(productData.sizes[0]);
      }
      if (productData.colors && productData.colors.length > 0) {
        setSelectedColor(productData.colors[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load product details');
      console.error('Error loading product details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatWithSeller = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to chat with the seller');
      router.push('./Login');
      return;
    }

    if (!product) return;

    try {
      let chatRoom;
      
      try {
        chatRoom = await createChatRoom(
          product.id,
          product.seller.id,
          user.email // Using email as userId for now
        );
      } catch (backendError) {
        console.log('Backend not available, using mock chat room:', backendError);
        // Use mock chat room as fallback
        chatRoom = await mockCreateChatRoom(
          product.id,
          product.seller.id,
          user.email
        );
      }
      
      // Navigate to chat screen
      router.push({
        pathname: './Chat',
        params: { 
          chatRoomId: chatRoom.id,
          sellerName: product.seller.name,
          productTitle: product.title
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to start chat with seller');
      console.error('Error creating chat room:', error);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, i) => (
          <Ionicons
            key={i}
            name={i < rating ? 'star' : 'star-outline'}
            size={16}
            color={PRIMARY}
          />
        ))}
      </View>
    );
  };

  const renderImageCarousel = () => {
    if (!product?.images) return null;

    return (
      <View style={styles.imageContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / W);
            setCurrentImageIndex(index);
          }}
          scrollEventThrottle={16}
        >
          {product.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
        
        {/* Image indicators */}
        <View style={styles.imageIndicators}>
          {product.images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentImageIndex === index && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderSizeSelector = () => {
    if (!product?.sizes || product.sizes.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Size</Text>
        <View style={styles.optionsContainer}>
          {product.sizes.map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.optionButton,
                selectedSize === size && styles.selectedOption,
              ]}
              onPress={() => setSelectedSize(size)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedSize === size && styles.selectedOptionText,
                ]}
              >
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderColorSelector = () => {
    if (!product?.colors || product.colors.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Color</Text>
        <View style={styles.optionsContainer}>
          {product.colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.optionButton,
                selectedColor === color && styles.selectedOption,
              ]}
              onPress={() => setSelectedColor(color)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedColor === color && styles.selectedOptionText,
                ]}
              >
                {color}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderQuantitySelector = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quantity</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Ionicons name="remove" size={20} color={PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Ionicons name="add" size={20} color={PRIMARY} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderReviews = () => {
    if (reviews.length === 0) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <Text style={styles.noReviews}>No reviews yet</Text>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reviews ({reviews.length})</Text>
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewerName}>{review.userName}</Text>
              {renderStars(review.rating)}
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
            <Text style={styles.reviewDate}>
              {new Date(review.createdAt).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderSimilarProducts = () => {
    if (similarProducts.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>You may also like</Text>
        <FlatList
          horizontal
          data={similarProducts}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.similarProduct}
              onPress={() => router.push({
                pathname: './Details',
                params: { productId: item.id }
              })}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.similarProductImage}
                resizeMode="cover"
              />
              <Text style={styles.similarProductTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <View style={styles.similarProductFooter}>
                {renderStars(item.rating)}
                <Text style={styles.similarProductPrice}>GH₵{item.price}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY} />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#ccc" />
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadProductDetails}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#361696', '#9C4DCC']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={handleChatWithSeller}
        >
          <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        {renderImageCarousel()}

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{product.title}</Text>
          
          <View style={styles.ratingContainer}>
            {renderStars(product.rating)}
            <Text style={styles.ratingText}>
              {product.rating} ({product.reviewCount} reviews)
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>GH₵{product.price}</Text>
            {product.oldPrice && (
              <Text style={styles.oldPrice}>GH₵{product.oldPrice}</Text>
            )}
          </View>

          <View style={styles.sellerInfo}>
            <Ionicons name="person-circle" size={20} color={PRIMARY} />
            <Text style={styles.sellerName}>Sold by {product.seller.name}</Text>
            {renderStars(product.seller.rating)}
          </View>

          <View style={styles.productMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="location" size={16} color="#666" />
              <Text style={styles.metaText}>{product.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="cube" size={16} color="#666" />
              <Text style={styles.metaText}>{product.condition}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="checkmark-circle" size={16} color={product.inStock ? '#4CAF50' : '#F44336'} />
              <Text style={[styles.metaText, { color: product.inStock ? '#4CAF50' : '#F44336' }]}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        {/* Size Selector */}
        {renderSizeSelector()}

        {/* Color Selector */}
        {renderColorSelector()}

        {/* Quantity Selector */}
        {renderQuantitySelector()}

        {/* Reviews */}
        {renderReviews()}

        {/* Similar Products */}
        {renderSimilarProducts()}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.chatButtonLarge}
          onPress={handleChatWithSeller}
        >
          <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
          <Text style={styles.chatButtonText}>Chat with Seller</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => {
            Alert.alert(
              'Add to Cart',
              `Added ${quantity} x ${product.title}${selectedSize ? ` (${selectedSize})` : ''}${selectedColor ? ` - ${selectedColor}` : ''}`
            );
          }}
          disabled={!product.inStock}
        >
          <Text style={styles.addToCartText}>
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: '#666',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: PRIMARY,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  chatButton: {
    padding: 8,
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: W,
    height: W * 1.2,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#fff',
  },
  productInfo: {
    padding: 16,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    color: '#666',
    fontSize: 14,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: PRIMARY,
    marginRight: 12,
  },
  oldPrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sellerName: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    marginRight: 8,
  },
  productMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  selectedOption: {
    borderColor: PRIMARY,
    backgroundColor: PRIMARY + '20',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedOptionText: {
    color: PRIMARY,
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    padding: 12,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'center',
  },
  noReviews: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
  reviewItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  reviewComment: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  similarProduct: {
    width: 140,
    marginRight: 12,
  },
  similarProductImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
    marginBottom: 8,
  },
  similarProductTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  similarProductFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  similarProductPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    gap: 12,
  },
  chatButtonLarge: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  addToCartButton: {
    flex: 2,
    backgroundColor: PRIMARY,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 