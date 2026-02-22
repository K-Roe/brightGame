import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../services/api";

// Importing from your tidy constants file
import {
  CLASS_ITEMS,
  CLASS_STATS,
  HEROS_CLASSES,
} from "../../src/constants/characterData";

export default function CreateCharacter() {
  const router = useRouter();
  const [heroName, setHeroName] = useState("");
  const [heroClass, setHeroClass] = useState("Warrior");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  // Pulling dynamic stats based on the selected class
  const stats = CLASS_STATS[heroClass];

  const handleBeginQuest = async () => {
    if (!heroName || !heroClass || !height || !weight) {
      Alert.alert(
        "Quest Error",
        "Your hero needs a name, height, and weight to begin!",
      );
      return;
    }

    setLoading(true);

    try {
      const token = await SecureStore.getItemAsync("user-token");

      if (!token) {
        throw new Error("Session not found. Please log in again.");
      }

      // 1. Axios handles JSON.stringify for you, just pass the object
      const payload = {
        name: heroName,
        hero_class: heroClass,
        str: stats.str,
        dex: stats.dex,
        agi: stats.agi,
        int: stats.int,
        height: parseFloat(height),
        current_weight: parseFloat(weight),
        items: CLASS_ITEMS[heroClass],
      };

      // 2. Axios .post syntax: api.post(url, data, config)
      const response = await api.post("/characters", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 3. Axios puts the server response in 'response.data'
      // It also throws an error automatically for 4xx/5xx codes
      if (response.status === 200 || response.status === 201) {
        setLoading(false);
        Alert.alert("Character Created!", `${heroName} has entered the realm.`);
        router.replace("/(main)");
      }
    } catch (error) {
      setLoading(false);

      // Axios stores the server error message in error.response.data
      const serverMessage = error.response?.data?.message || error.message;
      const validationErrors = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join("\n")
        : null;

      Alert.alert("Scroll Error", validationErrors || serverMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.brand}>
          BRIGHT<Text style={{ color: "#ffd700" }}>QUEST</Text>
        </Text>

        <View style={styles.headerArea}>
          <Text style={styles.headerText}>CREATE YOUR HERO</Text>
          <Text style={styles.flavorText}>
            Your physical journey powers your digital avatar.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>HERO'S NAME</Text>
          <TextInput
            placeholder="Enter Name..."
            placeholderTextColor="#475569"
            style={styles.input}
            value={heroName}
            onChangeText={setHeroName}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>HEIGHT (CM)</Text>
              <TextInput
                placeholder="180"
                placeholderTextColor="#475569"
                keyboardType="numeric"
                style={styles.input}
                value={height}
                onChangeText={setHeight}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>WEIGHT (KG)</Text>
              <TextInput
                placeholder="85"
                placeholderTextColor="#475569"
                keyboardType="numeric"
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
              />
            </View>
          </View>

          <Text style={styles.label}>CHOOSE YOUR CALLING</Text>
          <TouchableOpacity
            style={styles.dropdownTrigger}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Text style={styles.dropdownTriggerText}>
              {heroClass.toUpperCase()}
            </Text>
            <Text style={{ color: "#ffd700" }}>{showDropdown ? "▲" : "▼"}</Text>
          </TouchableOpacity>

          {showDropdown && (
            <View style={styles.dropdownMenu}>
              {HEROS_CLASSES.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setHeroClass(item);
                    setShowDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      heroClass === item && {
                        color: "#ffd700",
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    {item.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.statsContainer}>
            <Text style={styles.descriptionText}>"{stats.desc}"</Text>
            <View style={styles.statRow}>
              <StatBar label="STR" value={stats.str} color="#ff4444" />
              <StatBar label="DEX" value={stats.dex} color="#44ff44" />
            </View>
            <View style={styles.statRow}>
              <StatBar label="AGI" value={stats.agi} color="#1e90ff" />
              <StatBar label="INT" value={stats.int} color="#8a2be2" />
            </View>
          </View>

          <View style={styles.gearContainer}>
            <Text style={styles.label}>STARTER GEAR</Text>
            {CLASS_ITEMS[heroClass].map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemEmoji}>{item.icon || "⚔️"}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDesc}>{item.description}</Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={handleBeginQuest}
            disabled={loading}
            style={[styles.primaryBtn, loading && styles.disabledBtn]}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.btnText}>BEGIN MY QUEST</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const StatBar = ({ label, value, color }) => (
  <View style={styles.statBlock}>
    <Text style={styles.statLabel}>{label}</Text>
    <View style={styles.statBarBg}>
      <View
        style={[
          styles.statBarFill,
          { width: `${value * 10}%`, backgroundColor: color },
        ]}
      />
    </View>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f1a" },
  scrollContainer: { alignItems: "center", padding: 20 },
  brand: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 10,
  },
  headerArea: { marginBottom: 25, alignItems: "center" },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  flavorText: { color: "#64748b", fontSize: 12, marginTop: 5 },
  card: {
    width: "100%",
    backgroundColor: "#1c1c2e",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.1)",
  },
  label: {
    color: "#ffd700",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 15,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  input: {
    backgroundColor: "#0f0f1a",
    color: "#fff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#334155",
  },
  dropdownTrigger: {
    backgroundColor: "#0f0f1a",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#334155",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownTriggerText: { color: "#fff", fontWeight: "bold" },
  dropdownMenu: {
    backgroundColor: "#0f0f1a",
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ffd700",
    overflow: "hidden",
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(51, 65, 85, 0.5)",
  },
  dropdownItemText: { color: "#94a3b8", fontSize: 13 },
  statsContainer: {
    marginTop: 25,
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 15,
  },
  descriptionText: {
    color: "#aaa",
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 15,
    fontSize: 12,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statBlock: { width: "48%" },
  statLabel: {
    color: "#ffd700",
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statBarBg: { height: 6, backgroundColor: "#334155", borderRadius: 3 },
  statBarFill: { height: "100%", borderRadius: 3 },
  statValue: { color: "#fff", fontSize: 10, textAlign: "right", marginTop: 2 },
  gearContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "rgba(255, 215, 0, 0.05)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.1)",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 5,
  },
  itemEmoji: { fontSize: 20, marginRight: 12 },
  itemName: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  itemDesc: { color: "#64748b", fontSize: 11 },
  primaryBtn: {
    backgroundColor: "#1e90ff",
    padding: 18,
    borderRadius: 12,
    marginTop: 25,
    alignItems: "center",
  },
  disabledBtn: { backgroundColor: "#475569" },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
