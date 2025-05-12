//potato
import { useState } from "react";
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
import { useAppContext } from "@/scripts/AppContext";
import { useRouter } from "expo-router/build/exports";
import React from "react";

export default function MyClientsScreen() {
  const router = useRouter();
  const [clients, setClients] = useState([
    { id: "1", name: "Emily Johnson" },
    { id: "2", name: "Daniel Smith" },
    { id: "3", name: "Sophia Williams" },
  ]);

  const {user, setUser} = useAppContext();

  const handleBackPress = () => {
    router.back();
  };

  const handleMessagePress = (clientName: string, clientId: string) => {
    router.push({
      pathname: "/chatPg",
      params: { clientName, clientId, workerName: user?.name, workerId: user?.userId, role: 'worker' },
    });
  };

  return (
    <ThemedView style={styles.container}>
      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>My Clients</Text>

        {clients.map((client) => (
          <View key={client.id} style={styles.clientCard}>
            <Text style={styles.clientName}>{client.name}</Text>
            <TouchableOpacity onPress={() => handleMessagePress(client.name, client.id)}>
              <Feather name="message-square" size={24} color="#F44336" />
            </TouchableOpacity>
          </View>
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
    justifyContent: "space-between",
  },
  clientName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
  },
});
