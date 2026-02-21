import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function MainMenu() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth() as { logout: () => Promise<void> }; // 2. Pull the logout function from context

  const handleLogout = async () => {
    setLoading(true);
    ``;
    try {
      // 1. Tell Laravel to revoke the token
      await api.post("/logout");

      // 2. Call the logout function from your AuthContext
      // This removes the token from AsyncStorage and sets authToken to null
      await logout();

      // RootLayout will automatically see authToken is null and redirect to /(auth)/login
    } catch (error) {
      console.log("Logout Error:", error.response?.data || error.message);

      // Even if the server request fails (e.g., no internet),
      // we usually want to force logout locally anyway.
      await logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MY GAME</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/getPet")}
      >
        <Text style={styles.buttonText}>START GAME</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#444" }]}
        onPress={() => router.push("/settings")}
      >
        <Text style={styles.buttonText}>SETTINGS</Text>
      </TouchableOpacity>

      {/* 3. The Logout Button */}
      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  title: { color: "#fff", fontSize: 40, marginBottom: 40, fontWeight: "bold" },
  button: {
    backgroundColor: "#1e90ff",
    padding: 15,
    borderRadius: 10,
    width: 200,
    marginVertical: 10,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  logoutButton: { backgroundColor: "#ff4444", marginTop: 30 }, // Red color for logout
});
