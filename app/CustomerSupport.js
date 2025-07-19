import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const router = useRouter();

const supportItems = [
  {
    title: 'Chat with Us',
    description: '+233506910023',
    icon: (color) => <Ionicons name="chatbubbles" size={24} color={color} />,
    gradient: ['#7B61FF', '#9C89FF'],
    onPress: () => console.log('Start chat'),
  },
  {
    title: 'Call Support',
    description: '0506910023',
    icon: (color) => <Feather name="phone-call" size={24} color={color} />,
    gradient: ['#FF8C42', '#FFAE5C'],
    onPress: () => console.log('Calling support...'),
  },
  {
    title: 'Email Support',
    description: 'emporie@gmail.com',
    icon: (color) => <MaterialIcons name="email" size={24} color={color} />,
    gradient: ['#29C8B1', '#64D6C0'],
    onPress: () => console.log('Opening email...'),
  },
  {
    title: 'FAQs',
    description: 'Browse common questions',
    icon: (color) => <FontAwesome5 name="question-circle" size={24} color={color} />,
    gradient: ['#E95D8E', '#F182AC'],
    onPress: () => router.push('/FAQs'),
  },
];

const HelpSupportScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={['#361696', '#6C48FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Help & Support</Text>
      </LinearGradient>

      {/* Support Options */}
      <ScrollView contentContainerStyle={styles.supportSection}>
        {supportItems.map((item, index) => {
          const scaleAnim = new Animated.Value(1);

          const handlePressIn = () => {
            Animated.spring(scaleAnim, {
              toValue: 0.95,
              useNativeDriver: true,
            }).start();
          };

          const handlePressOut = () => {
            Animated.spring(scaleAnim, {
              toValue: 1,
              useNativeDriver: true,
            }).start();
          };

          return (
            <TouchableWithoutFeedback
              key={index}
              onPress={item.onPress}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
                <LinearGradient
                  colors={item.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.iconWrap}
                >
                  {item.icon('#fff')}
                </LinearGradient>
                <View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDescription}>{item.description}</Text>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  supportSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
});

export default HelpSupportScreen;
