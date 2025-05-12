//potato
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { useAppContext } from "@/scripts/AppContext";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import firebaseDb from "@/firebase";
import React from "react";

export default function MyClientsScreen() {
  const router = useRouter();
  const [chatsLoading, setChatsLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const {user, setUser} = useAppContext();

  const handleBackPress = () => {
    router.back();
  };

  const handleMessagePress = (clientName: string, clientId: string) => {
    const params = (user?.role == 'worker') ? {
      clientName,
      clientId,
      workerName: user?.name,
      workerId: user?.userId,
      role: user?.role
    } : {
      clientName: user?.name,
      clientId: user?.userId,
      workerName: clientName,
      workerId: clientId,
      role: user?.role
    };

    console.log(params);
    
    router.push({
      pathname: "/chatPg",
      params,
    });
  };

  // useEffect(() => {
  //   const loadChats = async () => {
  //     if (!user) return;
  
  //     setChatsLoading(true);
  
  //     try {
  //       const chatMap = new Map(); // to deduplicate chats by other user ID
  
  //       if (user.role === "worker") {
  //         const chatId = `chat-${user.userId}`;
  //         const chatRef = collection(firebaseDb, chatId);
  //         const q = query(chatRef, orderBy("createdAt", "desc"));
  //         const snapshot = await getDocs(q);
  
  //         snapshot.forEach((doc) => {
  //           const data = doc.data();
  //           if (data.role === "client") {
  //             const clientId = data.userId;
  //             if (!chatMap.has(clientId)) {
  //               chatMap.set(clientId, {
  //                 userId: clientId,
  //                 name: data.author,
  //               });
  //             }
  //           }
  //         });
  
  //       } else if (user.role === "client") {
          
  //       }
  //     } catch (error) {
  //       console.error("Error loading chats:", error);
  //     } finally {
  //       setChatsLoading(false);
  //     }
  //   }
  
  //   loadChats();
  // }, [user]);


  useEffect(() => {
    const loadChats = async () => {
      if (!user || !user.userId || !user.role) return;
  
      setChatsLoading(true);
      const chatMetadataRef = collection(firebaseDb, "chats");
      const chatsQuery = query(chatMetadataRef, orderBy("updatedAt", "desc")); // 👈 order by timestamp
  
      try {
        const snapshot = await getDocs(chatsQuery);
        const filteredChats: any[] = [];
  
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const { clientId, clientName, workerId, workerName, lastMessage } = data;
  
          if (user.role === "worker" && workerId == user.userId) {
            filteredChats.push({
              userId: clientId,
              name: clientName || "Client",
              lastMessage,
            });
          } else if (user.role === "client" && clientId == user.userId) {
            filteredChats.push({
              userId: workerId,
              name: workerName || "Worker",
              lastMessage,
            });
          }
        });
  
        setChats(filteredChats);
      } catch (err) {
        console.error("Failed to load chats:", err);
      } finally {
        setChatsLoading(false);
      }
    };
  
    loadChats();
  }, [user]);
  
  
  return (
    <ThemedView style={styles.container}>
      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Chats</Text>

        {chatsLoading && <Text>Loading chats</Text>}
        {chats.map((chat) => (
          <TouchableOpacity key={chat.userId} onPress={() => handleMessagePress(chat.name, chat.userId)}>
            <View style={styles.clientCard}>
                <Feather name="user" size={36} color="#F44336" />
                <View>
                  <Text style={styles.clientName}>{chat.name}</Text>
                  <Text style={styles.lastMessage}>{chat.lastMessage}</Text>
                </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1D1D1D",
  },

  content: {
    flexGrow: 1,
    backgroundColor: "#F5F0F0",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 20,
    textAlign: "center",
  },
  clientCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 12,
  },
  clientName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
  },
  lastMessage: {
    fontSize: 12
  }
});
