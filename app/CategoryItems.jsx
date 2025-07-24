// Emporie/app/CategoryItems.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CategoryItemsScreen = ({ route }) => {
  const { category } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category}</Text>
      {/* Later: Fetch or show items for this category */}
    </View>
  );
};

export default CategoryItemsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
});