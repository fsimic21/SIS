import AsyncStorage from '@react-native-async-storage/async-storage';
import forge from 'node-forge';
import { getCandidates as getCandidatesURL, submitCandidate, validateOIB } from '@/config/API_constants';
import { Alert } from 'react-native';
import { Candidate } from '@/constants/candidate';
import { PUBLIC_KEY, PRIVATE_KEY } from '@/config/keys';

export const fetchCandidates = async (): Promise<Candidate[]> => {
  const jwtToken = await AsyncStorage.getItem('jwtToken') || '';
  try {
    const response = await fetch(getCandidatesURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwtToken,
      },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error during fetch:", error);
    return [];
  }
};

export const validateOIBAndSubmitCandidate = async (oib: string, selectedCandidate: string) => {
  const jwtToken = await AsyncStorage.getItem('jwtToken') || '';
  try {
    const response = await fetch(validateOIB, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwtToken,
      },
      body: JSON.stringify({ oib }),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const exists = await response.json();
    if (!exists) {
      Alert.alert("Invalid OIB", "The OIB does not exist in our records.");
      return false;
    }
    const message = `${oib}.${selectedCandidate}`;
    const privateKey = forge.pki.privateKeyFromPem(PRIVATE_KEY);
    const publicKey = forge.pki.publicKeyFromPem(PUBLIC_KEY);
    const md = forge.md.sha256.create();
    md.update(message, 'utf8');
    const signedMessage = forge.util.encode64(privateKey.sign(md));
    const encryptedMessage = forge.util.encode64(publicKey.encrypt(message, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
      mgf1: { md: forge.md.sha1.create() }
    }));
    return await submitCandidateToBackend(signedMessage, encryptedMessage);
  } catch (error) {
    console.error("Error during OIB validation:", error);
    return false;
  }
};

const submitCandidateToBackend = async (signedMessage: string, encryptedMessage: string) => {
  const jwtToken = await AsyncStorage.getItem('jwtToken') || '';
  try {
    const response = await fetch(submitCandidate, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwtToken,
      },
      body: JSON.stringify({
        encryptedData: encryptedMessage,
        signature: signedMessage
      }),
    });
    return response.ok;
  } catch (error) {
    console.error("Error submitting candidate:", error);
    return false;
  }
};
