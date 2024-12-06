import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { collection, getDocs } from 'firebase/firestore';
import * as Location from 'expo-location';
import { db } from './App';

export default function ReceberScreen() {
  const [location, setLocation] = useState(null);
  const [doacoes, setDoacoes] = useState([]);
  const [filteredDoacoes, setFilteredDoacoes] = useState([]);
  const [selectedAlimentos, setSelectedAlimentos] = useState([]);
  const [alimentosDisponiveis, setAlimentosDisponiveis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão Negada', 'Permissão de localização negada');
          setLoading(false);
          return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        const querySnapshotAlimentos = await getDocs(collection(db, 'alimentos'));
        const alimentos = [];
        querySnapshotAlimentos.forEach((doc) => {
          Object.keys(doc.data()).forEach((campo) => {
            alimentos.push(doc.data()[campo]);
          });
        });
        setAlimentosDisponiveis(alimentos);
      } catch (error) {
        Alert.alert('Erro', 'Erro ao obter dados: ' + error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleAlimentoSelection = (alimento) => {
    if (selectedAlimentos.includes(alimento)) {
      setSelectedAlimentos(selectedAlimentos.filter((item) => item !== alimento));
    } else {
      setSelectedAlimentos([...selectedAlimentos, alimento]);
    }
  };

  const filtrarDoacoes = () => {
    if (selectedAlimentos.length === 0) {
      Alert.alert('Erro', 'Por favor, selecione pelo menos um alimento.');
      return;
    }

    const nearbyDoacoes = doacoes.filter((doacao) => {
      const distance = haversineDistance(
        location.latitude,
        location.longitude,
        doacao.latitude,
        doacao.longitude
      );
      return distance <= 10 && selectedAlimentos.includes(doacao.nome);
    });

    if (nearbyDoacoes.length === 0) {
      Alert.alert('Nenhum Resultado', 'Não há doações próximas para os alimentos selecionados.');
    }

    setFilteredDoacoes(nearbyDoacoes);
  };

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doações Próximas</Text>
      {loading ? (
        <Text>Carregando dados...</Text>
      ) : (
        <>
          <Text style={styles.subtitle}>Escolha um ou mais alimentos:</Text>
          <FlatList
            data={alimentosDisponiveis}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.checkboxContainer}>
                <Text style={styles.checkboxLabel}>{item}</Text>
                <Button
                  title={selectedAlimentos.includes(item) ? 'Selecionado' : 'Selecionar'}
                  onPress={() => toggleAlimentoSelection(item)}
                  color={selectedAlimentos.includes(item) ? '#4CAF50' : '#2196F3'}
                />
              </View>
            )}
          />
          <Button title="Filtrar Doações" onPress={filtrarDoacoes} />
          {location && (
            <MapView
              style={styles.map}
              region={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
              showsUserLocation={true}
            >
              {filteredDoacoes.map((doacao) => (
                <Marker
                  key={doacao.id}
                  coordinate={{
                    latitude: doacao.latitude,
                    longitude: doacao.longitude,
                  }}
                  title={doacao.nome}
                  description={doacao.descricao}
                />
              ))}
            </MapView>
          )}
          <FlatList
            data={filteredDoacoes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemTitle}>{item.nome}</Text>
                <Text>{item.descricao}</Text>
              </View>
            )}
          />
        </>
      )}
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
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  map: {
    width: '100%',
    height: '50%',
    marginBottom: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
