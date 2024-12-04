import React, { useEffect, useState } from 'react';
import { View, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps'; // Componente de mapa e marcador
import Geolocation from '@react-native-community/geolocation'; // Biblioteca para obter geolocalização do usuário
import auth from '@react-native-firebase/auth'; // Para logout

export default function HomeScreen() {
  const [location, setLocation] = useState({
    latitude: 0,          // Inicializa latitude em 0 (será atualizado com a geolocalização)
    longitude: 0,         // Inicializa longitude em 0
    latitudeDelta: 0.0922, // Define o zoom do mapa (latitudeDelta)
    longitudeDelta: 0.0421, // Define o zoom do mapa (longitudeDelta)
  });

  useEffect(() => {
    // Hook para obter a localização do usuário quando a tela carrega
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords; // Extrai latitude e longitude das coordenadas do usuário
        setLocation({
          ...location,
          latitude,
          longitude,
        }); // Atualiza o estado da localização com as coordenadas reais
      },
      error => console.log(error), // Trata erros de obtenção de localização
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 } // Configurações de precisão da localização
    );
  }, []); // Executa apenas uma vez ao montar a tela

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={location}  // Configura a região inicial do mapa com base na localização do estado
        showsUserLocation={true}  // Mostra a localização atual do usuário no mapa
      >
        <Marker
          coordinate={{
            latitude: location.latitude,  // Usa a latitude do estado atual
            longitude: location.longitude, // Usa a longitude do estado atual
          }}
          title="Você está aqui"  // Texto exibido ao clicar no marcador
        />
      </MapView>
      <Button title="Logout" onPress={() => auth().signOut()} />
      {/* Botão de logout que desconecta o usuário ao ser pressionado */}
    </View>
  );
}
