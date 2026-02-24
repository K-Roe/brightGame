import CharacterCard from "@/components/CharacterCard";
import MenuButton from "@/components/MenuButton";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function BrightQuestMenu() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [character, setCharacter] = useState(null);
  const { logout } = useAuth();

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("user-token");

      if (!token) {
        router.replace("/login");
        return;
      }
      const response = await api.get("/character", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      if (data) {
        const weightDiff = (
          parseFloat(data.starting_weight) - parseFloat(data.current_weight)
        ).toFixed(1);

        setCharacter({
          ...data,
          weightLost: weightDiff,
          displayClass: data.hero_class
            ? data.hero_class.toUpperCase()
            : "UNKNOWN",
        });
      }
    } catch (error) {
      console.error("Failed to load user stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (e) {
    } finally {
      await logout();
      router.replace("/login");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#ffd700" />
        <Text style={{ color: "#fff", marginTop: 10, textAlign: "center" }}>
          Summoning Hero...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* APP TITLE */}
        <Text style={styles.brand}>
          BRIGHT<Text style={{ color: "#ffd700" }}>QUEST</Text>
        </Text>

        {/* CHARACTER MINI-CARD */}

        {character ? (
          <CharacterCard character={character} />
        ) : (
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>NO HERO FOUND</Text>
            <TouchableOpacity onPress={() => router.push("/createCharacter")}>
              <Text style={{ color: "#1e90ff", marginTop: 10 }}>
                Create one to begin your quest →
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* MAIN RPG BUTTONS */}
        <MenuButton
          title="START QUEST"
          subtitle="The Tutorial-Quest awaits..."
          emoji="🗺️"
          onPress={() => router.push("/quest")}
        />

        <MenuButton
          title="FELLOWSHIP"
          subtitle="0 Allies Online"
          emoji="🛡️"
          backgroundColor="#2e8b57"
          onPress={() => router.push("/fellowship")}
        />

        <MenuButton
          title="TRAINING CAMP"
          subtitle="Press-ups & Planks"
          emoji="⚔️"
          backgroundColor="#8a2be2"
          onPress={() => router.push("/trainingCamp")}
        />

        {/* UTILITY BUTTONS */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => router.push("/settings")}
          >
            <Text style={styles.smallButtonText}>SETTINGS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.smallButton, styles.logoutBtn]}
            onPress={handleLogout}
          >
            <Text style={styles.smallButtonText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f1a" },
  scrollContainer: { alignItems: "center", paddingVertical: 60 },
  brand: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 20,
  },
  statsCard: {
    backgroundColor: "#1c1c2e",
    width: "85%",
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ffd700",
    marginBottom: 30,
  },
  statsTitle: { color: "#ffd700", fontSize: 18, fontWeight: "bold" },

  subText: { color: "rgba(255,255,255,0.7)", fontSize: 12 },
  footer: { flexDirection: "row", marginTop: 40, gap: 10 },
  smallButton: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
    width: 120,
  },
  logoutBtn: { backgroundColor: "#8b0000" },
  smallButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
  },
});
