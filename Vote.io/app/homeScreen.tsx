import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, Button, Alert, Modal, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { fetchCandidates, validateOIBAndSubmitCandidate } from '@/services/candidateService';
import { Candidate } from '@/constants/candidate';
import OIBModal from '@/components/OIBmodal';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [showOIBModal, setShowOIBModal] = useState(false);

  useEffect(() => {
    const loadCandidates = async () => {
      const data = await fetchCandidates();
      setCandidates(data);
      setLoading(false);
    };
    loadCandidates();
  }, []);

  const handleOIBSubmit = async (oib: string) => {
    const success = await validateOIBAndSubmitCandidate(oib, selectedCandidate);
    setShowOIBModal(false);
    if (success) {
      Alert.alert("Success", "Candidate selection submitted successfully.");
    } else {
      Alert.alert("Error", "Failed to submit candidate selection.");
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <View>
      <Text>Select a candidate:</Text>
      <Picker
        selectedValue={selectedCandidate}
        onValueChange={(value) => setSelectedCandidate(value)}
        style={{ height: 50, width: 200 }}
      >
        {candidates.map((candidate) => (
          <Picker.Item key={candidate.id} label={`${candidate.name} ${candidate.surname}`} value={candidate.id} />
        ))}
      </Picker>
      <Button title="Submit" onPress={() => setShowOIBModal(true)} />
      {showOIBModal && (
        <OIBModal
          onSubmit={handleOIBSubmit}
          onCancel={() => setShowOIBModal(false)}
        />
      )}
    </View>
  );
}
