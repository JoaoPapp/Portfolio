import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './App'; // Importa o Firestore inicializado no App.tsx

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Alterna entre Login e Cadastro

  const handleSignUp = async () => {
    const auth = getAuth();

    try {
      // Cria o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Salva os dados no Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date(),
      });

      Alert.alert('Usuario criado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const handleLogin = async () => {
    const auth = getAuth();

    try {
      // Faz login com Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Login realizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <View style={styles.container}>
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
});
