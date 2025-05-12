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
import { useState } from "react";
import React from "react";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  reference: string;
}

export default function EarningsPg() {
  const router = useRouter();

  // Dummy data - would come from your backend in production
  const [totalEarnings, setTotalEarnings] = useState<number>(45250); // PKR
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      date: "15 Apr 2025",
      amount: 12500,
      status: "completed",
      reference: "TRX-789456",
    },
    {
      id: "2",
      date: "28 Mar 2025",
      amount: 18750,
      status: "completed",
      reference: "TRX-123456",
    },
    {
      id: "3",
      date: "10 Feb 2025",
      amount: 14000,
      status: "completed",
      reference: "TRX-456789",
    },
  ]);

  // Handle money transfer
  const handleTransfer = () => {
    // In production, this would connect to your payment gateway
    alert(`Transfer request for PKR ${totalEarnings} initiated!`);
    // Add to transactions history
    setTransactions([
      {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        amount: totalEarnings,
        status: "pending",
        reference: `TRX-${Math.floor(100000 + Math.random() * 900000)}`,
      },
      ...transactions,
    ]);
    setTotalEarnings(0); // Reset after transfer
  };

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Earnings Summary */}
        <View style={styles.earningsCard}>
          <Text style={styles.earningsLabel}>Total Earnings</Text>
          <Text style={styles.earningsAmount}>
            PKR {totalEarnings.toLocaleString()}
          </Text>
          <Text style={styles.earningsSubtext}>Available for transfer</Text>
        </View>

        {/* Transfer Button */}
        <TouchableOpacity
          style={[
            styles.transferButton,
            totalEarnings <= 0 && styles.disabledButton,
          ]}
          onPress={handleTransfer}
          disabled={totalEarnings <= 0}
        >
          <MaterialIcons name="account-balance" size={24} color="#FFFFFF" />
          <Text style={styles.transferButtonText}>
            Transfer to Bank Account
          </Text>
        </TouchableOpacity>

        {/* Transactions History */}
        <Text style={styles.sectionTitle}>
          Recent Transactions (Last 3 Months)
        </Text>

        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionHeader}>
                <FontAwesome5
                  name="exchange-alt"
                  size={16}
                  color={
                    transaction.status === "completed"
                      ? "#4CAF50"
                      : transaction.status === "pending"
                      ? "#FFC107"
                      : "#F44336"
                  }
                />
                <Text style={styles.transactionDate}>{transaction.date}</Text>
                <Text
                  style={[
                    styles.transactionStatus,
                    transaction.status === "completed" &&
                      styles.statusCompleted,
                    transaction.status === "pending" && styles.statusPending,
                    transaction.status === "failed" && styles.statusFailed,
                  ]}
                >
                  {transaction.status.toUpperCase()}
                </Text>
              </View>

              <View style={styles.transactionDetails}>
                <Text style={styles.transactionAmount}>
                  PKR {transaction.amount.toLocaleString()}
                </Text>
                <Text style={styles.transactionReference}>
                  Ref: {transaction.reference}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noTransactionsText}>No transactions found</Text>
        )}
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
    gap: 20,
  },
  earningsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  earningsLabel: {
    fontSize: 18,
    color: "#666666",
    marginBottom: 4,
  },
  earningsAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333333",
  },
  earningsSubtext: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
  },
  transferButton: {
    flexDirection: "row",
    backgroundColor: "#1A0D0E",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  transferButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 12,
  },
  transactionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  transactionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },
  transactionDate: {
    fontSize: 14,
    color: "#666666",
    flex: 1,
  },
  transactionStatus: {
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusCompleted: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
  },
  statusPending: {
    backgroundColor: "#FFF8E1",
    color: "#FF8F00",
  },
  statusFailed: {
    backgroundColor: "#FFEBEE",
    color: "#C62828",
  },
  transactionDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  transactionReference: {
    fontSize: 12,
    color: "#999999",
  },
  noTransactionsText: {
    textAlign: "center",
    color: "#666666",
    marginTop: 20,
  },
});
