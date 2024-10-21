import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true); // Ativa o loading

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setLoading(false);
        navigation.replace('Home');
      })
      .catch(error => {
        setLoading(false);
        Alert.alert('Erro', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput 
        style={styles.input} 
        value={email} 
        onChangeText={setEmail} 
        placeholder="Digite seu email" 
        keyboardType="email-address" 
      />
      <Text style={styles.label}>Senha</Text>
      <TextInput 
        style={styles.input} 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        placeholder="Digite sua senha" 
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  label: { marginBottom: 8, fontSize: 18 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    marginBottom: 12, 
    padding: 8, 
    borderRadius: 5 
  },
});
