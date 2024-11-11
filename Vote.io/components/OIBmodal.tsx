import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal } from 'react-native';

interface OIBModalProps {
  onSubmit: (oib: string) => void;
  onCancel: () => void;
}

const OIBModal: React.FC<OIBModalProps> = ({ onSubmit, onCancel }) => {
  const [oib, setOIB] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (oib.length !== 11) {
      setError("OIB must be 11 characters.");
      return;
    }
    onSubmit(oib);
  };

  return (
    <Modal visible={true} transparent={true} animationType="slide">
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
          <Button title="Confirm" onPress={handleConfirm} />
          <Button title="Cancel" onPress={onCancel} />
        </View>
      </View>
    </Modal>
  );
};

export default OIBModal;
