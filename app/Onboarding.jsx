import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Welcome to Emporie',
    description: 'Your one‑stop shop for beauty, fashion, tech, and more.',
    image: require('../assets/images/newonboarding1.png'),
  },
  {
    id: '2',
    title: 'Explore Categories',
    description: 'From casual wear to electronics, find it all in one place.',
    image: require('../assets/images/newonboarding2.png'),
  },
  {
    id: '3',
    title: 'Fast • Easy • Secure',
    description: 'Enjoy smooth shopping, rapid delivery, and safe checkout.',
    image: require('../assets/images/newonboarding3.png'),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = async () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('./SignUp'); 
    }
  };

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => (
          <View style={styles.slideWrapper}>
            <ImageBackground
              source={item.image}
              style={styles.slideImage}
              imageStyle={{ borderRadius: 20 }}
              resizeMode="cover"
            >
              <LinearGradient
                colors={['transparent', 'rgba(241, 34, 197, 0.5)', 'rgba(185, 18, 236, 0.9)']}
                style={styles.gradient}
              >
                <Animatable.Text
                  animation="fadeInUp"
                  delay={200}
                  style={styles.title}
                >
                  {item.title}
                </Animatable.Text>
                <Animatable.Text
                  animation="fadeInUp"
                  delay={400}
                  style={styles.description}
                >
                  {item.description}
                </Animatable.Text>
                {item.id === '1' && (
                  <TouchableOpacity
                    onPress={() => router.replace('./SignUp')}
                    style={styles.skipContainer}
                  >
                    <Text style={styles.skipText}>Skip</Text>
                  </TouchableOpacity>
                )}
              </LinearGradient>
            </ImageBackground>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentIndex === index && styles.activeIndicator,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  slideWrapper: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    height,
  },
  slideImage: {
    width: '100%',
    height: height * 0.66,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderRadius: 20,
  },
  gradient: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 80,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#ddd',
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 10,
  },
  skipContainer: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  skipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  indicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#aaa',
    marginHorizontal: 4,
  },
  activeIndicator: {
    width: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#361696',
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
