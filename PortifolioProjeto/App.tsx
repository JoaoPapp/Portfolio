import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import LoginScreen from './tela-login';
import GeolocationScreen from './Geolocalizacao';
import CadastroAlimentos from './CadastroAlimentos';
import ReceberScreen from './ReceberAlimentos';
import PoliticaPrivacidade from './PoliticaPrivacidade';
import ChatScreen from './Tela-Chat'; 
import TextWrapper from './TextWrapper';

// Configuração do Firebase
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
        {/* Tela de Login */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Tela de Login' }} 
        />
        {/* Tela de Política de Privacidade */}
        <Stack.Screen 
          name="PoliticaPrivacidade" 
          component={PoliticaPrivacidade} 
          options={{ title: 'Política de Privacidade' }} 
        />
        {/* Tela de Geolocalização */}
        <Stack.Screen 
          name="Geolocalizacao" 
          component={GeolocationScreen} 
          options={{ title: 'Geolocalização' }} 
        />
        {/* Tela de Cadastro de Alimentos */}
        <Stack.Screen 
          name="CadastroAlimentos" 
          component={CadastroAlimentos} 
          options={{ title: 'Cadastrar Alimento' }} 
        />
        {/* Tela de Receber Alimentos */}
        <Stack.Screen 
          name="Receber" 
          component={ReceberScreen} 
          options={{ title: 'Receber Alimentos' }} 
        />
        {/* Tela de Chat */}
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={{ title: 'Chat' }} 
        />
      </Stack.Navigator>
      <TextWrapper style={{ textAlign: 'center', marginTop: 20 }}>
        Rodapé do Aplicativo
      </TextWrapper>
    </NavigationContainer>
  );
}
