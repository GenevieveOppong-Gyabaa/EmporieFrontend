import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FavoritesScreen = ({ favorites = [] }) => {
  const hasFavorites = favorites.length > 0;
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <LinearGradient
        colors={['#361696', '#6E44FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <Text style={styles.headerText}>Favorites</Text>
      </LinearGradient>

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

  header: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
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
    paddingBottom: 100,
  },
  favoriteItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
});

export default FavoritesScreen;
