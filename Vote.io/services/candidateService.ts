import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCandidates as getCandidatesURL, submitCandidate,} from '@/config/API_constants';
import forge from 'node-forge';
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

export const SubmitCandidate = async (oib: string, selectedCandidate: string) => {
  console.log(`${oib}.${selectedCandidate}`);
  
  if(selectedCandidate == null)return;
  console.log(`Ovo je poruka : ${oib}.${selectedCandidate}`)
  const jwtToken = await AsyncStorage.getItem('jwtToken') || '';
  const text = `${oib}.${selectedCandidate}`;
  await encryptAndSignMessage(text, PUBLIC_KEY, PRIVATE_KEY).then(async ({ encryptedData, signature }) => {
    try {
      console.log("Enkriptirani podaci "+ encryptedData);
      console.log("Potpis "+ signature);
      
      const response = await fetch(submitCandidate, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + jwtToken,
        },
        body: JSON.stringify({
          encryptedData: encryptedData,
          signature: signature
        }),
      });
      return response.ok;
    } catch (error) {
      console.error("Error submitting candidate:", error);
      return false;
    }
  });



    
  }


  const encryptAndSignMessage = async (message: string, publicKeyPem: string, privateKeyPem: string) => {
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
  };
  