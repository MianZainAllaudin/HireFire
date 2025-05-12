import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  SafeAreaView,
  Image,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { router } from "expo-router/build/exports";
//import { useNavigation } from "@react-navigation/native";

const FeedbackForm = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  //const navigation = useNavigation();

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setIsModalVisible(true);
  };

  const handleSubmit = () => {
    console.log(`Feedback type: ${selectedOption}, Message: ${feedback}`);
    setFeedback("");
    setIsModalVisible(false);
    setSelectedOption(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.leftContainer}
          onPress={() => console.log("Open drawer or menu")}
        >
          <Feather name="menu" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.centerContainer}>
          <Image
            source={require("@/assets/images/logoText.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity
          style={styles.rightContainer}
          onPress={() => console.log("Go to profile")}
        >
          <Feather name="user" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View> */}

      {/* Feedback Options */}
      <View style={styles.content}>
        <Text style={styles.title}>Give your Feedback to HireFire</Text>
        <Text style={styles.subtitle}>Choose an option</Text>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => router.push("/FeedbackPage")}
        >
          <Feather
            name="thumbs-up"
            size={24}
            color="#4a6da7"
            style={styles.icon}
          />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Suggestion or Feedback</Text>
            <Text style={styles.optionDescription}>
              Any feedback or suggestion about your experience on HireFire.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => router.push("/ReportPage")}
        >
          <Feather
            name="alert-circle"
            size={24}
            color="#4a6da7"
            style={styles.icon}
          />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Report an issue</Text>
            <Text style={styles.optionDescription}>
              Let us know if something is not working properly.
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      {/* <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedOption}</Text>
            <TextInput
              style={styles.feedbackInput}
              multiline
              placeholder={`Type your ${(
                selectedOption || "feedback"
              ).toLowerCase()} here...`}
              value={feedback}
              onChangeText={setFeedback}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}
                disabled={!feedback.trim()}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EDEE",
  },

  leftContainer: {
    width: 40,
    alignItems: "flex-start",
  },
  rightContainer: {
    width: 40,
    alignItems: "flex-end",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
  },
  logoImage: {
    width: 120,
    height: 60,
  },

  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    marginTop: 40,
    textAlign: "center",
  },
  optionCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginRight: 15,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  feedbackInput: {
    height: 150,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
  },
  submitButton: {
    backgroundColor: "#4a6da7",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default FeedbackForm;
