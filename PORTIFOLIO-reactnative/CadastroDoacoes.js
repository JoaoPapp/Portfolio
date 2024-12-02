import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Geolocation from '@react-native-community/geolocation';

export default function GerenciadorDeDoacoes() {
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [location, setLocation] = useState(null);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingList, setLoadingList] = useState(true);

    // Obtém as doações do Firestore
    const fetchDonations = async () => {
        try {
            setLoadingList(true);
            const snapshot = await firestore().collection('donations').get();
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDonations(data);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar as doações.');
        } finally {
            setLoadingList(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    // Obtém a localização do dispositivo
    const getLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
            },
            error => Alert.alert('Erro', 'Não foi possível obter a localização.'),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    };

    // Cadastra uma nova doação
    const handleSubmit = async () => {
        if (!itemName || !description || !quantity || !location) {
            Alert.alert('Erro', 'Preencha todos os campos e permita o acesso à localização.');
            return;
        }
        setLoading(true);
        try {
            await firestore().collection('donations').add({
                itemName,
                description,
                quantity,
                location,
                timestamp: firestore.FieldValue.serverTimestamp(),
            });
            Alert.alert('Sucesso', 'Doação cadastrada com sucesso!');
            setItemName('');
            setDescription('');
            setQuantity('');
            setLocation(null);
            fetchDonations(); // Atualiza a lista de doações
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível cadastrar a doação.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Formulário de Cadastro */}
            <Text style={styles.title}>Cadastrar Nova Doação</Text>
            <Text style={styles.label}>Nome do Item</Text>
            <TextInput 
                style={styles.input} 
                value={itemName} 
                onChangeText={setItemName} 
                placeholder="Digite o nome do alimento" 
            />
            <Text style={styles.label}>Descrição</Text>
            <TextInput 
                style={styles.input} 
                value={description} 
                onChangeText={setDescription} 
                placeholder="Descrição do alimento" 
            />
            <Text style={styles.label}>Quantidade</Text>
            <TextInput 
                style={styles.input} 
                value={quantity} 
                onChangeText={setQuantity} 
                placeholder="Quantidade disponível" 
                keyboardType="numeric" 
            />
            <Button title="Obter Localização" onPress={getLocation} />
            {loading ? (
                <Button title="Carregando..." disabled />
            ) : (
                <Button title="Cadastrar Doação" onPress={handleSubmit} />
            )}

            {/* Lista de Doações */}
            <Text style={styles.title}>Doações Registradas</Text>
            {loadingList ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={donations}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.donationItem}>
                            <Text style={styles.donationTitle}>{item.itemName}</Text>
                            <Text>{item.description}</Text>
                            <Text>Quantidade: {item.quantity}</Text>
                            <Text>Localização: {`Lat: ${item.location.latitude}, Lng: ${item.location.longitude}`}</Text>
                        </View>
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
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 12,
        padding: 8,
        borderRadius: 5,
    },
    donationItem: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    donationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
