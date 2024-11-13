import AsyncStorage from '@react-native-async-storage/async-storage';
import { VALIDATE_OIB, VALIDATE_OIB_VOTED } from '@/config/API_constants';
import { Alert } from 'react-native';
import { log } from 'console';


export const validateOIB= async(oib: string) => {
    console.log(`${oib}`)
    const jwtToken = await AsyncStorage.getItem('jwtToken') || '';
    try {
      const response = await fetch(VALIDATE_OIB, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + jwtToken,
        },
        body: JSON.stringify({ oib }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const exists = await response.json();
      if (!exists) {
        return false;
      }
    }catch(e){
        console.log(e);  
    }
}


export const validateOIBVoted= async(oib: string) => {
  console.log(`${oib}`)
  const jwtToken = await AsyncStorage.getItem('jwtToken') || '';
  try {
    const response = await fetch(VALIDATE_OIB_VOTED, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwtToken,
      },
      body: JSON.stringify({ oib }),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const exists = await response.json();
    if (exists) {
      return false;
    }
  }catch(e){
      console.log(e);  
  }
}