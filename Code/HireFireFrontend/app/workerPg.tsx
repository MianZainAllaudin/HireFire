//potato
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  Animated,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { DateTimePicker } from "@/components/DateTimePicker";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router/build/exports";
import { useAppContext } from "@/scripts/AppContext";
import React from "react";

export default function WorkerScreen() {
  const [location, setLocation] = useState("");
  const router = useRouter();
  const {user, setUser} = useAppContext();

  return (
    <ThemedView style={styles.container}>
      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome, {user?.name || "null (user not logged in)"}</Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Feather
              name="search"
              size={20}
              color="#666666"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Set Location"
              placeholderTextColor="#666666"
              value={location}
              onChangeText={setLocation}
            />
          </View>
        </View>

        {/* Date Picker */}
        <View style={styles.dateTimeSection}>
          <Text style={styles.sectionHeader}>Select Date and Time</Text>
          <DateTimePicker />
        </View>

        {/* Features */}
        <View style={styles.featuresGrid}>
          <FeatureCard
            iconName="calendar"
            title="Available Appointments"
            subtitle="View work requests"
            onPress={() => router.push("/appointmentsPg")}
          />

          <FeatureCard
            iconName="briefcase"
            title="My Clients"
            subtitle="Manage current clients"
            onPress={() => router.push("/myClientsPg")}
          />

          <FeatureCard
            iconName="bar-chart"
            title="My Performance"
            subtitle="View your statistics"
            onPress={() => router.push("/myPerformancePg")}
          />

          <FeatureCard
            iconName="edit-3"
            title="Rate and Review"
            subtitle="Review past clients"
            onPress={() => router.push("/rateAndReviewPg")}
          />

          <FeatureCard
            iconName="dollar-sign"
            title="Earnings"
            subtitle="Withdraw your money"
            onPress={() => router.push("/earningsPg")}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

// Reusable Feature Card Component
const FeatureCard = ({
  iconName,
  title,
  subtitle,
  onPress,
}: {
  iconName: any;
  title: string;
  subtitle: string;
  onPress: () => void;
}) => {
  const glowAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [glowAnim]);

  const animatedStyle = {
    shadowOpacity: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.8],
    }),
    shadowRadius: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [5, 15],
    }),
  };

  return (
    <Animated.View style={[styles.featureCard, animatedStyle]}>
      <TouchableOpacity onPress={onPress}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Feather
            name={iconName}
            size={20}
            color="#FF0000"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.featureTitle}>{title}</Text>
        </View>
        <Text style={styles.featureSubtitle}>{subtitle}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

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
    paddingTop: 20,
    paddingBottom: 20,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
  },
  welcomeSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
  },
  dateTimeSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 12,
    textAlign: "center",
  },
  featuresGrid: {
    paddingHorizontal: 16,
    gap: 16,
  },
  featureCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: "#FF0000",
    shadowColor: "#FF0000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10, // for Android glow
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
  },
  featureSubtitle: {
    fontSize: 14,
    color: "#666666",
  },
});
