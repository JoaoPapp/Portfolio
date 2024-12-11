import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { collection, doc, updateDoc, deleteDoc, onSnapshot, addDoc, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './App';

export default function ChatScreen({ route, navigation }) {
  const { donorId, receiverId, productName, productId } = route.params || {};
  const [chatId, setChatId] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatStatus, setChatStatus] = useState('pendente'); // pendente, entregue, concluído
  const currentUser = auth.currentUser;

  // Debug: Verificar os parâmetros recebidos
  console.log('Parâmetros recebidos:', route.params);

  useEffect(() => {
    // Verificar se os parâmetros obrigatórios estão definidos
    if (!donorId || !receiverId || !productId) {
      Alert.alert(
        'Erro',
        'Informações insuficientes para iniciar o chat. Certifique-se de que todos os parâmetros foram passados corretamente.'
      );
      navigation.goBack();
      return;
    }

    // Gerar o chatId com base nos parâmetros
    const generatedChatId = `${donorId}_${receiverId}_${productId}`;
    setChatId(generatedChatId);

    const createChatIfNotExists = async () => {
      try {
        const chatRef = doc(db, 'chats', generatedChatId);
        const chatDoc = await getDoc(chatRef);

        if (!chatDoc.exists()) {
          await setDoc(chatRef, {
            donorId,
            receiverId,
            productName: productName || 'Produto não especificado',
            productId,
            status: 'pendente',
            createdAt: serverTimestamp(),
          });
        } else {
          setChatStatus(chatDoc.data().status || 'pendente');
        }
      } catch (error) {
        console.error('Erro ao criar/verificar o chat:', error);
        Alert.alert('Erro', 'Erro ao criar ou acessar o chat.');
      }
    };

    createChatIfNotExists();
  }, [donorId, receiverId, productId, productName, navigation]);

  useEffect(() => {
    if (!chatId) return;

    // Listener para mensagens do chat
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const unsubscribeMessages = onSnapshot(messagesRef, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(loadedMessages);
    });

    // Listener para o status do chat
    const chatRef = doc(db, 'chats', chatId);
    const unsubscribeChat = onSnapshot(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        setChatStatus(snapshot.data().status || 'pendente');
      }
    });

    return () => {
      unsubscribeMessages();
      unsubscribeChat();
    };
  }, [chatId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesRef, {
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'Usuário',
        text: newMessage,
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      Alert.alert('Erro', 'Não foi possível enviar a mensagem.');
    }
  };

  const handleConfirmDelivery = async () => {
    try {
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, { status: 'entregue' });
      Alert.alert('Confirmação', 'Você confirmou a entrega do produto.');
    } catch (error) {
      console.error('Erro ao confirmar entrega:', error);
      Alert.alert('Erro', 'Erro ao confirmar a entrega.');
    }
  };

  const handleConfirmReceipt = async () => {
    try {
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, { status: 'concluído' });
      Alert.alert('Confirmação', 'Você confirmou o recebimento do produto.');

      // Apagar o chat automaticamente
      await deleteDoc(chatRef);
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao confirmar recebimento:', error);
      Alert.alert('Erro', 'Erro ao confirmar o recebimento.');
    }
  };

  if (!chatId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro: O chat não foi encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.productName}>Chat sobre: {productName || 'Produto não especificado'}</Text>

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

      {currentUser.uid === donorId && chatStatus === 'pendente' && (
        <TouchableOpacity style={styles.actionButton} onPress={handleConfirmDelivery}>
          <Text style={styles.actionButtonText}>Confirmar Entrega</Text>
        </TouchableOpacity>
      )}

      {currentUser.uid === receiverId && chatStatus === 'entregue' && (
        <TouchableOpacity style={styles.actionButton} onPress={handleConfirmReceipt}>
          <Text style={styles.actionButtonText}>Confirmar Recebimento</Text>
        </TouchableOpacity>
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
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
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
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 10,
  },
  sendButton: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  actionButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
