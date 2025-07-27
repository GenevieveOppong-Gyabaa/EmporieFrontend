import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const categories = [
  { name: 'Art & Collectibles', image: require('../../assets/images/ArtandCollectibles.png') },
  { name: 'Groceries', image: require('../../assets/images/Groceries.png') },
  { name: 'Fashion', image: require('../../assets/images/Bags2.png') },
  { name: 'Toys', image: require('../../assets/images/Toys.png') },
  { name: 'Health', image: require('../../assets/images/Health.png') },
  { name: 'Beauty', image: require('../../assets/images/Accessories.png') },
  { name: 'Electronics', image: require('../../assets/images/Phones.png') },
  { name: 'Home & Living', image: require('../../assets/images/HomeandLiving.png') },
  { name: 'Sports', image: require('../../assets/images/Games.png') },
  {name: 'Books', image: require('../../assets/images/Books.png') },
];

const { width } = Dimensions.get('window');

const SearchShop = () => {
  const [search, setSearch] = useState('');
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleCategoryPress = (category) => {
    navigation.navigate('CategoryItemsScreen', { category });
  };

  return (
    <View style={styles.screen}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={['#361696', '#6E44FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
         <Text style={styles.headerTitle}>🛍 Discover Your Style</Text>
      </LinearGradient>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <>
           
            <View style={styles.searchBar}>
              <Feather name="search" size={20} color="#888" />
              <TextInput
                placeholder="Search for treasures on Emporie"
                placeholderTextColor="#888"
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
              />
            </View>
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryBox}
            onPress={() => handleCategoryPress(item.name)}
            activeOpacity={0.8}
          >
            <Image source={item.image} style={styles.categoryImage} />
            <View style={styles.overlay}>
              <Text style={styles.categoryText}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SearchShop;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a1a',
    paddingHorizontal: 16,
    
    marginBottom: 12,
    letterSpacing: 0.4,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 14,
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 48,
    marginTop: 20,
    marginBottom: 24,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 120,
    paddingHorizontal: 12,
  },
  categoryBox: {
    width: '100%',
    height: 100,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 18,
    backgroundColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  categoryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
