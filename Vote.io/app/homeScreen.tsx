import { Text, View, ActivityIndicator, Button, Alert, TextInput, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { getCandidates, submitCandidate, validateOIB } from '@/constants/API_constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RSA } from 'react-native-rsa-native';

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

    console.log("Ovo je jwt token", jwtToken)
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
      console.error("Error during fetch", error);
    } finally {
      setLoading(false); 
    }
  };
  

  const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApEFp54cXiJUJcF6t5UkNPV2H0/njWUqr2SD52yz4U6grzXwUCGhPClxyTTz0tImM+5u2MO81MLinbbEQXLErdnabMI8Fd82iATpRS+/oKcpOmI3wBrj/KneMIMa+csbM3Zm6F+zt8ML+ZAX6EFSouHn1bUcJCfAbh3Kur6sf/0U6KTqNrjwymiMXrnX5MwncVO7gPY7Er+4WMmJnaut3oV70G/nQBwCRaVC78F+drvXN3frQe+TkADJXoitygowaOG59vSqodRvesbv8cFA/4jF8ydIWux3Hi+tvBNuslk3oOvi4boTz9XfznhlHpgzmU1kzLMUs5ZfeHZ8QTOC3NwIDAQAB-----END PUBLIC KEY-----`;

  const PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDR1Xkt3UcWzqOkTWxW8L5Uy2YMPR6MA7JLs+Scfc6Rr3bYjFAZ7Y50JThKtAKpgODhd8hKxXAwhWcew66DOv+LkZWa15MpIUaDRpkXLyj0MphXrrq9lsAXnoW3NDgh5ttuPxBZrLuO55cq5YLxdwRL3KWHNNzGW01+pITVi5L87cBYNLHGBcffRy+O3cTsgQxCkNUwifS9dMbFqfYsdInoaLPTdshOFMVvt9irAjfG9xrA+kB1Lo9zkjFG2MOxB5TfJP9zdvvXPWxyohrYrRWqROWK30QhzCk1jrrP9H1oQxzQSb4CjSUep8e7iUVfNUAZCp7LPGl9aJ8918gL6szhAgMBAAECggEAA0JWJRV5BMcVs8KvwljvvTLsj+zvbsbMQTtB0NbDu4UMFZh2Ul9wypKHwYydYaMauxMdyrWEL34USDN2Ctvte1jknTiodJIrqB8pAmXCidUdrcz3tw6inKtNvIxPK+L2o7Yki56wdMDZmvpgx93XSf4FxH1tyWyXyKCxtHxmvnlurf9ZyTOfSgBKk4162xvOrAXGNOEro6V9rH9bzk+SP4DVDnrmb9yNjztJdSa0tJ4nqDQ+xCZxnefVveNntuhRj6oO308zsBZEGgUhoaXenA1Ymzgb2+pEUHOZ34v+/SY//ewZAQuHaq6zfKllGlD1E1or8Pov6J8noD7StF1z/QKBgQDtH3TVaXMGySzR5kVAi0FDIUPvx8FiRxOm91r1WvwRVAzuzsU1MwzrpnUuqc10xQGLr+MIDLjxXtCtg1kSeMfnRJra70/eyn5OM/vBZT6Z4PwdHxkLDeFMClg3q7Cpld9vjTh5SKBkS8M96Kxe7F0vEbXbDHXYIxzHUjms2oHUbQKBgQDiid6eVY31DT0S0MH+pYfaG1dGh/qNRN19yKRPIxHDRoWWHraVXbiWSxHpFRiL7tFhHufSORV1azgZWLPfVQlXo5A7b32bb84OOU9QuZ5+/dY1XUe+YnTrHRvQav0V8vtKzPftkZKaKpJXTtD4tnBaOCnfunfLhFJcpohNPCSJxQKBgEJfE6zIn1G+7bSy559xWwsXPJTZLN/9VRrfEa6rkPKovBX7+mcxquQq65HsJX4RxqT6zmlqZjnpeC+ZHE13UT0CjvXJFmod88yf8E/pruQTfX4JPlFByVYnbxnmDMTrFmd699u64GoyaqvhfJ31Ov/5zRVLH5EoAt4nvc0MPFrhAoGAQUL2nyaGftIRhhodyP5m5K57thX2WDw+kr36l9HCjD8EvPqcHuuhAasevccWCzoBl7kPj8BiLjF1N9gV+YDF8Dluk7DKvry23+Iit17CClOWIkl9IZu7kwAPwzsPLgOR4TqrMgV99mvNPNm32e6070i+x3UwjbDRCV/wZE+vNwECgYAWkEhP9MIp0UyaxAi2KHZfynCFwSJuxrYa/T/CYNwiKq3AcMUwe6L82RnGQUF1dFolBv1klz9HUj+YQKChLm8BxAvJcXxWEdEjRYs1xgPAcYnmf0vFrpMd0hMvC5AkvOxIdWIHV0d88FFgiGDjcG7NFnKswZiW+JO5WnzWoTpgGw==-----END RSA PRIVATE KEY-----`;

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
            body: JSON.stringify({
              oib
            }),
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
        
        console.log("Private Key:", PRIVATE_KEY);
        console.log("Public Key:", PUBLIC_KEY);
        console.log(`poruka : ${message}`)
        console.log("RSA Object:", RSA);
        
        const signedMessage = await RSA.sign(message, PRIVATE_KEY);
        const encryptedMessage = await RSA.encrypt(message, PUBLIC_KEY);

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
          "Authorization": jwtToken || '',
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
