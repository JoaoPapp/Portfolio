import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { auth, db } from './App'; // Certifique-se de exportar o `auth` do App.tsx

export default function ChatScreen({ route }) {
  const { chatId, donorName, receiverName } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const currentUser = auth.currentUser;

  // Obter nome do remetente a partir do ID do usuário
  const fetchUserName = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data().name || 'Anônimo';
      }
    } catch (error) {
      console.error('Erro ao buscar o nome do usuário:', error);
    }
    return 'Anônimo';
  };

  // Escutar mensagens em tempo real
  useEffect(() => {
    if (!chatId) {
      Alert.alert('Erro', 'ID do chat não fornecido.');
      return;
    }

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc')); // Ordenar por data/hora
    const unsubscribe = onSnapshot(messagesQuery, async (snapshot) => {
      const loadedMessages = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const message = doc.data();
          message.senderName = await fetchUserName(message.senderId); // Buscar nome do remetente
          return { id: doc.id, ...message };
        })
      );
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, [chatId]);

  // Enviar mensagem
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesRef, {
        senderId: currentUser.uid, // Identifica o ID do remetente
        text: newMessage,
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      Alert.alert('Erro', 'Não foi possível enviar a mensagem.');
    }
  };

  if (!chatId || !donorName || !receiverName) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro: Informações do chat estão incompletas.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Mensagem de Segurança */}
      <View style={styles.safetyMessageContainer}>
        <Text style={styles.safetyMessageText}>
          Para sua segurança, o ShareFood recomenda que tanto o doador quanto o receptor se encontrem
          em locais públicos, como supermercados, postos de gasolina e praças, preferencialmente
          durante o dia. Além disso, evitem divulgar informações pessoais, como endereço e número de
          telefone.
        </Text>
      </View>

      <Text style={styles.title}>
        Chat entre {donorName} e {receiverName}
      </Text>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.senderId === currentUser.uid ? styles.sender : styles.receiver,
            ]}
          >
            <Text style={styles.senderName}>{item.senderName}</Text>
            <Text>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
      />

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
  safetyMessageContainer: {
    backgroundColor: '#FFCC00',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  safetyMessageText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
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
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});
