import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from './App';

export default function GeolocationScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let locationSubscription;

    (async () => {
      try {
        console.log('Solicitando permissão de localização...');
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permissão Negada',
            'Permissão de localização negada. Por favor, ative-a nas configurações do dispositivo.'
          );
          setLoading(false);
          return;
        }

        console.log('Iniciando monitoramento da localização...');
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 10,
          },
          async (loc) => {
            console.log('Localização obtida:', loc.coords);
            setLocation({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });

            // Fazer a geocodificação reversa para obter o endereço
            try {
              const geocode = await Location.reverseGeocodeAsync({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
              });

              if (geocode.length > 0) {
                const { city, region, country } = geocode[0];
                const formattedAddress = `${city}, ${region}, ${country}`;
                setAddress(formattedAddress);
                console.log('Endereço obtido:', formattedAddress);
              } else {
                setAddress('Endereço não encontrado');
                console.log('Nenhum endereço encontrado.');
              }
            } catch (geoError) {
              console.error('Erro na geocodificação reversa:', geoError);
              setAddress('Erro ao obter endereço');
            }
          }
        );
      } catch (error) {
        Alert.alert('Erro', 'Erro ao obter localização: ' + error.message);
        console.error('Erro ao solicitar localização:', error);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
        console.log('Monitoramento da localização interrompido.');
      }
    };
  }, []);

  const handleDoar = async () => {
    if (location) {
      try {
        console.log('Salvando localização para doação:', location);
        await addDoc(collection(db, 'locations'), {
          mode: 'doar',
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: new Date(),
        });
        navigation.navigate('CadastroAlimentos');
      } catch (error) {
        Alert.alert('Erro', 'Erro ao salvar localização: ' + error.message);
      }
    } else {
      Alert.alert('Erro', 'Localização ainda não disponível.');
    }
  };

  const handleReceber = () => {
    if (!location) {
      Alert.alert('Erro', 'Localização ainda não disponível.');
      return;
    }
    navigation.navigate('Receber');
  };

  const handleProdutosDisponiveis = () => {
    if (!location) {
      Alert.alert('Erro', 'Localização ainda não disponível.');
      console.error('Erro: localização não disponível.');
      return;
    }
    console.log('Preparando para navegar para Produtos com localização:', location);

    if (location.latitude && location.longitude) {
      navigation.navigate('Products', {
        latitude: location.latitude,
        longitude: location.longitude,
      });
      console.log('Navegou para a tela de Produtos com sucesso!');
    } else {
      Alert.alert(
        'Erro',
        'Os dados de localização não estão configurados corretamente. Tente novamente.'
      );
      console.error('Erro: Dados de localização incompletos:', location);
    }
  };

  const handleViewChats = () => {
    const userId = auth.currentUser?.uid; // ID do usuário autenticado

    if (!userId) {
      Alert.alert('Erro', 'Usuário não autenticado. Faça login novamente.');
      return;
    }

    if (!location) {
      Alert.alert('Erro', 'Localização ainda não disponível.');
      console.error('Erro: localização não disponível.');
      return;
    }

    console.log('Navegando para a tela de chats com:', {
      userId,
      latitude: location.latitude,
      longitude: location.longitude,
    });

    navigation.navigate('ChatList', {
      userId, // ID do usuário atual
      latitude: location.latitude,
      longitude: location.longitude,
    });
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
        <Button
          title="Produtos Disponíveis"
          onPress={handleProdutosDisponiveis}
          color="#FF9800"
        />
        <Button
          title="Ver Meus Chats"
          onPress={handleViewChats}
          color="#FF5722"
        />
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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    gap: 10,
  },
});
