import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to My First Expo App!</Text>
      <Button 
        title="Press me" 
        onPress={() => Alert.alert('Hello!', 'You pressed the button.')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4E0C6C', // You can change the color code here
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});