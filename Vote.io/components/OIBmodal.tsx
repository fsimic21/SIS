import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, ActivityIndicator, StyleSheet } from 'react-native';

interface OIBModalProps {
  onSubmit: (oib: string) => void;
  onCancel: () => void;
}

const OIBModal: React.FC<OIBModalProps> = ({ onSubmit, onCancel }) => {
  const [oib, setOIB] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (oib.length !== 11) {
      setError('OIB must be exactly 11 characters.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onSubmit(oib);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={true} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Enter OIB (11 characters):</Text>
          <TextInput
            style={styles.input}
            value={oib}
            onChangeText={setOIB}
            keyboardType="numeric"
            maxLength={11}
            placeholder="e.g., 12345678901"
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {submitting ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Button title="Confirm" onPress={handleConfirm} />
          )}
          <View style={{ marginTop: 10 }}>
            <Button title="Cancel" onPress={onCancel} color="red" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OIBModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    width: 300,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});