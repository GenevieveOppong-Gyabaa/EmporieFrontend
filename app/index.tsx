import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View, } from "react-native";
import * as Animatable from 'react-native-animatable';

export default function SplashScreen() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('./Onboarding');// Change it back to onboarding
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
      return (
    <View style={styles.container}>
      <Animatable.Image
      animation='bounceIn'
      duration={1500}
      source={require('../assets/images/Emporie-logo.png')}
      style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#361696',
  },
  text: {
    color: '#fff',
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain'
  }
});

