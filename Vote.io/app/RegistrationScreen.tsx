import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Image } from 'react-native';
import { GENERATE_GAUTH_KEY, REGISTRATION_API } from '@/config/API_constants';
import { useRouter } from 'expo-router';
import { launchImageLibrary } from 'react-native-image-picker';

const FACE_MATCH_API = "http://localhost:8000/compare_faces_base64"; 

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setrePassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [faceMatchResult, setFaceMatchResult] = useState('');
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

  const handleRegister = async () => {
    if (password !== repassword) {
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

  const pickImage = (setImage: React.Dispatch<React.SetStateAction<string | null>>) => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 1 },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
        }  else if (response.assets && response.assets[0].uri) {
          setImage(response.assets[0].uri);
        }
      }
    );
  };

  const compareFaces = async () => {
    if (!image1 || !image2) {
      setFaceMatchResult('Both images are required');
      return;
    }

    const formData = new FormData();
    formData.append('image1', {
      uri: image1,
      type: 'image/jpeg',
      name: 'image1.jpg',
    } as any);
    formData.append('image2', {
      uri: image2,
      type: 'image/jpeg',
      name: 'image2.jpg',
    } as any);

    try {
      const response = await fetch(FACE_MATCH_API, {
        method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image1: image1.split(',')[1],
        image2: image2.split(',')[1],
      }),
    });
      console.log('image1 ->', image1);
      console.log('image2 ->', image2);
      
      const result = await response.json();
      if (response.ok) {
        setFaceMatchResult(result.is_same_person ? 'Faces match!' : 'Faces do not match');
      } else {
        setFaceMatchResult('Face comparison failed');
      }
    } catch (error) {
      setFaceMatchResult('Error: Unable to compare faces');
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
        placeholder="Re-enter Password"
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
                <Button title="Login" onPress={() => router.replace("/")} />
              </>
            )}
          </View>
        )
      )}

      <Button title="Pick Image 1" onPress={() => pickImage(setImage1)} />
      {image1 && <Text>Image 1 selected</Text>}
      <Button title="Pick Image 2" onPress={() => pickImage(setImage2)} />
      {image2 && <Text>Image 2 selected</Text>}
      <Button title="Compare Faces" onPress={compareFaces} />
      {faceMatchResult && <Text>{faceMatchResult}</Text>}
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
