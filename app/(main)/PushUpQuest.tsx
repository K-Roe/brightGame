import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    Vibration,
    View,
} from "react-native";

export default function PushUpQuest() {
  const router = useRouter();
  const { goal = 10, name = "PUSH-UP TRIAL" } = useLocalSearchParams();
  const [count, setCount] = useState(0);

  const registerRep = () => {
    Vibration.vibrate(60);
    setCount((prev) => prev + 1);
  };

  useEffect(() => {
    if (count >= Number(goal)) {
      Alert.alert(
        "STRENGTH INCREASED",
        "You have completed the push-up trial.",
        [{ text: "FINISH", onPress: () => router.back() }],
      );
    }
  }, [count]);

  return (
    <View style={styles.container}>
      <View style={styles.visualArea}>
        <View style={styles.questHeader}>
          <Text style={styles.questTitle}>{name.toString().toUpperCase()}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={registerRep}
          style={styles.manaZone}
        >
          <Text style={styles.countText}>{count}</Text>
          <Text style={styles.instruction}>TOUCH CHEST TO ZONE</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.storyArea}>
        <Text style={styles.logHeader}>— JOURNEYMAN'S LOG —</Text>
        <Text style={styles.storyText}>
          "Each push against the earth builds the foundation of a titan."
        </Text>
      </View>

      <View style={styles.dashboard}>
        <View style={styles.statCard}>
          <View>
            <Text style={styles.statLabel}>GOAL</Text>
            <Text style={styles.statValue}>
              {count}
              <Text style={styles.unit}>/{goal} REPS</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// Shared Styles below...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050505" },
  visualArea: {
    height: "50%",
    backgroundColor: "#1a1a2e",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "#ffd700",
  },
  questHeader: {
    position: "absolute",
    top: 60,
    width: "100%",
    alignItems: "center",
  },
  questTitle: {
    backgroundColor: "#1c1c2e",
    color: "#ffd700",
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ffd700",
    fontSize: 12,
    fontWeight: "bold",
  },
  manaZone: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#121212",
    borderWidth: 4,
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  manaZoneActive: {
    borderColor: "#ffd700",
    backgroundColor: "#2a2400",
    shadowColor: "#ffd700",
    shadowRadius: 20,
    shadowOpacity: 0.5,
  },
  countText: { color: "#fff", fontSize: 80, fontWeight: "bold" },
  instruction: {
    color: "#ffd700",
    fontSize: 10,
    marginTop: 10,
    letterSpacing: 2,
    fontWeight: "bold",
  },
  storyArea: { padding: 30, flex: 1 },
  logHeader: {
    color: "#ffd700",
    textAlign: "center",
    opacity: 0.5,
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 15,
  },
  storyText: {
    color: "#e0e0e0",
    fontSize: 18,
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 28,
  },
  dashboard: { padding: 20, paddingBottom: 40 },
  statCard: {
    backgroundColor: "#121212",
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  statLabel: { color: "#888", fontSize: 10, fontWeight: "bold" },
  statValue: { color: "#fff", fontSize: 36, fontWeight: "bold" },
  unit: { color: "#ffd700", fontSize: 16 },
});
