import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router/build/exports";

type ReportReason = "misconduct" | "confusing" | "overcharge" | "other" | null;

const ReportScreen: React.FC = () => {
  const [selectedReason, setSelectedReason] = useState<ReportReason>(null);
  const [details, setDetails] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (): void => {
    console.log("Report submitted:", {
      reason: selectedReason,
      details: selectedReason === "other" ? details : null,
    });
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      router.back(); // go back using Expo Router
    }, 2000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity>
            <Text style={styles.title}>Report</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/ReviewPg")}>
            <Text style={styles.cancelText}>cancel</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.question}>What do you wish to report?</Text>

        <View style={styles.optionsContainer}>
          {[
            { key: "misconduct", label: "Misconduct from customer/worker" },
            { key: "confusing", label: "App was confusing" },
            {
              key: "overcharge",
              label: "App deducted money more than the price",
            },
            { key: "other", label: "Other" },
          ].map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.optionButton,
                selectedReason === key && styles.selectedOption,
              ]}
              onPress={() => setSelectedReason(key as ReportReason)}
            >
              <Text style={styles.optionText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedReason === "other" && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsLabel}>Provide details</Text>
            <TextInput
              style={styles.detailsInput}
              multiline
              numberOfLines={4}
              placeholder="Please describe your issue..."
              placeholderTextColor="#999"
              value={details}
              onChangeText={setDetails}
              textAlignVertical="top"
            />
          </View>
        )}

        {isSubmitted ? (
          <Text style={styles.successMessage}>Thank you for your report!</Text>
        ) : (
          <TouchableOpacity
            style={[
              styles.submitButton,
              !selectedReason && styles.disabledButton,
              selectedReason === "other" && !details && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={
              !selectedReason || (selectedReason === "other" && !details)
            }
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EDEE",
  },
  innerContainer: {
    padding: 20,
    flexGrow: 1,
  },
  question: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#E45959",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#FFFF",
  },
  selectedOption: {
    borderColor: "#1A0D0E",
    backgroundColor: "#FFCCD0",
  },
  optionText: {
    fontSize: 16,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailsLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  detailsInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: "top",
    backgroundColor: "#FFFF",
  },
  submitButton: {
    backgroundColor: "#E45959",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  successMessage: {
    color: "green",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#762F34",
  },
  cancelText: {
    fontSize: 16,
    color: "#888",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
});

export default ReportScreen;
