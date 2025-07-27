import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { BACKEND_URL } from '../constants/config';

const router = useRouter();

const supportItems = [
  {
    title: 'Chat with Us',
    description: '+233506910023',
    icon: (color) => <Ionicons name="chatbubbles" size={24} color={color} />,
    gradient: ['#7B61FF', '#9C89FF'],
    onPress: () => console.log('Start chat'),
  },
  {
    title: 'Call Support',
    description: '0506910023',
    icon: (color) => <Feather name="phone-call" size={24} color={color} />,
    gradient: ['#FF8C42', '#FFAE5C'],
    onPress: () => console.log('Calling support...'),
  },
  {
    title: 'Email Support',
    description: 'emporie@gmail.com',
    icon: (color) => <MaterialIcons name="email" size={24} color={color} />,
    gradient: ['#29C8B1', '#64D6C0'],
    onPress: () => console.log('Opening email...'),
  },
  {
    title: 'FAQs',
    description: 'Browse common questions',
    icon: (color) => <FontAwesome5 name="question-circle" size={24} color={color} />,
    gradient: ['#E95D8E', '#F182AC'],
    onPress: () => router.push('/FAQs'),
  },
];

export default function CustomerSupportScreen() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${BACKEND_URL}/api/faqs`);
        if (!response.ok) throw new Error('Failed to fetch FAQs');
        const data = await response.json();
        setFaqs(data);
      } catch (err) {
        setError(err.message || 'Could not fetch FAQs');
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#361696" />;
  if (error) return <View style={styles.center}><Text style={{ color: 'red' }}>{error}</Text></View>;
  if (!faqs.length) return <View style={styles.center}><Text>No FAQs found.</Text></View>;

  return (
    <FlatList
      data={faqs}
      keyExtractor={item => item.id?.toString() || Math.random().toString()}
      renderItem={({ item }) => (
        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>{item.question}</Text>
          <Text style={styles.faqAnswer}>{item.answer}</Text>
        </View>
      )}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  supportSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  faqItem: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, elevation: 2 },
  faqQuestion: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  faqAnswer: { color: '#666', fontSize: 14 },
});
