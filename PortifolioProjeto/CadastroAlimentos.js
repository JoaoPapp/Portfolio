import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { collection, setDoc, doc } from 'firebase/firestore';
import { auth, db } from './App';

export default function CadastroAlimentos({ navigation }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  // Capturar a localização do usuário
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão Negada', 'Permissão de localização negada.');
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      } catch (error) {
        Alert.alert('Erro', 'Erro ao obter localização: ' + error.message);
      }
    })();
  }, []);

  // Selecionar imagem
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Salvar doação no Firestore
  const handleCadastro = async () => {
    if (!nome || !descricao || !quantidade) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios!');
      return;
    }

    if (!location) {
      Alert.alert('Erro', 'Localização ainda não disponível.');
      return;
    }

    const user = auth.currentUser; // Obter o usuário autenticado
    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    setLoading(true);

    try {
      // Gerar um ID único para o productId
      const productId = doc(collection(db, 'donations')).id;

      await setDoc(doc(db, 'donations', productId), {
        productId, // Inclui o productId gerado automaticamente
        nome,
        descricao,
        quantidade,
        image,
        latitude: location.latitude, // Latitude do doador
        longitude: location.longitude, // Longitude do doador
        userId: user.uid, // ID único do usuário que doou
        userEmail: user.email, // Email do usuário (opcional)
        status: 'disponível',
        timestamp: new Date(),
      });

      Alert.alert('Sucesso', 'Alimento cadastrado com sucesso!');
      navigation.navigate('Geolocalizacao'); // Retorna para a tela principal
    } catch (error) {
      Alert.alert('Erro', 'Erro ao cadastrar alimento: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Alimento</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do alimento"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade (ex: 2 kg, 5 unidades)"
        value={quantidade}
        onChangeText={setQuantidade}
      />
      <Button title="Selecionar Imagem" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button
        title={loading ? 'Cadastrando...' : 'Cadastrar'}
        onPress={handleCadastro}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    marginBottom: 16,
    borderRadius: 5,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 16,
    alignSelf: 'center',
  },
});
