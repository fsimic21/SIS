import { Button, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { signInWithEmailAndPassword} from 'firebase/auth'
import { useState } from "react";
import {auth} from '../config/firebaseConfig'
import React from "react";
import { LOGIN_API } from "@/config/API_constants";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();
  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();
      const response = await fetch(LOGIN_API , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: idToken,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      await AsyncStorage.setItem('jwtToken', data.jwt); 
      router.replace("/homeScreen");

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error during login:', error.message); 
        setError(error.message);
      }
    }
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}

      <TextInput
        style={{ borderWidth: 1, width: 200, marginBottom: 10, padding: 8 }}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      <TextInput
        style={{ borderWidth: 1, width: 200, marginBottom: 10, padding: 8 }}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      <Button title="Login" onPress={login} />
    </View>
  );
}