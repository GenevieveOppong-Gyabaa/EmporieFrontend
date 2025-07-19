import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
    screenOptions={{tabBarActiveTintColor: '#361696', tabBarInactiveTintColor: '#000'}}
    >
      <Tabs.Screen 
        name="Home" 
        options={{ 
            headerShown: false,
            tabBarIcon: ({focused, color})=> <Ionicons 
            name={focused ? "home" : "home-outline"} 
            color={color}
            size={24}/>,
            title: "Home",
            }} />
       <Tabs.Screen
        name="Shops"
        options={{
            headerShown: false,
            tabBarIcon: ({focused, color})=> <Ionicons
             name={focused ? "home" : "home-outline"}
             color={color}
               size={24} />,
               title: "Shops",
        }} />
       <Tabs.Screen
        name="Deals"
        options={{
            headerTitle: "Deals",
            tabBarIcon: ({focused, color})=> <Ionicons 
            name={focused ? "pricetag" : "pricetag-outline"} 
            color={color}
            size={24}/>,
            title: "Deals",
        }} />

      <Tabs.Screen
       name="Favorites" 
       options={{ 
            headerTitle: "Favorites",
            tabBarIcon: ({focused, color})=> <Ionicons 
            name={focused ? "heart" : "heart-outline"} 
            color={color}
            size={24}/>,
            title: "Favorites",
        }} />
        
        <Tabs.Screen    
         name="Cart"
            options={{
                headerTitle: "Cart",
                tabBarIcon: ({focused, color})=> <Ionicons 
                name={focused ? "cart" : "cart-outline"} 
                color={color}
                size={24}/>,
                title: "Cart",
            }} />
    </Tabs>
  )
}