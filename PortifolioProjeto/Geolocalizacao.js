import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './App';

export default function GeolocationScreen({ navigation }) {
  const [location, setLocation] = useState(null); // Armazena latitude e longitude
  const [address, setAddress] = useState(null); // Armazena o endereço atual
  const [loading, setLoading] = useState(true); // Indica se a localização está carregando

  useEffect(() => {
    (async () => {
      try {
        // Solicitar permissão para acessar a localização
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão Negada', 'Permissão de localização negada');
          setLoading(false);
          return;
        }

        // Obter a localização atual
        let loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

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
      } catch (error) {
        Alert.alert('Erro', 'Erro ao obter localização: ' + error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDoar = async () => {
    if (location) {
      try {
        await addDoc(collection(db, 'locations'), {
          mode: 'doar',
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: new Date(),
        });
        navigation.navigate('CadastroAlimentos'); // Navegar para a tela de cadastro
      } catch (error) {
        Alert.alert('Erro', 'Erro ao salvar localização: ' + error.message);
      }
    } else {
      Alert.alert('Erro', 'Localização ainda não disponível');
    }
  };

  const handleReceber = () => {
    navigation.navigate('Receber'); // Navegar para a tela ReceberScreen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ShareFood</Text>
      <Text style={styles.subtitle}>
        {loading
          ? 'Obtendo localização...'
          : address
          ? `Localização Atual: ${address}`
          : 'Localização não disponível'}
      </Text>
      {location && (
        <MapView
          style={styles.map}
          region={location}
          showsUserLocation={true}
          loadingEnabled={true}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Você está aqui"
          />
        </MapView>
      )}
      <View style={styles.buttonContainer}>
        <Button title="Doar" onPress={handleDoar} color="#4CAF50" />
        <Button title="Receber" onPress={handleReceber} color="#2196F3" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
  map: {
    width: '100%',
    height: '50%',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
});
