import { useLocalSearchParams, useRouter } from "expo-router";
import { Accelerometer } from "expo-sensors";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    Vibration,
    View,
} from "react-native";

export default function SitUpQuest() {
  const router = useRouter();
  const { goal = 20, name = "CORE FORTIFICATION" } = useLocalSearchParams();

  const [count, setCount] = useState(0);
  const [isUp, setIsUp] = useState(false); // Tracks if the user is currently at the "up" position
  const subscription = useRef<any>(null);

  // --- SENSOR LOGIC ---
  useEffect(() => {
    // Check for reps every 100ms
    Accelerometer.setUpdateInterval(100);

    subscription.current = Accelerometer.addListener(({ z }) => {
      // When lying flat, Z is usually ~1.
      // When sitting up (phone vertical against chest), Z moves toward 0.

      const sitUpThreshold = 0.3; // Angle threshold for "UP"
      const lieDownThreshold = 0.8; // Angle threshold for "DOWN"

      if (!isUp && z < sitUpThreshold) {
        // User reached the top
        setIsUp(true);
        setCount((prev) => prev + 1);
        Vibration.vibrate(60);
      }

      if (isUp && z > lieDownThreshold) {
        // User returned to lying position
        setIsUp(false);
      }
    });

    return () => {
      subscription.current?.remove();
    };
  }, [isUp]);

  // --- VICTORY CHECK ---
  useEffect(() => {
    if (count >= Number(goal)) {
      subscription.current?.remove();
      Vibration.vibrate([0, 200, 100, 200]);
      Alert.alert(
        "CORE STRENGTHENED",
        "The trial is complete. Your foundation is unshakable.",
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

        {/* THE GOLDEN RING (Pulses when "UP") */}
        <View style={[styles.outerRing, isUp && styles.outerRingActive]}>
          <View style={[styles.manaZone, isUp && styles.manaZoneActive]}>
            <Text style={styles.countText}>{count}</Text>
            <Text style={styles.instruction}>
              {isUp ? "ASCENDED" : "RISE UP"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.storyArea}>
        <Text style={styles.logHeader}>— THE IRON CORE —</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.storyText}>
            "Hold the device to your chest. Let every repetition be a prayer to
            the gods of strength."
          </Text>
        </ScrollView>
      </View>

      <View style={styles.dashboard}>
        <View style={styles.statCard}>
          <View>
            <Text style={styles.statLabel}>REPETITIONS</Text>
            <Text style={styles.statValue}>
              {count}
              <Text style={styles.unit}>/{goal} REPS</Text>
            </Text>
          </View>
          <View
            style={[styles.statusLight, isUp && styles.statusLightActive]}
          />
        </View>
      </View>
    </View>
  );
}

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
    backgroundColor: "rgba(28, 28, 46, 0.9)",
    color: "#ffd700",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ffd700",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  outerRing: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: "rgba(255, 215, 0, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  outerRingActive: {
    borderColor: "#ffd700",
    shadowColor: "#ffd700",
    shadowRadius: 25,
    shadowOpacity: 0.7,
    elevation: 20,
  },
  manaZone: {
    width: 205,
    height: 205,
    borderRadius: 102.5,
    backgroundColor: "#0a0a0a",
    borderWidth: 4,
    borderColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  manaZoneActive: {
    borderColor: "#ffd700",
    backgroundColor: "#151200",
    borderWidth: 2,
  },
  countText: { color: "#fff", fontSize: 80, fontWeight: "bold" },
  instruction: {
    color: "#ffd700",
    fontSize: 10,
    marginTop: 5,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#333",
  },
  statLabel: { color: "#888", fontSize: 10, fontWeight: "bold" },
  statValue: { color: "#fff", fontSize: 36, fontWeight: "bold" },
  unit: { color: "#ffd700", fontSize: 16 },
  statusLight: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#333",
  },
  statusLightActive: { backgroundColor: "#ffd700" },
});
