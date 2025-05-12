import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router/build/exports";

import { Redirect } from "expo-router/build/exports";
import React from "react";

export default function Index() {
  return <Redirect href="/login" />; //un-comment to make it work
  //put name of any page you want to see on the screen as the first thing you want to see when app opens
  //just replace customerPg1 with your desired page name and un-comment the line
  //DO turn it back after changes to avoid conflicts
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A0D0E",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: "#FFFFFF",
    marginBottom: 30,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#FF4D4D",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },
  spacer: {
    height: 20,
  },
  redButtonContainer: {
    backgroundColor: "#FF4D4D",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  cpg1Container: {
    backgroundColor: "#FF4D4D",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
});
