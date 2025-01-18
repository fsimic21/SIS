import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GENERATE_GAUTH_KEY, REGISTRATION_API } from '@/config/API_constants';
import { useRouter } from 'expo-router';
import { launchImageLibrary } from 'react-native-image-picker';

const FACE_MATCH_API = "http://localhost:8000/compare_faces_base64";

const RegisterScreen = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);

  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [faceMatchResult, setFaceMatchResult] = useState('');
  const [isFaceMatched, setIsFaceMatched] = useState(false); 


  const isValidPassword = (pw: string) => {
    const regex = /^(?=.*[A-Z]).{8,}$/;
    return regex.test(pw);
  };

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
    if (!isValidPassword(password)) {
      setResponseMessage('Password must be at least 8 chars and contain at least one uppercase letter.');
      return;
    }

    if (password !== repassword) {
      setResponseMessage('Passwords do not match');
      return;
    }

    if (!isFaceMatched) {
      setResponseMessage('Faces must match before registering.');
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
        } else if (response.assets && response.assets[0].uri) {
          setImage(response.assets[0].uri);
        }
      }
    );
  };

  const compareFaces = async () => {
    if (!image1 || !image2) {
      setFaceMatchResult('Both images are required');
      setIsFaceMatched(false);
      return;
    }

    try {
      const base64Img1 = image1.split(',')[1];
      const base64Img2 = image2.split(',')[1];

      if (!base64Img1 || !base64Img2) {
        setFaceMatchResult('Error extracting Base64 data');
        setIsFaceMatched(false);
        return;
      }

      const response = await fetch(FACE_MATCH_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image1: base64Img1,
          image2: base64Img2,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        if (result.is_same_person) {
          setFaceMatchResult('Faces match!');
          setIsFaceMatched(true);
        } else {
          setFaceMatchResult('Faces do not match');
          setIsFaceMatched(false);
        }
      } else {
        setFaceMatchResult('Face comparison failed');
        setIsFaceMatched(false);
      }
    } catch (error) {
      console.error(error);
      setFaceMatchResult('Error: Unable to compare faces');
      setIsFaceMatched(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {}
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {}
      <TextInput
        style={styles.input}
        placeholder="Password (8+ chars, 1 uppercase)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {}
      <TextInput
        style={styles.input}
        placeholder="Re-enter Password"
        secureTextEntry
        value={repassword}
        onChangeText={setRepassword}
      />

      {}
      <View style={styles.row}>
        <TouchableOpacity style={styles.imageButton} onPress={() => pickImage(setImage1)}>
          <Text style={styles.btnText}>Pick Image 1</Text>
        </TouchableOpacity>
        {image1 && <Text style={styles.imageStatus}>Image 1 ready</Text>}
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.imageButton} onPress={() => pickImage(setImage2)}>
          <Text style={styles.btnText}>Pick Image 2</Text>
        </TouchableOpacity>
        {image2 && <Text style={styles.imageStatus}>Image 2 ready</Text>}
      </View>

      {}
      <TouchableOpacity style={styles.compareButton} onPress={compareFaces}>
        <Text style={styles.btnText}>Compare Faces</Text>
      </TouchableOpacity>

      {}
      {faceMatchResult ? (
        <Text style={styles.faceResult}>{faceMatchResult}</Text>
      ) : null}

      {}
      <TouchableOpacity
        style={[
          styles.registerButton,
          { backgroundColor: isFaceMatched ? '#4CAF50' : '#888' },
        ]}
        onPress={handleRegister}
        disabled={!isFaceMatched}
      >
        <Text style={styles.btnText}>Register</Text>
      </TouchableOpacity>

      {}
      {isGeneratingKey && <Text style={styles.loadingText}>Generating secret key...</Text>}
      
      {responseMessage ? (
        responseMessage.startsWith('Error') ||
        responseMessage.startsWith('Registration') ||
        responseMessage.startsWith('Faces') ? (
          <Text style={styles.errorText}>{responseMessage}</Text>
        ) : (
          <View style={styles.secretKeyContainer}>
            <Text style={styles.secretKeyTitle}>Your Secret Code</Text>
            <Text style={styles.secretKeyInfo}>
              Save this code in Google Authenticator:
            </Text>
            <TextInput
              style={styles.secretKeyField}
              value={responseMessage}
              editable={false}
            />
            <Button title="Login" onPress={() => router.replace("/")} />
          </View>
        )
      ) : null}
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  imageButton: {
    backgroundColor: '#3f51b5',
    padding: 10,
    borderRadius: 6,
    marginRight: 10,
  },
  compareButton: {
    backgroundColor: '#2196F3',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 15,
  },
  imageStatus: {
    fontSize: 14,
    color: '#333',
  },
  faceResult: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 15,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
  loadingText: {
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginHorizontal: 10,
    marginBottom: 15,
  },
  secretKeyContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  secretKeyTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 8,
  },
  secretKeyInfo: {
    fontSize: 14,
    marginBottom: 8,
  },
  secretKeyField: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
});