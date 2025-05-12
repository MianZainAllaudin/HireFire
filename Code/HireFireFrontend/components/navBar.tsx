import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppContext } from "@/scripts/AppContext";

const NavBar = () => {
  const router = useRouter();
  const {user, setUser} = useAppContext();

  return (
    //sample routes until we make the required screens
    <View style={styles.navBar}>
      <TouchableOpacity onPress={() => user?.role == 'client' ? router.push("/homePageCustomer") : router.push('/homePageWorker')}>
        <View style={styles.iconWrapper}>
          <Feather name="home" size={24} color="#1A0D0E" />
        </View>
        {/* <Text style={styles.label}>Home</Text> */}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/chats")}>
        <View style={styles.iconWrapper}>
          <Feather name="message-circle" size={24} color="#1A0D0E" />
        </View>
        {/* <Text style={styles.label}>Chat</Text> */}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/earningsPg")}>
        <View style={styles.iconWrapper}>
          <Feather name="clock" size={24} color="#1A0D0E" />
        </View>
        {/* <Text style={styles.label}>History</Text> */}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/appointmentsPg")}>
        <View style={styles.iconWrapper}>
          <Feather name="settings" size={24} color="#1A0D0E" />
        </View>
        {/* <Text style={styles.label}>Settings</Text> */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFF",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  label: {
    color: "#1A0D0E",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },

  iconWrapper: {
    marginTop: -5,
  },
});

export default NavBar;
