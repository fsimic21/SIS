import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './homeScreen';
import ThankYouScreen from './ThankYouScreen';
import ResultsScreen from './ResultsScreen';

export type RootStackParamList = {
  HomeScreen: undefined;
  ThankYouScreen: undefined;
  ResultsScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            title: 'Voting',
            headerLeft: () => null,
            gestureEnabled: false, 
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ThankYouScreen"
          component={ThankYouScreen}
          options={{ 
            title: 'Thank You',
            headerLeft: () => null, 
            gestureEnabled: false,  
            headerShown: false,
          }}
        />
         <Stack.Screen
          name="ResultsScreen"
          component={ResultsScreen}
          options={{
            title: 'Vote Results',
            gestureEnabled: false,
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
