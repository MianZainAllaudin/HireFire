import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "@/config";

// const API_BASE_URL = "http://192.168.10.17:8080/api";

export default function PaymentScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<
    "jazzcash" | "card" | null
  >(null);

  const handlePayment = async () => {
    if (!selectedMethod) return;

    setIsLoading(true);

    try {
      // 1. Call backend to get JazzCash URL
      const response = await axios.get(`${BASE_URL}api/payments/initiate`);
      const jazzCashUrl = response.data.redirectUrl;
      console.log(jazzCashUrl);

      // 2. Verify URL is valid
      if (!jazzCashUrl.startsWith("https://")) {
        throw new Error("Invalid payment URL");
      }

      // 3. Open in browser
      const canOpen = await Linking.canOpenURL(jazzCashUrl);
      if (!canOpen) {
        throw new Error("Cannot open payment gateway");
      }

      await Linking.openURL(jazzCashUrl);
    } catch (error) {
      //alert(`Payment Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Payment Method</Text>

      <TouchableOpacity
        style={[
          styles.methodButton,
          selectedMethod === "jazzcash" && styles.selectedMethod,
        ]}
        onPress={() => setSelectedMethod("jazzcash")}
      >
        <Text style={styles.methodText}>JazzCash</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.methodButton,
          selectedMethod === "card" && styles.selectedMethod,
        ]}
        onPress={() => setSelectedMethod("card")}
      >
        <Text style={styles.methodText}>Credit/Debit Card</Text>
      </TouchableOpacity>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <TouchableOpacity
          style={[
            styles.payButton,
            (!selectedMethod || isLoading) && styles.disabledButton,
          ]}
          onPress={handlePayment}
          disabled={!selectedMethod || isLoading}
        >
          <Text style={styles.payButtonText}>
            {`Pay with ${selectedMethod || "..."}`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#C94E50",
  },
  methodButton: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectedMethod: {
    borderColor: "#C94E50",
    backgroundColor: "#F9E8E8",
  },
  methodText: {
    fontSize: 16,
    textAlign: "center",
  },
  payButton: {
    backgroundColor: "#C94E50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#E0E0E0",
  },
  payButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loader: {
    marginVertical: 20,
  },
});
