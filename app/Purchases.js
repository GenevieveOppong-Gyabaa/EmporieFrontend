import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PurchasesScreen = () => {
  const navigation = useNavigation();
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    // Status bar config
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }

    // Backend fetch example
    // fetch('https://yourapi.com/user/purchases')
    //   .then(res => res.json())
    //   .then(data => setPurchases(data))
    //   .catch(err => console.error(err));
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#361696', '#9C4DCC', '#DABEFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>My Purchases</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        {purchases.length === 0 ? (
          <View style={styles.emptyState}>
            <Image
              source={require('../assets/images/empty-bag.png')}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.title}>No purchases yet</Text>
            <Text style={styles.subText}>
              Your recent purchases will show up here once you start shopping.
            </Text>
          </View>
        ) : (
          purchases.map((item, index) => (
            <View key={index} style={styles.card}>
              <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemPrice}>GHS {item.price}</Text>
                <Text style={styles.itemDate}>{item.date}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 0,
    width: SCREEN_WIDTH,
    paddingTop: STATUS_BAR_HEIGHT + 10,
    paddingBottom: 16,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  content: {
    paddingTop: STATUS_BAR_HEIGHT + 90,
    paddingBottom: 40,
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#361696',
    marginBottom: 6,
  },
  subText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#F8F8FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#ddd',
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  itemPrice: {
    fontSize: 14,
    color: '#361696',
    marginTop: 4,
  },
  itemDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
});

export default PurchasesScreen;
