import React from "react";
import { StyleSheet, View, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { useRouter } from "expo-router/build/exports";
import { ThemedText } from "@/components/ThemedText";
import { MaterialCommunityIcons, FontAwesome6, Feather } from "@expo/vector-icons";

export default function homePageWorkerScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Pending Requests Button */}
        <TouchableOpacity
          style={styles.gridButton}
          onPress={() => router.push("/appointmentsPg")}
        >
          <MaterialCommunityIcons name="clock-outline" size={40} color="#FF4D4D" />
          <ThemedText style={styles.buttonText}>Pending Requests</ThemedText>
        </TouchableOpacity>

        {/* Accepted Requests Button */}
        <TouchableOpacity
          style={styles.gridButton}
          onPress={() => router.push("/myClientsPg")}
        >
          <FontAwesome6 name="clipboard-check" size={40} color="#FF4D4D" />
          <ThemedText style={styles.buttonText}>Accepted Requests</ThemedText>
        </TouchableOpacity>

        {/* Change Availability Button */}
        <TouchableOpacity
          style={styles.gridButton}
          onPress={() => router.push("/workerAvailabilityPg")}
        >
          <Feather name="calendar" size={40} color="#FF4D4D" />
          <ThemedText style={styles.buttonText}>Change Availability</ThemedText>
        </TouchableOpacity>

        {/* Preferred Location Button */}
        <TouchableOpacity
          style={styles.gridButton}
          onPress={() => router.push("/workerPreferredLocationPg")}
        >
          <MaterialCommunityIcons name="map-marker-radius" size={40} color="#FF4D4D" />
          <ThemedText style={styles.buttonText}>Preferred Location</ThemedText>
        </TouchableOpacity>
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
    alignItems: 'center', // This centers items horizontally
  },
  gridButton: {
    width: "80%", // Reduced from 100% to make buttons smaller
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