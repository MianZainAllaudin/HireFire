import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useRouter } from "expo-router/build/exports";
const router = useRouter();

const FeedbackScreen = () => {
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const router = useRouter();

  const handleSubmit = () => {
    console.log("Feedback submitted:", feedback);
    setIsSubmitted(true);
    setFeedback("");
    setRating(0);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.title}>Feedback</Text>
                <TouchableOpacity onPress={() => router.push("/ReviewPg")}>
                  <Text style={styles.cancelText}>cancel</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.question}>
                How's your Experience on HireFire so far?
              </Text>
              {/* Star Rating Component */}
              <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    onPressIn={() => setHoverRating(star)}
                    onPressOut={() => setHoverRating(0)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons
                      name={
                        star <= (hoverRating || rating) ? "star" : "star-border"
                      }
                      size={40}
                      color={
                        star <= (hoverRating || rating) ? "#FFD700" : "#ccc"
                      }
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.label}>Your Feedback</Text>

              <TextInput
                style={styles.input}
                multiline
                numberOfLines={6}
                placeholder="Any feedback or suggestion about your experience on HireFire."
                placeholderTextColor="#CCCAD0"
                value={feedback}
                onChangeText={setFeedback}
                textAlignVertical="top"
              />

              {isSubmitted ? (
                <Text style={styles.successMessage}>
                  Thank you for your feedback!
                </Text>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    !feedback && styles.disabledButton,
                  ]}
                  onPress={handleSubmit}
                  disabled={!feedback}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EDEE",
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
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
  question: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    height: 150,
    backgroundColor: "#FFFFFF",
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
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
});

export default FeedbackScreen;
