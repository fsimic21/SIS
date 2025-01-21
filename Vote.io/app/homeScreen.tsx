import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, Button, Alert, Modal, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { fetchCandidates, SubmitCandidate } from '@/services/candidateService';
import { Candidate } from '@/constants/candidate';
import OIBModal from '@/components/OIBmodal';
import { validateOIB, validateOIBVoted } from '@/services/oibService';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [showOIBModal, setShowOIBModal] = useState(false);
  const navigation = useNavigation<any>();
  const router = useRouter();
  useEffect(() => {
    let isMounted = true;

    const loadCandidates = async () => {
      try {
        const data = await fetchCandidates();
        if (isMounted) {
          setCandidates(data);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          Alert.alert('Error', 'Failed to load candidates.');
          setLoading(false);
        }
      }
    };

    loadCandidates();

    return () => {
      isMounted = false;
    };
  }, []);

  const validateOIBAndVotingStatus = async (oib: string) => {
    try {
      const exists = await validateOIB(oib);
      if (!exists) {
        Alert.alert('Error', 'Your OIB does not exist.');
        return false;
      }

      const voted = await validateOIBVoted(oib);
      if (!voted) {
        Alert.alert('Error', 'You have already voted.');
        router.replace('/ResultsScreen');
        return false;
      }

      return true;
    } catch (error) {
      Alert.alert('Error', 'An error occurred while validating your OIB.');
      return false;
    }
  };
  const handleOIBSubmit = async (oib: string) => {
    const isValid = await validateOIBAndVotingStatus(oib);
    if (!isValid) {
      setShowOIBModal(false);
      return;
    }
  
    const success = await SubmitCandidate(oib, selectedCandidate);
    if (success) {
      Alert.alert('Success', 'Your vote has been submitted.', [
        {
          text: 'OK',
          onPress: () => router.push('/ResultsScreen'),
        },
      ]);
    } else {
      Alert.alert('Error', 'Failed to submit your vote. Please try again.');
    }
    setShowOIBModal(false);
  };
  const handleCandidateSubmit = () => {
    if (!selectedCandidate) {
      Alert.alert('Error', 'Please select a candidate.');
      return;
    }
    setShowOIBModal(true);
  };

if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading candidates...</Text>
      </View>
    );
  }
  if (!candidates.length) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No candidates available at the moment.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a candidate:</Text>

      <Picker
        selectedValue={selectedCandidate}
        onValueChange={(value) => setSelectedCandidate(value)}
        style={styles.picker}
      >
        <Picker.Item label="Select a candidate" value="" />
        {candidates.map((candidate) => (
          <Picker.Item
            key={candidate.id}
            label={`${candidate.name} ${candidate.surname}`}
            value={candidate.id}
          />
        ))}
      </Picker>

      <Button title="Submit" onPress={handleCandidateSubmit} />

      {showOIBModal && (
        <OIBModal
          onSubmit={handleOIBSubmit}
          onCancel={() => setShowOIBModal(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 10,
    fontWeight: '600',
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
});