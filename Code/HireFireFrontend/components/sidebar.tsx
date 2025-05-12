// components/Sidebar.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppContext } from "@/scripts/AppContext";

interface SidebarProps {
  closeSidebar: () => void;
  userName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ closeSidebar, userName }) => {
  const menuItems = [
    { label: "My profile", route: "/profile" },
    { label: "Recent workers", route: "/recentWorkers" },
    { label: "Give Feedback", route: "/ReviewPg" },
    { label: "Logout", action: "logout" },
  ];
  const router = useRouter();
  const {user, setUser} = useAppContext();

  const handlePress = (route?: string, action?: string) => {
    closeSidebar();

    const handlePress = (route: string, action?: () => void) => {
      if (action) {
        action();
      } else {
        closeSidebar();
        router.push("/ReviewPg"); // navigate to the page
      }
    };

    if (action === "logout") {
      //  logout logic
      console.log("User logged out");
      setUser(null);
      router.navigate("/login")
      
    } else if (route) {
      router.push(route as any);
    }
  };

  return (
    <View style={styles.container}>
      {/* User Header */}
      <View style={styles.header}>
        <Ionicons name="person-outline" size={36} color="#fff" />
        <Text style={styles.userName}>{userName}</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => handlePress(item.route, item.action)}
          >
            <Text style={styles.menuText}>{item.label}</Text>
            <Feather name="chevron-right" size={20} color="#000" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: "100%",
    backgroundColor: "#fff",
    // justifyContent: "space-between",
  },
  header: {
    backgroundColor: "#E94C4C",
    padding: 20,
    paddingTop: 40,
    alignItems: "center",
  },
  userName: {
    color: "#fff",
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  menu: {
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: {
    fontSize: 16,
  },
});

export default Sidebar;
