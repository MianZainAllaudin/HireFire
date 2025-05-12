import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons"; // or 'react-native-vector-icons/Feather'

const Header = ({
  onMenuPress,
  onProfilePress,
}: {
  onMenuPress?: () => void;
  onProfilePress?: () => void;
}) => {
  return (
    <View style={styles.header}>
      {/* Left: Hamburger */}
      <TouchableOpacity style={styles.leftContainer} onPress={onMenuPress}>
        <Feather name="menu" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Center: Logo */}
      <View style={styles.centerContainer}>
        <Image
          source={require("@/assets/images/logoText.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* Right: Profile */}
      <TouchableOpacity style={styles.rightContainer} onPress={onProfilePress}>
        <Feather name="user" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 38,
    backgroundColor: "#1A0D0E",
  },
  leftContainer: {
    padding: 4,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
  },
  rightContainer: {
    padding: 4,
  },
  logoImage: {
    width: 120,
    height: 60,
  },
});

export default Header;
