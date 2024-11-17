import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import auth from '@react-native-firebase/auth';  // Importa Firebase Authentication para login

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');      // Estado para armazenar o email inserido pelo usuário
  const [password, setPassword] = useState(''); // Estado para armazenar a senha inserida pelo usuário

  const handleLogin = () => {
    // Função que lida com o login no Firebase
    auth()
      .signInWithEmailAndPassword(email, password) // Faz login com email e senha usando Firebase
      .then(() => {
        navigation.replace('Home'); // Navega para a tela Home (mapa) após o login bem-sucedido
      })
      .catch(error => {
        console.error(error); // Exibe erros de login no console (credenciais incorretas, por exemplo)
      });
  };

  return (
    <View>
      <Text>Email</Text>
      <TextInput 
        value={email} 
        onChangeText={setEmail} 
        placeholder="Digite seu email" 
      />
      {/* Campo de entrada para o email */}
      <Text>Password</Text>
      <TextInput 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        placeholder="Digite sua senha" 
      />
      {/* Campo de entrada para a senha, protegido */}
      <Button title="Login" onPress={handleLogin} />
      {/* Botão que chama a função handleLogin quando pressionado */}
    </View>
  );
}
