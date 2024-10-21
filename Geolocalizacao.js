import React, { useEffect, useState } from 'react';
import { View, Button, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import auth from '@react-native-firebase/auth';

export default function HomeScreen() {
  const [location, setLocation] = useState(null); // Inicia sem localização
  const [loading, setLoading] = useState(true);   // Exibe loading inicialmente

  useEffect(() => {
    // Obtém a localização do usuário
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 });
        setLoading(false); // Desativa o loading após obter a localização
      },
      error => {
        setLoading(false);
        Alert.alert('Erro', 'Não foi possível obter sua localização.');
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, []);

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => Alert.alert('Você saiu com sucesso!'))
      .catch(error => Alert.alert('Erro', error.message));
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={location} showsUserLocation={true}>
        <Marker coordinate={location} title="Você está aqui" />
      </MapView>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
