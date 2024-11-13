import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, Button, Alert, Modal, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { fetchCandidates, SubmitCandidate } from '@/services/candidateService';
import { Candidate } from '@/constants/candidate';
import OIBModal from '@/components/OIBmodal';
import { validateOIB, validateOIBVoted } from '@/services/oibService';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string>(""); // Ensure this is string or the id type
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
    let exists;
    let voted;
    try {
      exists = await validateOIB(oib);
    } catch (e) {
      Alert.alert("Error", "Error while fetching oib.");
    }
    if (exists === false){
      Alert.alert('Error', 'Your OIB does not exists',[
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]);
      return;
    } 

    try {
      voted = await validateOIBVoted(oib);
    } catch (e) {
      Alert.alert("Error", "Error while fetching oib.");
    }
    if (voted === false){
      {
        Alert.alert('Error', 'You already voted', [
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]);
        return;
      } 
    } 
    else{
      try{
        await SubmitCandidate(oib, selectedCandidate);
      }catch (e) {
        Alert.alert("Error", "Error while fetching oib.");
      }
    }
    setShowOIBModal(false)
    
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Select a candidate:</Text>
      <Picker
        selectedValue={selectedCandidate}
        onValueChange={(value) => setSelectedCandidate(value)} 
        style={{ height: 50, width: '100%' }}
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
