import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCandidates as getCandidatesURL, submitCandidate,} from '@/config/API_constants';
import forge from 'node-forge';
import { Candidate } from '@/constants/candidate';
import { PUBLIC_KEY, PRIVATE_KEY } from '@/config/keys';

export const fetchCandidates = async (): Promise<Candidate[]> => {
  const jwtToken = await AsyncStorage.getItem('jwtToken');
  if (!jwtToken) {
    console.error('JWT token is missing.');
    return [];
  }

  try {
    const response = await fetch(getCandidatesURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`,
      },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error during fetchCandidates:", error);
    return [];
  }
};
export const fetchVoteResults = async () => {
  const jwtToken = await AsyncStorage.getItem('jwtToken');
  if (!jwtToken) {
    console.error('JWT token is missing.');
    return [];
  }

  try {
    const response = await fetch(getCandidatesURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error('Error fetching vote results:', error);
    return [];
  }
};

export const SubmitCandidate = async (oib: string, selectedCandidate: string): Promise<boolean> => {
  if (!selectedCandidate) {
    console.error('No candidate selected.');
    return false;
  }

  const jwtToken = await AsyncStorage.getItem('jwtToken');
  if (!jwtToken) {
    console.error('JWT token is missing.');
    return false;
  }

  const text = `${oib}.${selectedCandidate}`;

  try {
    const { encryptedData, signature } = await encryptAndSignMessage(text, PUBLIC_KEY, PRIVATE_KEY);

    const response = await fetch(submitCandidate, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ encryptedData, signature }),
    });

    return response.ok;
  } catch (error) {
    console.error("Error during SubmitCandidate:", error);
    return false;
  }
};


const encryptAndSignMessage = async (message: string, publicKeyPem: string, privateKeyPem: string) => {
  try {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const encryptedMessage = publicKey.encrypt(message, 'RSAES-PKCS1-V1_5');

    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const md = forge.md.sha256.create();
    md.update(message, 'utf8');
    const signature = privateKey.sign(md);

    return {
      encryptedData: forge.util.encode64(encryptedMessage),
      signature: forge.util.encode64(signature),
    };
  } catch (error) {
    console.error("Error during encryption or signing:", error);
    throw new Error("Failed to encrypt and sign message.");
  }
};

  