import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MonsterRenderer from "../../components/MonsterRenderer";

export default function GetPetScreen() {
  const [isAlive, setIsAlive] = useState(false);
  const router = useRouter();

  // Initial DNA
  const [testHash, setTestHash] = useState("a1b2c3d4");

  // Function to generate a random hex string
  const generateRandomDNA = () => {
    const randomHex = Math.floor(Math.random() * 0xffffffffffff)
      .toString(16)
      .padStart(12, "0");
    setTestHash(randomHex);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Monster Lab</Text>

      {/* THE MAIN DISPLAY CARD */}
      <View style={styles.card}>
        {/* Pass BOTH the hash AND the isAlive state to this one renderer */}
        <MonsterRenderer hash={testHash} isAlive={isAlive} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Monster DNA:</Text>
        <TextInput
          style={styles.input}
          value={testHash}
          onChangeText={setTestHash}
          placeholder="e.g. a1b2c3d4"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.buttonGroup}>
        {/* 1. RANDOMIZE BUTTON */}
        <TouchableOpacity
          style={styles.randomButton}
          onPress={generateRandomDNA}
        >
          <Text style={styles.buttonText}>🎲 Random Mutation</Text>
        </TouchableOpacity>

        {/* 2. BRING TO LIFE BUTTON */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: isAlive ? "#e74c3c" : "#2ecc71" },
          ]}
          onPress={() => setIsAlive(!isAlive)}
        >
          <Text style={styles.buttonText}>
            {isAlive ? "💤 Put to Sleep" : "⚡ Bring to Life!"}
          </Text>
        </TouchableOpacity>

        {/* 3. BACK BUTTON */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>
        Each unique code creates a unique monster!
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#eef2f3",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2c3e50",
  },
  card: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: "#34495e",
    marginBottom: 20,
    minWidth: 260, // Ensure card is wide enough
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#7f8c8d",
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#bdc3c7",
    fontSize: 18,
    fontFamily: "monospace",
    textAlign: "center",
  },
  buttonGroup: {
    width: "100%",
    gap: 12,
  },
  randomButton: {
    backgroundColor: "#3498db",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
  },
  actionButton: {
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    padding: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "#95a5a6",
    fontSize: 16,
  },
  hint: {
    fontSize: 12,
    color: "#bdc3c7",
    marginTop: 20,
  },
});
