// Emporie/app/ProductList.js
import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';


const ProductListScreen = ({ route, navigation }) => {
  const { items } = route.params || { items: [] };

  return (
    <Layout navigation={navigation}>
      <Text style={styles.header}>Submitted Products</Text>

      {items.length === 0 ? (
        <Text style={styles.empty}>No items submitted yet.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
              <Text style={styles.name}>{item.title}</Text>
              <Text style={styles.desc}>{item.description}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </Layout>
  );
};

export default ProductListScreen;

const styles = StyleSheet.create({
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  empty: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
  },
  card: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fafafa',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 6,
    marginBottom: 10,
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  desc: {
    color: '#666',
  },
});