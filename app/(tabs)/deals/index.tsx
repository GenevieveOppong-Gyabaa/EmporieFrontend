import { dealsData as deals } from '@/data/deals';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 2; // 2 columns with padding

const DealsScreen = () => {
 

  const renderDealItem = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.dealItem} onPress={() => router.push({pathname : '/deals/[dealId]' , params : {dealId : item.id}})}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.dealImage} />
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}</Text>
          <Text style={styles.offText}>OFF</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
     

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for the latest discounts"
          placeholderTextColor="#999"
        />
      </View>

      {/* Deals Grid */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.dealsGrid}>
          {deals.map(renderDealItem)}
        </View>
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
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
  imageContainer: {
    position: 'relative',
  },
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 10,
    color: '#333',
    marginTop: 4,
    fontWeight: '500',
  },
  discountsText: {
    fontSize: 10,
    color: '#ff4444',
    fontWeight: 'bold',
  },
});

export default DealsScreen;