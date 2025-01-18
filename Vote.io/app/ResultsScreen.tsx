import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { fetchVoteResults } from '@/services/candidateService';

interface Candidate {
  id: string;
  name: string;
  surname: string;
  votes: number;
}

export default function ResultsScreen() {
  const [results, setResults] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      try {
        const data = await fetchVoteResults();
        const sortedData = data.sort((a: Candidate, b: Candidate) => b.votes - a.votes);
        setResults(sortedData);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading results...</Text>
      </View>
    );
  }

  if (!results.length) {
    return (
      <View style={styles.centered}>
        <Text>No results available at the moment.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vote Results</Text>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <Text style={styles.candidateName}>
              {item.name} {item.surname}
            </Text>
            <Text style={styles.votes}>Votes: {item.votes}</Text>
          </View>
        )}
      />
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  candidateName: {
    fontSize: 16,
  },
  votes: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
