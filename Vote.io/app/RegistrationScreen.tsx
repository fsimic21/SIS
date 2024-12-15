import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { GENERATE_GAUTH_KEY , REGISTRATION_API} from '@/config/API_constants';
import {  useRouter } from 'expo-router';
const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setrePassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const router = useRouter();

  const handleGenerateKey = async () => {
    setIsGeneratingKey(true);  
    try {
      const response = await fetch(`${GENERATE_GAUTH_KEY}/${email}`);

      const result = await response.text();
      if (response.ok) {
        setResponseMessage(result); 
      } else {
        setResponseMessage('Error generating secret key');
      }
    } catch (error) {
      setResponseMessage('Failed to generate secret key');
    } finally {
      setIsGeneratingKey(false);
    }
  };

  // Register user
  const handleRegister = async () => {
    if(password !== repassword){
      setResponseMessage('Passwords do not match');
      return;
    }
    setResponseMessage(''); 
    try {
      const response = await fetch(REGISTRATION_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        handleGenerateKey(); 
      } else {
        setResponseMessage('Registration failed');
      }
    } catch (error) {
      setResponseMessage('Registration failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
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
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={repassword}
        onChangeText={setrePassword}
      />
      <Button title="Register" onPress={handleRegister} />
      
      {isGeneratingKey ? (
        <Text>Generating secret key...</Text>
      ) : (
        responseMessage && (
          <View>
            {responseMessage.startsWith('Error') ? (
              <Text style={styles.errorText}>{responseMessage}</Text>
            ) : (
              <>
                <Text>This is your secret code for Google Authenticator. Please save it in a secure place:</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: '#f0f0f0' }]}
                  value={responseMessage}
                  editable={true}
                />
                <Button title='Login' onPress={()=>{
                  router.replace("/");
                }}/>
              </>
            )}
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default RegisterScreen;
