//potato
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router/build/exports";
import { useState } from "react";
import React from "react";

interface Client {
  id: string;
  name: string;
  date: string;
}

export default function RateAndReviewPg() {
  const router = useRouter();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [reviews, setReviews] = useState<Record<string, string>>({});

  // Dummy data - past clients
  const pastClients = [
    { id: "1", name: "John Doe", date: "12 Jan 2025" },
    { id: "2", name: "Jane Smith", date: "25 Feb 2025" },
    { id: "3", name: "Mike Johnson", date: "05 Mar 2025" },
  ];

  // Handle rating change
  const handleRatingChange = (clientId: string, rating: number) => {
    setRatings({ ...ratings, [clientId]: rating });
  };

  // Handle review text change
  const handleReviewChange = (clientId: string, text: string) => {
    setReviews({ ...reviews, [clientId]: text });
  };

  // Submit all reviews
  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log("Submitting reviews:", { ratings, reviews });
    alert("Reviews submitted successfully!");
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Rate and Review Clients</Text>
        <Text style={styles.subTitle}>Please rate your past clients</Text>

        {pastClients.map((client) => (
          <View key={client.id} style={styles.clientCard}>
            <View style={styles.clientHeader}>
              <FontAwesome5
                name="user-alt"
                size={18}
                color="#666666"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.clientName}>{client.name}</Text>
              <Text style={styles.clientDate}>{client.date}</Text>
            </View>

            <Text style={styles.ratingLabel}>Rating:</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleRatingChange(client.id, star)}
                >
                  <MaterialIcons
                    name={ratings[client.id] >= star ? "star" : "star-border"}
                    size={32}
                    color="#FFC107"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.reviewLabel}>Review:</Text>
            <TextInput
              style={styles.reviewInput}
              multiline
              placeholder="Write your review here..."
              value={reviews[client.id] || ""}
              onChangeText={(text) => handleReviewChange(client.id, text)}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit All Reviews</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1D1D1D",
  },

  content: {
    flexGrow: 1,
    backgroundColor: "#F5F0F0",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 16,
  },
  clientCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  clientHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  clientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    flex: 1,
  },
  clientDate: {
    fontSize: 14,
    color: "#666666",
  },
  ratingLabel: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  reviewLabel: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 8,
  },
  reviewInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
    fontSize: 16,
    color: "#333333",
  },
  submitButton: {
    backgroundColor: "#1A0D0E",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
