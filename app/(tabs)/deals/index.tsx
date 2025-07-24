import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 2;

type Deal = {
  id: number;
  title: string;
  image: string;
  discount: string;
  oldPrice: number;
  newPrice: number;
};

const DealsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetch
    setTimeout(() => {
      const dummyDiscountedItems: Deal[] = [
        {
          id: 1,
          title: 'Wireless Headphones',
          image: 'https://via.placeholder.com/300x300.png?text=Headphones',
          discount: '20%',
          oldPrice: 120,
          newPrice: 96,
        },
        {
          id: 2,
          title: 'Smart Watch',
          image: 'https://via.placeholder.com/300x300.png?text=Smart+Watch',
          discount: '15%',
          oldPrice: 200,
          newPrice: 170,
        },
        {
          id: 3,
          title: 'Bluetooth Speaker',
          image: 'https://via.placeholder.com/300x300.png?text=Speaker',
          discount: '10%',
          oldPrice: 80,
          newPrice: 72,
        },
        {
          id: 4,
          title: 'Phone Stand',
          image: 'https://via.placeholder.com/300x300.png?text=Phone+Stand',
          discount: '30%',
          oldPrice: 40,
          newPrice: 28,
        },
      ];
      setDeals(dummyDiscountedItems);
      setLoading(false);
    }, 1500);
  }, []);

  const filteredDeals = deals.filter((deal) =>
    deal.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDealItem = (item: Deal) => {
    if (!item?.id || !item?.image) return null;

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.dealItem}
        onPress={() =>
          router.push({
            pathname: '../deals/[dealId]',
            params: { dealId: item.id.toString() },
          })
        }
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.dealImage} />
          {item.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{item.discount}</Text>
              <Text style={styles.offText}>OFF</Text>
            </View>
          )}
        </View>
        <Text style={styles.dealTitle}>{item.title}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.newPrice}>${item.newPrice}</Text>
          <Text style={styles.oldPrice}>${item.oldPrice}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderShimmer = (_: number, index: number) => (
    <View key={index} style={[styles.dealItem, { backgroundColor: '#eee' }]}>
      <View style={[styles.dealImage, { backgroundColor: '#ddd' }]} />
      <View style={{ height: 16, backgroundColor: '#ddd', marginVertical: 8, borderRadius: 4 }} />
      <View style={{ height: 14, width: '60%', backgroundColor: '#ccc', borderRadius: 4 }} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.statusBarSpacer} />
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for the latest discounts"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.dealsGrid}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => renderShimmer(i, i))
            : filteredDeals.map(renderDealItem)}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  statusBarSpacer: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  scrollView: { flex: 1 },
  dealsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  dealItem: {
    width: itemWidth,
    marginBottom: 16,
  },
  imageContainer: { position: 'relative' },
  dealImage: {
    width: '100%',
    height: itemWidth * 1.2,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#ff4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
  },
  discountText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  offText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  dealTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  newPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e63946',
    marginRight: 8,
  },
  oldPrice: {
    fontSize: 14,
    color: '#888',
    textDecorationLine: 'line-through',
  },
});

export default DealsScreen;
