//potato
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router/build/exports';
import firebaseDb from '@/firebase'
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, getDocs, doc, setDoc } from "firebase/firestore";
import { useAppContext } from '@/scripts/AppContext';
import React from 'react';

type Message = {
  id: string;
  text: string;
  sender: 'client' | 'worker';
};

export default function ChatScreen() {
  const router = useRouter();
  const {
    clientName,
    clientId,
    workerName,
    workerId,
    role
  } = useLocalSearchParams<{
    clientName: string,
    clientId: string,
    workerName: string,
    workerId: string,
    role: 'client' | 'worker'
  }>();
  
  const [messages, setMessages] = useState<Message[]>([
    // { id: '1', text: 'Hello, how can I help you?', sender: 'client' },
    // { id: '2', text: 'I need help with plumbing at my house.', sender: 'worker' },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [messagesLoading, setMessagesLoading] = useState(true);


  const addMessage = (message: Message) => {
    setMessages([
      ...messages,
      message,
    ]);
  }
  
  const handleSendMessage = async () => {
    const chatId = `chat-${workerId}`;

    try {
      if (newMessage.trim()) {
        setNewMessage('');
        await addDoc(collection(firebaseDb, chatId), {
          role,
          author: role === 'client' ? clientName : workerName,
          userId: role === 'client' ? clientId : workerId,
          message: newMessage,
          createdAt: serverTimestamp(),
        });
        await setDoc(doc(firebaseDb, "chats", chatId), {
          workerId,
          clientId,
          workerName,
          clientName,
          lastMessage: newMessage,
          updatedAt: serverTimestamp(),
        }, { merge: true }); // Merge ensures existing fields are not lost
  
        // addMessage({ 
        //   id: String(messages.length + 1), 
        //   text: newMessage, 
        //   sender: role
        // });
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!clientId || !workerId) return;
  
    const chatId = `chat-${workerId}`;
    const chatRef = collection(firebaseDb, chatId);
    const q = query(chatRef, orderBy('createdAt', 'asc'));
  
    const setupChat = async () => {
      // Initial one-time fetch
      try {
        const snapshot = await getDocs(q);
        const initialMessages: Message[] = [];
  
        snapshot.forEach((doc: { data: () => any; id: any; }) => {
          const data = doc.data();
          const senderId = data.userId;
  
          if (senderId === clientId || senderId === workerId) {
            initialMessages.push({
              id: doc.id,
              text: data.message,
              sender: data.role,
            });
          }
        });
  
        setMessages(initialMessages);
        setMessagesLoading(false);
      } catch (error) {
        console.error('Error fetching initial messages:', error);
      }
  
      // Then listen for new messages
      const unsubscribe = onSnapshot(q, (snapshot: { docChanges: () => any[]; }) => {
        snapshot.docChanges().forEach((change) => {
          const data = change.doc.data();
          const senderId = data.userId;
  
          if (change.type === 'added' && (senderId === clientId || senderId === workerId)) {
            const newMsg: Message = {
              id: change.doc.id,
              text: data.message,
              sender: data.role,
            };
  
            setMessages((prev) => {
              const exists = prev.some((msg) => msg.id === newMsg.id);
              return exists ? prev : [...prev, newMsg];
            });
          }
        });
      });
  
      return unsubscribe;
    };
  
    let unsubscribeListener: (() => void) | undefined;
  
    setupChat().then((unsubscribe) => {
      unsubscribeListener = unsubscribe;
    });
  
    return () => {
      if (unsubscribeListener) {
        unsubscribeListener();
      }
    };
  }, [clientId, workerId]);
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{role === 'worker' ? clientName : workerName} - {role === 'worker' ? clientId : workerId}</Text>
      </View>

      {/* Chat Messages */}
      <ScrollView 
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContentContainer}
      >
        {messagesLoading && <Text>Loading...</Text>}
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.sender === role ? styles.outgoingMessage : styles.incomingMessage,
            ]}
          >
            <Text style={[
              styles.messageText,
              message.sender === role ? styles.outgoingText : styles.incomingText
            ]}>
              {message.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Input Field */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          value={newMessage}
          onChangeText={setNewMessage}
          onSubmitEditing={handleSendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity 
          onPress={handleSendMessage} 
          style={styles.sendButton}
          disabled={!newMessage.trim()}
        >
          <Feather name="send" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1A0D0E', // Keeping the dark header
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    marginLeft: 16,
    fontWeight: '600',
  },
  chatContainer: {
    flex: 1,
  },
  chatContentContainer: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    marginBottom: 10,
    padding: 12,
    borderRadius: 10,
  },
  outgoingMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF4D4D', // Changed to red (#FF4D4D)
  },
  incomingMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0E0E0',
  },
  messageText: {
    fontSize: 16,
  },
  outgoingText: {
    color: '#FFFFFF',
  },
  incomingText: {
    color: '#333333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    marginLeft: 8,
    backgroundColor: '#FF4D4D', // Changed to red (#FF4D4D)
    borderRadius: 50,
  },
});