import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db, auth } from './App'; // Certifique-se de exportar o auth do App.tsx

export default function ProductsScreen({ route, navigation }) {
  const { latitude, longitude } = route.params || {}; // Recebe a localização atual
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const currentUserId = auth.currentUser?.uid; // Obtém o ID do usuário logado
  const currentUserName = auth.currentUser?.displayName || 'Receptor'; // Nome do usuário logado

  const fetchUserName = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data().name; // Retorna o nome do usuário
      }
    } catch (error) {
      console.error('Erro ao buscar o nome do usuário:', error);
    }
    return 'Anônimo'; // Retorno padrão se não encontrar o usuário
  };

  useEffect(() => {
    if (!latitude || !longitude) {
      Alert.alert('Erro', 'Localização atual não fornecida.');
      navigation.goBack(); // Voltar para a tela anterior se não houver localização
      return;
    }

    console.log('Localização recebida:', { latitude, longitude }); // Log para depuração

    // Buscar doações do Firestore com status "disponível"
    const q = query(collection(db, 'donations'), where('status', '==', 'disponível'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedProducts = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const product = { id: doc.id, ...doc.data() };
          product.donorName = await fetchUserName(product.userId); // Adiciona o nome do doador ao produto
          return product;
        })
      );
      console.log('Produtos recuperados do Firestore:', fetchedProducts); // Log de depuração
      setProducts(fetchedProducts);
    });

    return () => unsubscribe();
  }, []);

  // Filtrar produtos no raio de 10 km e remover os do usuário logado
  useEffect(() => {
    const haversineDistance = (lat1, lon1, lat2, lon2) => {
      const toRad = (angle) => (angle * Math.PI) / 180;
      const R = 6371; // Raio da Terra em km
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distância em km
    };

    const filtered = products.filter((product) => {
      if (!product.latitude || !product.longitude) return false;
      const distance = haversineDistance(
        latitude,
        longitude,
        product.latitude,
        product.longitude
      );

      // Filtrar produtos no raio de 10 km e que não pertencem ao usuário logado
      return distance <= 10 && product.userId !== currentUserId;
    });

    console.log('Produtos filtrados:', filtered); // Log de depuração
    setFilteredProducts(filtered);
  }, [products, latitude, longitude, currentUserId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produtos Disponíveis (10 km)</Text>
      {filteredProducts.length === 0 ? (
        <Text style={styles.noProductsText}>Nenhum produto disponível no momento.</Text>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productItem}
              onPress={() => {
                const chatId = `${item.id}-${currentUserId}`; // Gera um chatId único
                console.log('Navegando para Chat:', {
                  chatId,
                  donorName: item.donorName,
                  receiverName: currentUserName,
                }); // Log para depuração
                navigation.navigate('Chat', {
                  chatId,
                  donorName: item.donorName,
                  receiverName: currentUserName,
                });
              }}
            >
              <Text style={styles.productName}>{item.nome}</Text>
              <Text style={styles.productDetails}>
                Quantidade: {item.quantidade} - Doador: {item.donorName}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  productItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productDetails: {
    fontSize: 14,
    color: '#555',
  },
  noProductsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});
