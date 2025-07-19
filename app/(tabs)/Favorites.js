// app/favorites.js
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const FavoritesScreen = ({ favorites = [] }) => {
  const hasFavorites = favorites.length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {hasFavorites ? (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {favorites.map((item, index) => (
              <View key={index} style={styles.favoriteItem}>
                <Text>{item.name}</Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>NO FAVORITES YET</Text>
            <Text style={styles.subText}>
              Your recommendations get better on favorites
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Empty state */
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
  },
  subText: {
    fontSize: 14,
    color: '#777',
    marginTop: 10,
  },

  /* List */
  scrollContainer: {
    paddingBottom: 100, // keeps content clear of the global BottomNav
  },
  favoriteItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
});

export default FavoritesScreen;
