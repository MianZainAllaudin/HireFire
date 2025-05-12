import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, SafeAreaView, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router/build/exports";
import { ThemedText } from "@/components/ThemedText";
import { LocationSearch } from "@/components/LocationSearch";
import { LocationMapModal } from "@/components/LocationMapModal";
import { MaterialIcons } from "@expo/vector-icons";
import { BASE_URL } from "@/config";
import { useAppContext } from "@/scripts/AppContext";

export default function WorkerPreferredLocationPgScreen() {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const {user, setUser} = useAppContext();

  const savePreferredLocation = async () => {
    try {
      const reqBody = {
        lat: parseFloat(selectedLocation.lat),
        lon: parseFloat(selectedLocation.lon)
      };

      const response = await fetch(BASE_URL + `api/workers/${user?.userId}/update_preferred_location`, {
        headers: {
          'Content-type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(reqBody)
      });

      if (!response.ok)
        throw "An error occured: HTTP " + response.status;
      
      const resJson = await response.json();
      
      if (!resJson.success)
        throw resJson.message
      
      Alert.alert("Success!", resJson.message);
    } catch (e) {
      console.log(e);
    }
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Title */}
        <ThemedText style={styles.headerTitle}>Set Preferred Location</ThemedText>
        
        {/* Location Search Component */}
        <View style={styles.searchContainer}>
          <LocationSearch 
            onLocationSelect={(location) => {
              setSelectedLocation(location);
              setShowMapModal(true);
            }} 
          />
        </View>

        {/* Selected Location Preview */}
        {selectedLocation && (
          <TouchableOpacity
            style={styles.selectedLocationContainer}
            onPress={() => setShowMapModal(true)}
          >
            <ThemedText style={styles.selectedLocationText}>
              {selectedLocation.display_name}
            </ThemedText>
            <MaterialIcons name="edit-location" size={24} color="#FF4D4D" />
          </TouchableOpacity>
        )}

        {/* Save Button */}
        {selectedLocation && (
          <TouchableOpacity onPress={savePreferredLocation} style={styles.saveButton}>
            <ThemedText style={styles.saveButtonText}>Save Location</ThemedText>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Map Modal */}
      <LocationMapModal
        visible={showMapModal}
        location={selectedLocation}
        onClose={() => setShowMapModal(false)}
      />
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
    justifyContent: 'center',
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 30,
  },
  searchContainer: {
    marginBottom: 20,
  },
  selectedLocationContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF4D4D',
  },
  selectedLocationText: {
    fontSize: 16,
    color: 'black',
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#FF4D4D',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});