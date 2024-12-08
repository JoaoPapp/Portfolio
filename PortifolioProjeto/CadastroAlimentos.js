import React, { useState } from 'react';
import { View, TextWrapper, TextInput, Button, Alert, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './App';

export default function CadastroAlimentos({ navigation }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [image, setImage] = useState(null);

  // Função para selecionar uma imagem
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

  // Função para salvar os dados no Firestore
  const handleCadastro = async () => {
    if (!nome || !descricao || !quantidade) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios!');
      return;
    }

    try {
      await addDoc(collection(db, 'donations'), {
        nome,
        descricao,
        quantidade,
        image,
        timestamp: new Date(),
      });

      Alert.alert('Sucesso', 'Alimento cadastrado com sucesso!');
      navigation.navigate('Geolocalizacao'); // Retorna para a tela principal
    } catch (error) {
      Alert.alert('Erro', 'Erro ao cadastrar alimento: ' + error.message);
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
      <Button title="Cadastrar" onPress={handleCadastro} />
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
