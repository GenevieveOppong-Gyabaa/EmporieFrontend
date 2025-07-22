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
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const categories = [
  { name: 'Art & Collectibles', image: require('../../assets/ArtandCollectibles.png') },
  { name: 'Accessories', image: require('../../assets/Accessories.png') },
  { name: 'Clothing', image: require('../../assets/Clothing.png') },
  { name: 'Bags', image: require('../../assets/Bags2.png') },
  { name: 'Shoes', image: require('../../assets/Shoes2.png') },
  { name: 'Tools', image: require('../../assets/Tools.png') },
  { name: 'Phones', image: require('../../assets/Phones.png') },
  { name: 'Home & Living', image: require('../../assets/HomeandLiving.png') },
  { name: 'Games', image: require('../../assets/Games.png') },
];

const { width } = Dimensions.get('window');

const SearchShop = () => {
  const [search, setSearch] = useState('');
  const navigation = useNavigation();

  const handleCategoryPress = (category) => {
    navigation.navigate('CategoryItemsScreen', { category });
  };

  return (
      <FlatList
        data={categories}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>🛍 Discover Your Style</Text>

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
  );
};

export default SearchShop;

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a1a',
    paddingHorizontal: 16,
    marginTop: 20,
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