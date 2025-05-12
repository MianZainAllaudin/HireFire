// customerPg.tsx
import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router/build/exports';

import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'react-native';
import { DateTimePicker } from '@/components/DateTimePicker';


import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function CustomerPgCScreen() {
  const router = useRouter();
  const initialDate = new Date();
  initialDate.setHours(initialDate.getHours() - 19);
  initialDate.setDate(initialDate.getDate() + 1);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  // Add state for selected category
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  // Function to handle category selection
  const handleCategorySelect = (index: number) => {
    setSelectedCategory(index);
  };
  
  // Function to navigate to the next page
  const handleNextPress = () => {
    console.log("Navigating to next page with:", {
      date: selectedDate
    });
    
    // Navigate to the next page with params (replace with your actual route)
    router.push({
      pathname: '/customerPg2C',
      // You can pass params if your router supports it
      // params: { category: selectedCategoryData.label, date: selectedDate.toISOString() }
    });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.contentContainer}>

        {/* DateTime */}
        <ThemedText style={styles.DTLabel}>Select Date and Time</ThemedText>
        <DateTimePicker 
          initialDate={selectedDate}
          onDateChange={date => {
          // Create a new date with adjusted time (subtract 19 hours)
          const adjustedDate = new Date(date);
          adjustedDate.setHours(date.getHours() - 19);
          adjustedDate.setDate(date.getDate() + 1);
    
          setSelectedDate(adjustedDate);
          console.log("Selected date and time (adjusted):", adjustedDate);
        }}
      />

    </ScrollView>
      
      {/* Next Button - Only shown when a category is selected */}
        <View style={styles.nextButtonContainer}>
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={handleNextPress}
          >
            <ThemedText style={styles.nextButtonText}>Look For Consultants</ThemedText>
            <Feather name="arrow-right" size={20} color="#FFFFFF" style={styles.nextButtonIcon} />
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D1D1D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 38,
    backgroundColor: '#1A0D0E',
    position: 'relative',
  },
  
  leftContainer: {
    width: 70,
    paddingTop: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  
  centerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  rightContainer: {
    width: 70,
    paddingTop: 20,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  logoImage: {
    width: 120,
    height: 60,
  },
  contentHeader: {
    backgroundColor: '#F5F0F0',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  contentHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F5F0F0',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80, // Add padding at bottom for the next button
  },
  categoriesContainer: {
    backgroundColor: '#F5F0F0',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionTitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '45%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCategoryCard: {
    backgroundColor: '#FF4D4D',
    borderWidth: 2,
    borderColor: '#FF4D4D',
  },
  categoryLabel: {
    marginTop: 8,
    color: '#333333',
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 18,
    backgroundColor: '#1A0D0E',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F0F0',
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
    color: '#333333',
  },
  dateTimeContainer: {
    backgroundColor: '#F5F0F0',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  DTLabel: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  nextButtonContainer: {
    position: 'absolute',
    bottom: '40%', // This will position it at the middle vertically
    left: 0,
    right: 0,
    backgroundColor: '#F5F0F0',
    paddingHorizontal: 20,
    paddingVertical: 15,
    transform: [{ translateY: 50 }], // This will adjust for half the height of the container
  },
  nextButton: {
    backgroundColor: '#FF4D4D',
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    height: 60,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nextButtonIcon: {
    marginLeft: 8,
  },
});