//potato
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router/build/exports";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import React from "react";

export default function MyPerformancePg() {
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;

  // Dummy data
  const historyData = [
    { client: "John Doe", date: "12 Jan 2025" },
    { client: "Jane Smith", date: "25 Feb 2025" },
    { client: "Mike Johnson", date: "05 Mar 2025" },
  ];

  const ratingsData = [
    {
      rating: 5,
      review: "Excellent work and very professional.",
      reviewer: "John Doe",
    },
    {
      rating: 4,
      review: "Good service but could be faster.",
      reviewer: "Jane Smith",
    },
    { rating: 5, review: "Outstanding performance!", reviewer: "Mike Johnson" },
  ];

  const analyticsData = {
    total: 30,
    completed: 27,
    notCompleted: 3,
  };

  const pieData = [
    {
      name: "Completed",
      population: analyticsData.completed,
      color: "#4CAF50",
      legendFontColor: "#333333",
      legendFontSize: 14,
    },
    {
      name: "Not Completed",
      population: analyticsData.notCompleted,
      color: "#F44336",
      legendFontColor: "#333333",
      legendFontSize: 14,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* History Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>History</Text>
          {historyData.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.listItemLeft}>
                <FontAwesome5
                  name="briefcase"
                  size={18}
                  color="#666666"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.listItemText}>{item.client}</Text>
              </View>
              <Text style={styles.listItemDate}>{item.date}</Text>
            </View>
          ))}
        </View>

        {/* Ratings and Reviews Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ratings and Reviews</Text>
          {ratingsData.map((item, index) => (
            <View key={index} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <MaterialIcons
                  name="star"
                  size={18}
                  color="#FFC107"
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.ratingStars}>{item.rating} / 5</Text>
                <Text style={styles.reviewerName}> • {item.reviewer}</Text>
              </View>
              <Text style={styles.reviewText}>{item.review}</Text>
            </View>
          ))}
        </View>

        {/* Analytics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analytics</Text>
          <View style={styles.analyticsSummary}>
            <Text style={styles.analyticsText}>
              Total Works: {analyticsData.total}
            </Text>
            <Text style={styles.analyticsText}>
              Completed: {analyticsData.completed}
            </Text>
            <Text style={styles.analyticsText}>
              Not Completed: {analyticsData.notCompleted}
            </Text>
          </View>

          {/* Calculate percentages */}
          {(() => {
            const total = analyticsData.completed + analyticsData.notCompleted;
            const completedPercent = Math.round(
              (analyticsData.completed / total) * 100
            );
            const notCompletedPercent = Math.round(
              (analyticsData.notCompleted / total) * 100
            );

            return (
              <>
                <PieChart
                  data={[
                    {
                      name: `${completedPercent}%`,
                      population: analyticsData.completed,
                      color: "#4CAF50",
                      legendFontColor: "#333333",
                      legendFontSize: 14,
                    },
                    {
                      name: `${notCompletedPercent}%`,
                      population: analyticsData.notCompleted,
                      color: "#F44336",
                      legendFontColor: "#333333",
                      legendFontSize: 14,
                    },
                  ]}
                  width={screenWidth - 40}
                  height={220}
                  chartConfig={{
                    backgroundColor: "#F5F0F0",
                    backgroundGradientFrom: "#F5F0F0",
                    backgroundGradientTo: "#F5F0F0",
                    color: (opacity = 1) => `rgba(26, 13, 14, ${opacity})`,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                  hasLegend={false}
                />

                {/* Custom Legend */}
                <View style={styles.legendContainer}>
                  <View style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendColor,
                        { backgroundColor: "#4CAF50" },
                      ]}
                    />
                    <Text style={styles.legendText}>
                      Completed ({completedPercent}%)
                    </Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendColor,
                        { backgroundColor: "#F44336" },
                      ]}
                    />
                    <Text style={styles.legendText}>
                      Not Completed ({notCompletedPercent}%)
                    </Text>
                  </View>
                </View>
              </>
            );
          })()}
        </View>
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
    gap: 24,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 12,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  listItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  listItemText: {
    fontSize: 16,
    color: "#333333",
  },
  listItemDate: {
    fontSize: 14,
    color: "#666666",
  },
  reviewItem: {
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    flexWrap: "wrap",
  },
  ratingStars: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  reviewerName: {
    fontSize: 14,
    color: "#666666",
    fontStyle: "italic",
  },
  reviewText: {
    fontSize: 16,
    color: "#666666",
  },
  analyticsSummary: {
    marginBottom: 16,
  },
  analyticsText: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 4,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingHorizontal: 20, // Added padding for better spacing
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "48%", // Prevent text overflow
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: "#333333",
    flexShrink: 1, // Allow text to wrap if needed
  },
});
