import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './App';
import { Picker } from '@react-native-picker/picker';

export default function GeolocationScreen() {
  const [location, setLocation] = useState(null); // Armazena latitude e longitude
  const [address, setAddress] = useState(null); // Armazena o endereço atual
  const [mode, setMode] = useState('doar'); // Alternar entre "Doar" e "Receber"

  useEffect(() => {
    (async () => {
      // Solicitar permissão para acessar a localização
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão Negada', 'Permissão de localização negada');
        return;
      }

      // Obter a localização atual
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      // Fazer a geocodificação reversa para obter o endereço
      const geocode = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (geocode.length > 0) {
        const { city, region, country } = geocode[0];
        setAddress(`${city}, ${region}, ${country}`);
      } else {
        setAddress('Endereço não encontrado');
      }
    })();
  }, []);

  const handleSaveLocation = async () => {
    if (location) {
      try {
        await addDoc(collection(db, 'locations'), {
          mode,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          timestamp: new Date(),
        });
        Alert.alert('Sucesso', 'Localização salva no banco de dados!');
      } catch (error) {
        Alert.alert('Erro', error.message);
      }
    } else {
      Alert.alert('Erro', 'Localização ainda não disponível');
    }
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={mode}
        style={styles.picker}
        onValueChange={(itemValue) => setMode(itemValue)}
      >
        <Picker.Item label="Doar" value="doar" />
        <Picker.Item label="Receber" value="receber" />
      </Picker>
      <Text style={styles.text}>
        {address
          ? `Localização Atual: ${address}`
          : location
          ? `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`
          : 'Obtendo localização...'}
      </Text>
      <Button title="Salvar Localização" onPress={handleSaveLocation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  picker: {
    height: 50,
    width: 200,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});
