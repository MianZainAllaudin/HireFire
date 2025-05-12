// customerPg.tsx
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router/build/exports";

import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { Image } from "react-native";
import { DateTimePicker } from "@/components/DateTimePicker";
import { LocationSearch } from '@/components/LocationSearch';
import { LocationMapModal } from '@/components/LocationMapModal';

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import LoadingModal from "@/components/LoadingModal";
import axios from "axios";
import { BASE_URL } from "@/config";

const categories = [
  { icon: "zap", label: "Electrician", lib: "Feather" },
  { icon: "tool", label: "Mechanic", lib: "Feather" },
  { icon: "faucet-drip", label: "Plumber", lib: "FA" },
  { icon: "table-furniture", label: "Carpenter", lib: "Material" },
  { icon: "format-paint", label: "Painter", lib: "Material" },
  { icon: "account-hard-hat", label: "Labourer", lib: "Material" },
  { icon: "broom", label: "Janitor", lib: "FA" },
  { icon: "leaf", label: "Gardener", lib: "Material" },
  { icon: "utensils", label: "Cook", lib: "FA" },
  { icon: "wall", label: "Mason", lib: "Material" },
  { icon: "human-baby-changing-table", label: "Baby Sitter", lib: "Material" },
  { icon: "radiator", label: "Gas Fitter", lib: "Material" },
];

export default function CustomerPgScreen() {
  const router = useRouter();
  const initialDate = new Date();
  initialDate.setHours(initialDate.getHours() - 19);
  initialDate.setDate(initialDate.getDate() + 1);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  // Add state for selected category
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [loadingWorkers, setLoadingWorkers] = useState(false);

  // Function to handle category selection
  const handleCategorySelect = (index: number) => {
    setSelectedCategory(index);
    
  };

  // Function to navigate to the next page
  const handleNextPress = async () => {
    setLoadingWorkers(true);
    const selectedCategoryData = categories[selectedCategory!];
    console.log("Navigating to next page with:", {
      category: selectedCategoryData,
      date: selectedDate,
      location: selectedLocation.display_name,
      lat: selectedLocation.lat,
      lon: selectedLocation.lon
    });

    const requestBody = {
      location: {
        lat: selectedLocation.lat,
        lon: selectedLocation.lon  
      },
      dateTime: selectedDate.getHours() + ":" + selectedDate.getMinutes(),
      category: categories[selectedCategory || 0].label
    }

    try {
      console.log(requestBody);
      const response = await axios.post(BASE_URL + 'api/worker/lookup', requestBody);
      if (!response.data.success)
        throw response.data;

      router.push({
        pathname: "/customerPg2",
        params: {result: JSON.stringify(response.data.result)}
      });
      console.log(response.data.result);
    } catch (error: any) {
        Alert.alert(error.message);
    }
    setLoadingWorkers(false);
  };

  return (
    <SafeAreaView style={styles.container}>
        {loadingWorkers && <LoadingModal />}
         {/* Location Search */}
         <LocationSearch
          onLocationSelect={(location) => {
            setSelectedLocation(location);
            setShowMapModal(true);
          }}
        />

        {/* Selected Location Preview */}
        {selectedLocation && (
          <TouchableOpacity
            style={styles.selectedLocation}
            onPress={() => setShowMapModal(true)}
          >
            <ThemedText>{selectedLocation.display_name}</ThemedText>
            <Feather name="map-pin" size={16} color="#FF4D4D" />
          </TouchableOpacity>
        )}

      <ScrollView style={styles.contentContainer}>
        {/* DateTime */}
        <ThemedText style={styles.DTLabel}>Select Date and Time</ThemedText>
        <DateTimePicker
          initialDate={selectedDate}
          onDateChange={(date) => {
            setSelectedDate(date); return;
            
            // Create a new date with adjusted time (subtract 19 hours)
            const adjustedDate = new Date(date);
            adjustedDate.setHours(date.getHours() - 19);
            adjustedDate.setDate(date.getDate() + 1);

            setSelectedDate(adjustedDate);
            console.log("Selected date and time (adjusted):", adjustedDate);
          }}
        />

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ThemedText style={styles.sectionTitle}>Select Category</ThemedText>
          <View style={styles.gridContainer}>
            {categories.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryCard,
                  selectedCategory === index ? styles.selectedCategoryCard : {},
                ]}
                onPress={() => handleCategorySelect(index)}
              >
                {item.lib === "Feather" && (
                  <Feather
                    name={item.icon as any}
                    size={24}
                    color={selectedCategory === index ? "#FFFFFF" : "#FF4D4D"}
                  />
                )}
                {item.lib === "Material" && (
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={24}
                    color={selectedCategory === index ? "#FFFFFF" : "#FF4D4D"}
                  />
                )}
                {item.lib === "FA" && (
                  <FontAwesome6
                    name={item.icon as any}
                    size={24}
                    color={selectedCategory === index ? "#FFFFFF" : "#FF4D4D"}
                  />
                )}
                <ThemedText
                  style={[
                    styles.categoryLabel,
                    selectedCategory === index
                      ? styles.selectedCategoryText
                      : {},
                  ]}
                >
                  {item.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>


      {/* Map Modal */}
      <LocationMapModal
        visible={showMapModal}
        location={selectedLocation}
        onClose={() => setShowMapModal(false)}
      />

      {/* Next Button */}
      {selectedCategory !== null && selectedLocation && (
        <View style={styles.nextButtonContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
            <ThemedText style={styles.nextButtonText}>Next</ThemedText>
            <Feather name="arrow-right" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1D1D1D",
  },

  contentContainer: {
    flex: 1,
    backgroundColor: "#F5F0F0",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80, // Add padding at bottom for the next button
  },
  categoriesContainer: {
    backgroundColor: "#F5F0F0",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionTitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 12,
    textAlign: "center",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "45%",
    aspectRatio: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCategoryCard: {
    backgroundColor: "#FF4D4D",
    borderWidth: 2,
    borderColor: "#FF4D4D",
  },
  categoryLabel: {
    marginTop: 8,
    color: "#333333",
    fontWeight: "500",
    fontSize: 16,
    textAlign: "center",
  },
  selectedCategoryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 18,
    backgroundColor: "#1A0D0E",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F0F0",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
  },
  dateTimeContainer: {
    backgroundColor: "#F5F0F0",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  DTLabel: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 12,
    textAlign: "center",
  },
  nextButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#F5F0F0",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  nextButton: {
    backgroundColor: "#FF4D4D",
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  nextButtonIcon: {
    marginLeft: 8,
  },
  selectedLocation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
});
