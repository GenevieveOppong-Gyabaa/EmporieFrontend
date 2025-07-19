import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const [isLoggedIn ] = useState(true)

  useEffect(() => {
    // False redirect to login page 

    if(isLoggedIn) return
    // logic, check if user is not logged in, then redirect to the login page
    setTimeout(() => {
      router.push("/auth/login")
    } , 100)
  } , [isLoggedIn])

  return (
   <View style={styles.container}>
    <Text>Start</Text>
   </View>
  );
}

const  styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});



