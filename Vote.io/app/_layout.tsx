import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="RegistrationScreen" options={{ title: 'Register' }} />
        <Stack.Screen name="HomeScreen" options={{ title: 'Voting' }} />
        <Stack.Screen name="ThankYouScreen" options={{ title: 'Thank You' }} />
        <Stack.Screen name="ResultsScreen" options={{ title: 'Vote Results' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}