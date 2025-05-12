import React, { useRef, useState } from "react";
import {
  View,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import Sidebar from "./sidebar";
import Header from "./header";
import NavBar from "./navBar";
import { useAppContext } from "@/scripts/AppContext";

const SidebarLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-280)).current;
  const {user, setUser} = useAppContext();

  const openSidebar = () => {
    setSidebarVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: -280,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSidebarVisible(false));
  };

  return (
    <View style={{ flex: 1 }}>
      {user != null && <Header onMenuPress={openSidebar} />}
      <View style={{ flex: 1 }}>{children}</View>
      {user != null && <NavBar />}
      {sidebarVisible && (
        <TouchableWithoutFeedback onPress={closeSidebar}>
          <View style={StyleSheet.absoluteFill}>
            <Animated.View
              style={[
                styles.sidebar,
                { transform: [{ translateX: slideAnim }] },
              ]}
            >
              <Sidebar userName="HireFireUser" closeSidebar={closeSidebar} />
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 280,
    backgroundColor: "#fff",
    zIndex: 10,
  },
});

export default SidebarLayout;
