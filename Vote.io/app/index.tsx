import { Button, Text, View, ActivityIndicator, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { signInWithEmailAndPassword} from 'firebase/auth'
import { useState } from "react";
import {auth} from '../config/firebaseConfig'
import React from "react";
import { LOGIN_API, VERIFY_GAUTH } from "@/config/API_constants";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isTFAVisible, setTFAVisible] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  interface ValidateEmail {
    (email: string): boolean;
  }

  const validateEmail: ValidateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleTFA = async () => {
    setLoading(true);
    setError(""); 
    try {
      const response = await fetch(`${VERIFY_GAUTH}/${email}/${code}`, {
        method: 'POST',
        mode: 'cors',
      });
  
      if (!response.ok) {
        const errorText = `Server error! Status: ${response.status}`;
        setError(errorText);
        return;
      }
  
      const responseData = await response.json();
  
      if (responseData === true) {
        await AsyncStorage.setItem("isLoggedIn", "true");
        router.push("/homeScreen");
      } else {
        setError("Invalid two-factor authentication code.");
      }
    } catch (error) {
      setError("An error occurred during 2FA verification. Please try again.");
      console.error("2FA Verification Error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  
  const login = async () => {
    if (!validateEmail(email)) {
      setError("Invalid email format.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      const response = await fetch(LOGIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = await response.json();
      await AsyncStorage.setItem("jwtToken", data.jwt);
      setTFAVisible(true);
    } catch (error) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Button title="Login" onPress={login} disabled={isTFAVisible} />
          {isTFAVisible && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter TFA Code"
                value={code}
                onChangeText={setCode}
              />
              <Button title="Submit TFA" onPress={handleTFA} />
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", width: 200, padding: 10, marginBottom: 10 },
  errorText: { color: "red", marginBottom: 10, textAlign: "center" },
});