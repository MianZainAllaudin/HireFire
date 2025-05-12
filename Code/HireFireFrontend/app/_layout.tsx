// layout.tsx
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";

import { Slot } from "expo-router/build/exports";
import SidebarLayout from "../components/sidebarWrapper";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { AppProvider } from "@/scripts/AppContext";
const Tab = createBottomTabNavigator();

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#1A0D0E",
    card: "#1A0D0E",
    text: "#FFFFFF",
    border: "#333333",
    primary: "#FF4D4D",
  },
};

const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#FFFFFF",
    card: "#FFFFFF",
    text: "#000000",
    border: "#CCCCCC",
    primary: "#FF4D4D",
  },
};

export default function Layout() {
  const colorScheme = "dark";

  return (
    <AppProvider>
      <ThemeProvider
        value={colorScheme === "dark" ? CustomDarkTheme : CustomLightTheme}
      >
        <SidebarLayout>
          <Slot />
        </SidebarLayout>
      </ThemeProvider>      
    </AppProvider>
  );
}
