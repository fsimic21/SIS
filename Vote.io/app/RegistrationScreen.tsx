import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";


export default function RegistrationScreen(){
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');

    return(
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
        
        <TextInput
          style={{ borderWidth: 1, width: 200, marginBottom: 10, padding: 8 }}
          placeholder="Repeat password"
          secureTextEntry
          value={repeatedPassword}
          onChangeText={(text) => setRepeatedPassword(text)}
        />
  
        <Button title="Login" onPress={login} />
      </View>
      );
}