import React, { useState, useEffect } from 'react';
import {View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet,} from 'react-native';
import { collection, doc, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './App'; // Firestore inicializado no App.tsx

export default function ChatScreen({ route }) {
  const { chatId, donorName, receiverName } = route.params; // Parâmetros passados para a tela
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuta em tempo real as mensagens do Firestore
    const unsubscribe = onSnapshot(
      doc(db, 'chats', chatId),
      (snapshot) => {
        if (snapshot.exists()) {
          setMessages(snapshot.data().messages || []);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Erro ao carregar mensagens: ', error);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Limpar listener quando o componente desmonta
  }, [chatId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const chatRef = doc(db, 'chats', chatId);

      // Adiciona a nova mensagem no Firestore
      await addDoc(collection(chatRef, 'messages'), {
        sender: receiverName, // Nome do remetente
        text: newMessage,
        timestamp: serverTimestamp(),
      });

      setNewMessage(''); // Limpar campo de entrada
    } catch (error) {
      console.error('Erro ao enviar mensagem: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat entre {donorName} e {receiverName}</Text>
      {loading ? (
        <Text>Carregando mensagens...</Text>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.message,
                item.sender === receiverName ? styles.receiver : styles.sender,
              ]}
            >
              <Text style={styles.senderName}>{item.sender}</Text>
              <Text>{item.text}</Text>
            </View>
          )}
          contentContainerStyle={styles.messagesContainer}
        />
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  messagesContainer: {
    flexGrow: 1,
  },
  message: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '70%',
  },
  sender: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  receiver: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
