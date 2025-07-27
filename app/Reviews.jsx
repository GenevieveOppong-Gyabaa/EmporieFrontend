import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    FlatList,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { BACKEND_URL } from '../constants/config';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 🟡 Simulated backend data fetch function
const fetchReviewsFromBackend = async () => {
  // Replace this with your actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          name: 'Ama Boateng',
          rating: 4,
          comment: 'Great service and fast delivery!',
        },
        {
          id: '2',
          name: 'Kwame Mensah',
          rating: 5,
          comment: 'Very satisfied with the product. Will buy again.',
        },
        {
          id: '3',
          name: 'Akosua Asare',
          rating: 3,
          comment: 'Product was okay, but packaging could improve.',
        },
      ]);
    }, 1500);
  });
};

export default function ReviewsScreen() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fadeAnim = new Animated.Value(0); // For screen fade-in animation

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${BACKEND_URL}/api/reviews`);
        if (!response.ok) throw new Error('Failed to fetch reviews');
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError(err.message || 'Could not fetch reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleSubmit = async () => {
    if (!newReview) return;
    setSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newReview }),
      });
      if (!response.ok) throw new Error('Failed to submit review');
      const review = await response.json();
      setReviews([review, ...reviews]);
      setNewReview('');
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not submit review');
    } finally {
      setSubmitting(false);
    }
  };

  // 🔸 Generate star rating UI
  const renderStars = (count) => {
    return (
      <View style={styles.starRow}>
        {[...Array(5)].map((_, i) => (
          <FontAwesome
            key={i}
            name={i < count ? 'star' : 'star-o'}
            size={16}
            color="#FFD700"
          />
        ))}
      </View>
    );
  };

  // 🔸 Generate initials avatar
  const renderAvatar = (name) => {
    const initials = name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
    return (
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
    );
  };

  // 🔸 Render each review card
  const renderItem = ({ item }) => (
    <Animated.View style={[styles.reviewCard, { opacity: fadeAnim }]}>
      <View style={styles.cardHeader}>
        {renderAvatar(item.name)}
        <View>
          <Text style={styles.reviewerName}>{item.name}</Text>
          {renderStars(item.rating)}
        </View>
      </View>
      <Text style={styles.comment}>{item.comment}</Text>
    </Animated.View>
  );

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#361696" />;
  if (error) return <View style={styles.center}><Text style={{ color: 'red' }}>{error}</Text></View>;

  return (
    <SafeAreaView style={styles.container}>
      {/* 🟣 Gradient Header */}
      <LinearGradient
        colors={['#FF6B6B', '#FFA07A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerText}>Customer Reviews</Text>
      </LinearGradient>

      {/* 🟡 Loading Spinner */}
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Loading reviews...</Text>
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newReview}
          onChangeText={setNewReview}
          placeholder="Write a review..."
        />
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
          <Text style={styles.submitText}>{submitting ? 'Posting...' : 'Post'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F2',
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
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#555',
  },
  list: {
    padding: 20,
  },
  reviewCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF8E8E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  starRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  comment: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  reviewItem: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, elevation: 2 },
  reviewText: { fontSize: 16, marginBottom: 4 },
  reviewDate: { color: '#666', fontSize: 12 },
  inputContainer: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fafafa' },
  input: { flex: 1, backgroundColor: '#fff', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: '#ddd', marginRight: 8 },
  submitBtn: { backgroundColor: '#361696', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center' },
  submitText: { color: '#fff', fontWeight: 'bold' },
});
