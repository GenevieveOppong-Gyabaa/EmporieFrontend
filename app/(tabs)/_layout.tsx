// app/_layout.js
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName : any;

          switch (route.name) {
            case 'index':
              iconName = 'home';
              break;
            case 'search':
              iconName = 'search';
              break;
            case 'favorites':
              iconName = 'heart-outline';
              break;
            case 'cart':
              iconName = 'bag-outline';
              break;
            default:
              iconName = 'heart-outline';
              return
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabel: route.name === 'discounts' ? 'DISCOUNTS' : route.name ==='index' ? "HOME" : route.name.toUpperCase(),
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#333',
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerShown:false
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
      <Tabs.Screen
        name="deals"
        
      />
      <Tabs.Screen name="favorites" options={{ title: 'Favorites' }} />
      <Tabs.Screen name="cart" options={{ title: 'Cart' }} />
    </Tabs>
  );
}
