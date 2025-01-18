import AsyncStorage from '@react-native-async-storage/async-storage';
import { VALIDATE_OIB, VALIDATE_OIB_VOTED } from '@/config/API_constants';
import { Alert } from 'react-native';
import { log } from 'console';


export const validateOIB = async (oib: string): Promise<boolean> => {
  const jwtToken = await AsyncStorage.getItem('jwtToken');
  if (!jwtToken) {
    console.error('JWT token is missing.');
    return false;
  }

  try {
    const response = await fetch(VALIDATE_OIB, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ oib }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const exists = await response.json();
    return exists;
  } catch (error) {
    console.error("Error during validateOIB:", error);
    return false;
  }
};



export const validateOIBVoted = async (oib: string): Promise<boolean> => {
  const jwtToken = await AsyncStorage.getItem('jwtToken');
  if (!jwtToken) {
    console.error('JWT token is missing.');
    return false;
  }

  try {
    const response = await fetch(VALIDATE_OIB_VOTED, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ oib }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const voted = await response.json();
    return !voted; 
  } catch (error) {
    console.error("Error during validateOIBVoted:", error);
    return false;
  }
};
