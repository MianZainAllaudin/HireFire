import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { useRouter } from "expo-router/build/exports";
import { ThemedText } from "@/components/ThemedText";
import { DateTimePicker } from "@/components/DateTimePicker";

export default function WorkerAvailabilityScreen() {
  const [fromTime, setFromTime] = useState(new Date());
  const [toTime, setToTime] = useState(new Date(new Date().setHours(new Date().getHours() + 1)));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* From Time Picker */}
        <View style={styles.timeSection}>
          <ThemedText style={styles.timeLabel}>From</ThemedText>
          <View style={styles.pickerWrapper}>
            <DateTimePicker 
              initialDate={fromTime}
              onDateChange={(date) => setFromTime(date)}
            />
          </View>
        </View>

        {/* To Time Picker */}
        <View style={styles.timeSection}>
          <ThemedText style={styles.timeLabel}>To</ThemedText>
          <View style={styles.pickerWrapper}>
            <DateTimePicker 
              initialDate={toTime}
              onDateChange={(date) => setToTime(date)}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton}>
          <ThemedText style={styles.saveButtonText}>Save Availability</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1D1D1D",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  timeSection: {
    backgroundColor: "#F5F0F0",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  timeLabel: {
    color: "#FF4D4D",
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  pickerWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: "#FF4D4D",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: 'bold',
  },
});