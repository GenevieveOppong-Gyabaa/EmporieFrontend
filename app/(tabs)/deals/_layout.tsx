
import { Stack } from 'expo-router';


export default function DealsLayout() {
 

  return (
      <Stack screenOptions={{headerShown:false}}> 
        <Stack.Screen name="index" options={{ headerShown:false }} />
        <Stack.Screen name="[dealId]" options={{ headerShown: false }} />
      </Stack>
  );
}
