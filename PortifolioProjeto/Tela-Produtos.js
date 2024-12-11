import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { collection, query, where, onSnapshot, getDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './App';

export default function ProductsScreen({ route, navigation }) {
  const { latitude, longitude } = route.params || {};
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const currentUserId = auth.currentUser?.uid;

  const fetchUserName = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data().name || 'Anônimo';
      }
    } catch (error) {
      console.error('Erro ao buscar o nome do doador:', error);
    }
    return 'Anônimo';
  };

  useEffect(() => {
    if (!latitude || !longitude) {
      Alert.alert('Erro', 'Localização atual não fornecida.');
      return;
    }

    const productsRef = collection(db, 'donations');
    const q = query(productsRef, where('status', '==', 'disponível'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedProducts = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const product = { id: doc.id, ...doc.data() };
          product.donorName = await fetchUserName(product.userId); // Obter nome do doador
          return product;
        })
      );
      setProducts(fetchedProducts);
    });

    return () => unsubscribe();
  }, []);

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
      return R * c;
    };

    const filtered = products.filter((product) => {
      if (!product.latitude || !product.longitude) return false;
      const distance = haversineDistance(
        latitude,
        longitude,
        product.latitude,
        product.longitude
      );

      return distance <= 10 && product.userId !== currentUserId;
    });

    setFilteredProducts(filtered);
  }, [products, latitude, longitude, currentUserId]);

  const handleProductClick = async (item) => {
    try {
      if (!item.userId || !currentUserId) {
        Alert.alert('Erro', 'Informações do usuário ou produto incompletas.');
        return;
      }

      const chatId = `${item.userId}_${currentUserId}_${item.id}`; // ID único para o chat

      // Referência ao chat no Firestore
      const chatDocRef = doc(db, 'chats', chatId);
      const chatDoc = await getDoc(chatDocRef);

      if (!chatDoc.exists()) {
        // Cria o chat no Firestore se não existir
        await setDoc(chatDocRef, {
          donorId: item.userId,
          receiverId: currentUserId,
          productId: item.id,
          productName: item.nome || 'Produto sem nome',
          status: 'pendente',
          createdAt: serverTimestamp(),
        });
      }

      // Navega para a tela de chat
      navigation.navigate('Chat', {
        chatId,
        donorId: item.userId,
        receiverId: currentUserId,
        productName: item.nome || 'Produto sem nome',
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir o chat.');
      console.error('Erro ao abrir o chat:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produtos Disponíveis</Text>
      {filteredProducts.length === 0 ? (
        <Text style={styles.noProductsText}>Nenhum produto disponível no momento.</Text>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productItem}
              onPress={() => handleProductClick(item)}
            >
              <Text style={styles.productName}>{item.nome || 'Produto sem nome'}</Text>
              <Text style={styles.productDetails}>
                Quantidade: {item.quantidade || 'Indisponível'} - Doador: {item.donorName || 'Anônimo'}
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
