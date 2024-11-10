import { Text, View, ActivityIndicator, Button, Alert, TextInput, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { getCandidates, submitCandidate, validateOIB } from '@/constants/API_constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import forge from 'node-forge';

type Candidate = {
  id: string;
  name: string;
  surname: string;
  votes: number;
};

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [showOIBModal, setShowOIBModal] = useState(false);
  const [oib, setOIB] = useState('');
  const [error, setError] = useState('');

  const fetchCandidates = async () => {
    const jwtToken = await AsyncStorage.getItem('jwtToken') || '';
    console.log("JWT token:", jwtToken);
    try {
      const response = await fetch(getCandidates, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + jwtToken || '',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Candidate[] = await response.json();
      setCandidates(data);
    } catch (error) {
      console.error("Error during fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  const PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA9ZWFZPwbKYnfEAOYLEUJq2isMyRi2C1Ob5Sc+IetI/RM1Zam
1BjUdgBtAfkGrdJgFNA/qbCIZWjZTgaIzDu9AtUd7zPD732iqMOoCOkqyfhwn9+7
WCEZ/GqR0MZ8vEHre1d6ApdIsiTw4X0D89Tlj++Kjm0zJKDlSy5QC49+IRetJPrT
h5pUOBpDHaB6MpcdmagiAUFkflstuvujSPWycPXr8B29W+vQU0Dd0BI1iyUAoQcN
mOHnINW1dTmI8HeUpEuarpIAAEteS4+jc+1I11WkIGT333p120RO0LyEXEpkZRHA
5c0pOOngk3q2/2/D3pXEcbIgs5VWR+fc5lml+wIDAQABAoIBAHaelQL0/o2uyW5r
vgnMAuKnOV2ueovePl+I0dT9e7S9IIueK9CQebbRd9WXGhHFZqFHASkOWqNY5HVa
lKLJS/9dPws13rMD5RhNARHkxcUuWf/uygfEXU/djbbg2Ij58iruUsGDnxpk23Ce
uNUChStj0XH/7s8HZBlPMlyTH6INYlxw7RAJBlENVq8zJ2iEUwx+WGOFxLsa4cF/
V3RN7Lvtn//OVAJyuSKsVrYxC9GGFkpFVAW/hw27IKRxgiSso3v/nqmAY5PwjcNz
er74trpuCJZ9Q4WbBqyGI/kilGByLsGdS7OZVnefVN3nMumuzfkrL86dn7eI8cje
+Gzs+2kCgYEA+2h5XRgfCv42UQ58Ubkxpat6s4e35WIAJmF3zvnHT1N/CZqRQvdA
Tokz5AceNTI9i1JZsKpSrlXZ8GLTEDBXz8e9Sgg5pFJTFexZv4LVtLSLwqvFv0IE
Ex0xsmn4aX3PfuWmqTF0BhL67cKCgdJyTjI7RArKvoOdLoQcwP0B/W8CgYEA+hHQ
rkDqMvH/gkHp90IbPVs40brbJp0ZQ8pOY7r6+gHPtuLk3U85kedhDAqjpZ7d/2rf
Snv//cEbiIS6SFbOb1F0lZeT2Ms4XCMQaar7BGKKtiT48LqnG9iAzY+stnEvbNi5
iSkYNGgUhINhalup3XsLbNtZCcj3Lqoosx5XsjUCgYBDiuroJt3YLznahwDBV/bN
oodBilnOh4iwxwjQE20Hk9ASfXM/QXwGXXgScBMeiZPdRU+RVgEGk0wM+A/qToKY
8Pma1SDfU7q8rhXijLzrYoIV1941pv+/Pt2mKDAz7zf6yKoA1KduJlVB4Tr8s9Q/
y+D+Q8P6cROedqHe+1o4gwKBgQCIkVglAgClB/JhYbvzs9+Kd5olN+XdRah5lC+R
WZkdFgYpO+p/TngDTZh7aggLOCLHDceaNvQL0f1GZi4RuY6Nzq9bzucIW5uQ/flF
rAHgWCym4rQtS9Jda7SUDqXlERU0XXueA5pbbIfgApwd6Kdw9HS942DR7jXH/1ew
0p5UDQKBgBqA4+LVwe/W0BrZqiX5LJfefWI6VAvUQDgGZNQDytQXX3GPryQkBCm5
atyH63phDa1KaefqLVpsW9vsr2/H6iIZmVLpTHeLmenLQ3FtfVMwOpMhNGd2/bnS
XG34u1co7mq8ghkU7PaOrEnIJCc5877qML5q0MY+MKCitEC/I/T/
-----END RSA PRIVATE KEY-----`
  const PUBLIC_KEY=`-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAprDsVD7DwZmGArR1y8H3
TS9/ZCtITooi3EbxfMkHOoElPSW7NeQMB5ZAmT8LyeFuoLx6BMFMnLnMbYW/S58V
qcA4e7JTdP30EMmMlta5vUbTZDqOWB+4uDtKmG08YGZulgC/DoeyBXQrc40Ov8PP
jBN2AcDCSEBRw7gR6guczmo9EIC2srKka/cgOswQX76JziDbiGU/WHaYmAjG7kV3
bA8DpDyKjTuwdcCraddYnRKtlklnyyPFSzhAi3uZidGhOttasxk9MsXblQwcC7lz
COMEBGJylIJLvJ7jFfjdYhZ49tsZVB7eqZcEzPPkrcnVBlI61AB3ezIyF5sN59O8
MQIDAQAB
-----END PUBLIC KEY-----`
  const handleOIBSubmit = async () => {
    if (oib.length !== 11) {
      setError("OIB must be 11 characters.");
      return;
    }

    const jwtToken = await AsyncStorage.getItem('jwtToken') || '';
    try {
      const response = await fetch(validateOIB, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + jwtToken || '',
        },
        body: JSON.stringify({ oib }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const exists = await response.json();

      if (!exists) {
        Alert.alert("Invalid OIB", "The OIB does not exist in our records.");
        return;
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

console.log("Encrypted Message:", encryptedMessage);
console.log("Signed Message:", signedMessage);

await submitCandidateToBackend(signedMessage, encryptedMessage);
setShowOIBModal(false);
    } catch (error) {
      console.error("Error during OIB validation:", error);
      Alert.alert("Error", "An error occurred while validating OIB.");
    }
  };

  const submitCandidateToBackend = async (signedMessage: string, encryptedMessage: string) => {
    const jwtToken = await AsyncStorage.getItem('jwtToken') || '';

    try {
      const response = await fetch(submitCandidate, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + jwtToken || '',
        },
        body: JSON.stringify({
          encryptedData: encryptedMessage,  
          signature: signedMessage         
      }),      });

      if (response.ok) {
        Alert.alert("Success", "Candidate selection submitted successfully.");
      } else {
        Alert.alert("Error", "Failed to submit candidate selection.");
      }
    } catch (error) {
      console.error("Error submitting candidate:", error);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View>
      <Text>Select a candidate:</Text>

      <Picker
        selectedValue={selectedCandidate}
        onValueChange={(itemValue) => setSelectedCandidate(itemValue)}
        style={{ height: 50, width: 200 }}
      >
        {candidates.map((candidate) => (
          <Picker.Item
            key={candidate.id}
            label={`${candidate.name} ${candidate.surname}`}
            value={candidate.id}
          />
        ))}
      </Picker>

      <Button title="Submit" onPress={() => setShowOIBModal(true)} />

      <Modal visible={showOIBModal} transparent={true} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ padding: 20, backgroundColor: 'white', borderRadius: 8 }}>
            <Text>Enter OIB (11 characters):</Text>
            <TextInput
              style={{ borderWidth: 1, width: 200, marginTop: 10, marginBottom: 10, padding: 8 }}
              value={oib}
              onChangeText={setOIB}
              keyboardType="numeric"
              maxLength={11}
            />
            {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
            <Button title="Confirm" onPress={handleOIBSubmit} />
            <Button title="Cancel" onPress={() => setShowOIBModal(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
