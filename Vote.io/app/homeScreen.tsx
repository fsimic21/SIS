import { Text, View, ActivityIndicator, Button, Alert, TextInput, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { RSA } from 'react-native-rsa-native';
import { getCandidates, submitCandidate, validateOIB } from '@/constants/API_constants';

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
    try {
      const response = await fetch(getCandidates, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: Candidate[] = await response.json();  
      setCandidates(data);
      setLoading(false);
    } catch (error) {
      console.error("Error during fetch", error);
      setLoading(false);
    }
  };

  const PUBLIC_KEY = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlBIug9m5MHE0KD+M/trF
  4Sr5OqV0j+mSJwQz/dA1xs9tP/+QKF2ZHoReBzZNsrWptyagz8JtNA45B6WqSsoL
  IZYwxKc9jC4BPHJCb9MBLcGnW0b0I3MW2qvVyX9/1JtYI5Hw/Q80RpQX9/ye1rL3
  DfWJz2zuai4LkljHpLEScSgyV0i9Z9t99GaKZWLC8MfaopJFo2NhW88Mo/PFv5aP
  5Mc9fh+aPnVoiLfAZH0jO0F2ZKmlwkGvACz8Kdbyl9vv7JIVWnJ4vl8GiNh4PrKr
  0eEMR1JKNyVW3VccPnmxPrSYPnpSD43hg+g1erj+XbPV9B/V+1ldPVI9kkyHM3AJ
  2wIDAQAB`;

  const PRIVATE_KEY = `MIIEoAIBAAKCAQEAhU/g2OwO8ll/qGTM4zss0862nRlgk7PGZE9Ln/RMxk8g4Rxa
E9YYZFuh+FzdyIPDA+u64ydUd2Nq2GoyL4hDaBuivEscKv8FEMTqNC1ZzWlrYex0
VuYOnAkCLFRhD78EgtbiLge5W53KSHZQC/oD4VoFRmG45R+cGOgO45cooW2P5Gft
qSShTlWwlmvQ+bBLgojpKmDN7MEw3EOp3ztKIg0xEexBh5j3Kh2NuzhPrX1Q5iON
lXUsg337TP28eK0ZWaV0UuiQHg8m4NBEqqiPDjCLHyu7HL1GJAcd53gGTbTkdh0a
9HOQmXEoDGu5QBMLFJUfABBrkuXoVshFBjJypQIDAQABAoIBAFZHzI6YuVPA+Q5T
rweiVPEA6M/kjM0LnWtuptNvmgD/VZhccTBFcKQDamEEOcZ9AMqY1uwNmG1suso2
cSSyXG4U9M5JDoIFa5He4HXEpEp94DIQh3t2ih4S9oUaV3eJebH0wY5pEV5qUXF0
oXoe5kQDr0ZOGQyx2KWGC5zhSDqxbkaXVZX+IWauX3dglsRvoljtYes7EI+Tmb7d
PG1ywg/8XgwEyCew+ONJzxZ+5+CMORzaC3aVAanAd9yc4tbpcL/EzKsUFdrSts7F
yM6T1mRrHoGpseQ1J8u8RRd1J71oL+AUAi/I5rO/whIsdTnsPOrTS6rQead8o0PP
dLBvggECgYEAyh+dxQpi06N4Ji2lmZdTt92OpwAmaMTSulv43GiersqD8476PvM7
r25UrdJt6N8F0L8TQ1uSp+u7HK7P6hrS9ZjHR+qOIpB2SqUvgaeZP8ZKmm/InsW8
zKSqAaoTuQ+VMg477oNxK4Gqxrpn3PQVLdVVHRAPbtM15MMdCPmDCakCgYEAqNi+
yWu/P33FEnAc8ewHK5b6GK+CXPrn78Zboju16Q/kgh7Jt1/4RGyuA7vmIFDO1fI4
5QUPRoHsk7MCRe9OEh9fsReFloEWlMOdh4AJxn3exstXmQVcJCBp2ipOYsMAO3tE
JDXX3bnGon3dk0DgqN1tELlGAYdyiEH03TiZFp0CfynYYdFpVQx7y2QcDyy9J5fp
Rp9MaKdIGFh8sgjvn+qQAsFp2GUv9itbrCxQZHDRu2J8LIDFdJdPNm25w1G0O/ic
qKU66jI9tj+98xfkmtWZN9jBS8eTKIM1k/zEOVEW6Mx0JfQ7QjK/pZt+/AHChp/2
iqh5qrhHAeFag6hX/8kCgYA0GLQ9N6aJs4ej2b3EkzvfIjVGepixkaUQoVZSpzPI
lmO+FjvM/ap/ijzi4A3wOJ6o+pS9bSM6cQoKxHfWFjEzfEStQoGwX2IVQooPbd0W
Rm3/TmxXxYSZjPq8GsOWy2397FmpBof1XMXCCy3bqm/nCnMFbvT/scgP7LHdtAHg
LQKBgDuqR7Bbc9hmOSTjFRYlMzrMKsSvXRuLZqu20iX4lpBcAkwGwK3Nmp3BZrsh
G/BLQl3AfV2RqMqVyyKsSTnjn/Dn8/h4GxoTS+5gJaeHM/uyRgqgqVFGY7wENCBh
ljYFM3CW1rZuTdOy3H6XC6XipGLOHZJZRzL23ZLTutdQW3Ri`;

  const handleOIBSubmit = async () => {
    if (oib.length !== 11) {
      setError("OIB must be 11 characters.");
      return;
    }

    try {
      const response = await fetch(`${validateOIB}/${oib}`, { method: 'GET' });
      const exists = await response.json();

      if (!exists) {
        Alert.alert("Invalid OIB", "The OIB does not exist in our records.");
        return;
      }

      const message = `${oib}.${selectedCandidate}`;

      const signedMessage = await RSA.sign(message, PRIVATE_KEY);

      const encryptedMessage = await RSA.encrypt(message, PUBLIC_KEY);

      await submitCandidateToBackend(signedMessage, encryptedMessage);
      setShowOIBModal(false);

    } catch (error) {
      console.error("Error during OIB validation:", error);
    }
  };

  const submitCandidateToBackend = async (signedMessage: string, encryptedMessage: string) => {
    try {
      const response = await fetch(submitCandidate, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ signedMessage, encryptedMessage }),
      });

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
