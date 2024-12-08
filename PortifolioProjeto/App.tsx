import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID } from '@env';
import LoginScreen from './tela-login';
import GeolocationScreen from './Geolocalizacao';
import CadastroAlimentos from './CadastroAlimentos';
import ReceberScreen from './ReceberAlimentos';
import PoliticaPrivacidade from './PoliticaPrivacidade';
import ChatScreen from './Tela-Chat';

// Configuração do Firebase usando variáveis do .env
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
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
        <Stack.Screen 
          name="PoliticaPrivacidade" 
          component={PoliticaPrivacidade} 
          options={{ title: 'Política de Privacidade' }} 
        />
        <Stack.Screen 
          name="Geolocalizacao" 
          component={GeolocationScreen} 
          options={{ title: 'Geolocalização' }} 
        />
        <Stack.Screen 
          name="CadastroAlimentos" 
          component={CadastroAlimentos} 
          options={{ title: 'Cadastrar Alimento' }} 
        />
        <Stack.Screen 
          name="Receber" 
          component={ReceberScreen} 
          options={{ title: 'Receber Alimentos' }} 
        />
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={{ title: 'Chat' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
