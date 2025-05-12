import React from "react";
import { StyleSheet, View, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { useRouter } from "expo-router/build/exports";
import { ThemedText } from "@/components/ThemedText";
import { MaterialCommunityIcons, FontAwesome6, Feather, FontAwesome } from "@expo/vector-icons";

export default function homePageCustomerScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Hire a Worker Button */}
        <TouchableOpacity
          style={styles.gridButton}
          onPress={() => router.push("/customerPg")}
        >
          <FontAwesome name="user-circle" size={40} color="#FF4D4D" />
          <ThemedText style={styles.buttonText}>Hire a Worker</ThemedText>
        </TouchableOpacity>

        {/* Hire a Consultant Button */}
        <TouchableOpacity
          style={styles.gridButton}
          onPress={() => router.push("/customerPgC")}
        >
          <FontAwesome6 name="user-tie" size={40} color="#FF4D4D" />
          <ThemedText style={styles.buttonText}>Hire a Consultant</ThemedText>
        </TouchableOpacity>

        {/* Pending Requests Button */}
        <TouchableOpacity
          style={styles.gridButton}
          onPress={() => router.push("/customerPendingRequests")}
        >
          <MaterialCommunityIcons name="clock-outline" size={40} color="#FF4D4D" />
          <ThemedText style={styles.buttonText}>Pending Requests</ThemedText>
        </TouchableOpacity>

        {/* My Bookings Button */}
        {/* <TouchableOpacity
          style={styles.gridButton}
          onPress={() => router.push("/myBookingsPg")}
        >
          <FontAwesome6 name="book" size={40} color="#FF4D4D" />
          <ThemedText style={styles.buttonText}>My Bookings</ThemedText>
        </TouchableOpacity> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F0F0",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    gap: 20,
    alignItems: 'center',
  },
  gridButton: {
    width: "80%",
    aspectRatio: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#333333",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 12,
  },
});