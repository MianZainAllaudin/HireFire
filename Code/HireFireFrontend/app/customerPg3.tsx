import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import usersData from "@/assets/data/exampleUsers.json";
import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router/build/exports";

export default function CustomerPg3Screen() {
  const router = useRouter();
  const { userId, paramUser } = useLocalSearchParams();
  const user = usersData.find((u) => u.id === Number(userId)) || JSON.parse(paramUser);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: "black", padding: 20 }}>User not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <View style={styles.card}>
          <Image source={{ uri: user.image }} style={styles.avatar} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.fee}>{user.fee}</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email}</Text>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{user.phone}</Text>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{user.address}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              router.push({
                pathname: "/customerPg4",
                params: { userId: (user.id || user.userId).toString() },
              })
            }
          >
            <Text style={styles.buttonText}>Send Hire Request</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => router.back()}
          >
            <Text style={styles.outlineButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F0F0",
  },

  contentContainer: {
    flex: 1,
    backgroundColor: "#F5F0F0",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A0D0E",
    textAlign: "center",
    marginBottom: 8,
  },
  fee: {
    fontSize: 16,
    color: "#FF4D4D",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  value: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  button: {
    marginTop: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#FF4D4D",
    alignItems: "center",
    borderColor: "#FF4D4D",
  },
  buttonText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  outlineButton: {
    marginTop: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "white",
    alignItems: "center",
    borderColor: "#FF4D4D",
  },
  outlineButtonText: {
    fontSize: 16,
    color: "#FF4D4D",
  },
});
