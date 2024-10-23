import { Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { getCandidates } from '@/constants/API_constants';

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

  useEffect(() => {
    fetchCandidates();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View>
      <Text>Select a candidate:</Text>
      {}
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

      <Text>Selected Candidate ID: {selectedCandidate}</Text>
    </View>
  );
}
