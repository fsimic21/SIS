import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './App'; 
import { useRouter } from "expo-router";

export default function ThankYouScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thank You!</Text>
      <Text>Your vote has been recorded successfully.</Text>
      <Button
        title="Go Back to Home"
        onPress={() => router.push('/homeScreen')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
