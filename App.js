import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; // Contêiner que gerencia a navegação no app
import { createStackNavigator } from '@react-navigation/stack'; // Criação de navegação por pilha
import LoginScreen from './screens/LoginScreen'; // Importa a tela de login
import HomeScreen from './screens/HomeScreen';   // Importa a tela inicial (home com mapa)

const Stack = createStackNavigator(); // Inicializa o stack navigator

// Função principal que retorna a configuração do app com navegação
export default function App() {
  return (
    <NavigationContainer> 
      {/* Define o contêiner de navegação que engloba o app */}
      <Stack.Navigator initialRouteName="Login">
        {/* Inicializa o fluxo de navegação com a tela de login */}
        <Stack.Screen name="Login" component={LoginScreen} />
        {/* Primeira tela, de login */}
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* Segunda tela, com mapa, acessível após o login */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
