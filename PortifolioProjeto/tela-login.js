import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './App'; // Importa o Firestore inicializado no App.tsx
import { CheckBox } from 'react-native-elements'; // Biblioteca para o checkbox

export default function LoginScreen({ navigation }) {
  const [name, setName] = useState(''); // Adiciona o estado para o nome
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Alterna entre Login e Cadastro
  const [agree, setAgree] = useState(false); // Para aceitar os termos e política de privacidade

  const handleSignUp = async () => {
    if (!agree) {
      Alert.alert('Atenção', 'Você deve aceitar os Termos e a Política de Privacidade antes de criar sua conta.');
      return;
    }

    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, insira seu nome.');
      return;
    }

    const auth = getAuth();

    try {
      // Cria o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Salva os dados no Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name.trim(),
        email: user.email,
        createdAt: new Date(),
      });

      Alert.alert('Sucesso', 'Usuário criado e salvo no banco de dados!');
      setIsLogin(true); // Retorna para o modo login após criar a conta
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const handleLogin = async () => {
    const auth = getAuth();

    try {
      // Faz login com Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      navigation.navigate('Geolocalizacao');
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ShareFood</Text>
      {!isLogin && ( // Exibe o campo de nome apenas no modo de cadastro
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {!isLogin && ( // Exibe o checkbox e link para a política de privacidade apenas no modo de cadastro
        <>
          <CheckBox
            title="Eu concordo com os Termos e Política de Privacidade"
            checked={agree}
            onPress={() => setAgree(!agree)}
          />
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('PoliticaPrivacidade')} // Navega para a tela de Política de Privacidade
          >
            Leia a Política de Privacidade
          </Text>
        </>
      )}
      {isLogin ? (
        <Button title="Entrar" onPress={handleLogin} />
      ) : (
        <Button title="Criar Conta" onPress={handleSignUp} />
      )}

      <Text
        style={styles.toggleText}
        onPress={() => setIsLogin(!isLogin)}
      >
        {isLogin ? 'Não tem uma conta? Criar agora' : 'Já tem uma conta? Entrar'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#4CAF50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    marginBottom: 16,
    borderRadius: 5,
  },
  toggleText: {
    color: 'blue',
    marginTop: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  link: {
    color: 'blue',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
});
