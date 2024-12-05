import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import LoginScreen from './tela-login';

// Adicione o firebaseConfig gerado no console do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAe5xP5lG5N6Yvte2AbYaPxScfmW3_ujX4",
  authDomain: "portifolio-776ea.firebaseapp.com",
  projectId: "portifolio-776ea",
  storageBucket: "portifolio-776ea.firebasestorage.app",
  messagingSenderId: "944423387038",
  appId: "1:944423387038:web:ede32c404b1a929079208f",
};

// Inicialize o Firebase e o Firestore
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Tela de Login' }} 
        />
        {/* Adicione outras telas aqui conforme necessário */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
