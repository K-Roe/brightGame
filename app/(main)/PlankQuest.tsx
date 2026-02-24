import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Vibration,
  View,
} from "react-native";

export default function PlankQuest() {
  const router = useRouter();
  const { goal = 30, name = "PLANK RITUAL" } = useLocalSearchParams();
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- TIMER LOGIC ---
  const startTimer = () => {
    if (isActive) return;
    setIsActive(true);
    Vibration.vibrate(100);
    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    setIsActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // --- VICTORY CHECK ---
  useEffect(() => {
    if (seconds >= Number(goal)) {
      stopTimer();
      Vibration.vibrate([0, 200, 100, 200]); // Victory pulse
      Alert.alert(
        "WILLPOWER FORGED",
        "The ritual is complete. Your spirit grows stronger.",
        [{ text: "FINISH", onPress: () => router.back() }],
      );
    }
  }, [seconds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopTimer();
  }, []);

  return (
    <View style={styles.container}>
      {/* VISUAL AREA */}
      <View style={styles.visualArea}>
        <View style={styles.questHeader}>
          <Text style={styles.questTitle}>{name.toString().toUpperCase()}</Text>
        </View>

        {/* OUTER GLOWING RING */}
        <View style={[styles.outerRing, isActive && styles.outerRingActive]}>
          <Pressable
            onPressIn={startTimer}
            onPressOut={stopTimer}
            // delayLongPress prevents accidental cancellations if the finger wiggles
            delayLongPress={5000}
            style={({ pressed }) => [
              styles.manaZone,
              (pressed || isActive) && styles.manaZoneActive,
            ]}
          >
            <Text style={styles.countText}>{seconds}</Text>
            <Text style={styles.instruction}>
              {isActive ? "MAINTAINING..." : "HOLD TO START"}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* STORY AREA */}
      <View style={styles.storyArea}>
        <Text style={styles.logHeader}>— THE INNER FIRE —</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.storyText}>
            "Stillness is the ultimate test of the soul. Let the burn be the
            fire that forges your legend."
          </Text>
        </ScrollView>
      </View>

      {/* DASHBOARD AREA */}
      <View style={styles.dashboard}>
        <View style={styles.statCard}>
          <View>
            <Text style={styles.statLabel}>STAMINA REMAINING</Text>
            <Text style={styles.statValue}>
              {seconds}
              <Text style={styles.unit}>/{goal} SEC</Text>
            </Text>
          </View>
          <View
            style={[styles.statusLight, isActive && styles.statusLightActive]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },
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
  // THE MAGIC RING STYLES
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
    elevation: 20, // Critical for Android glow
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
  countText: {
    color: "#fff",
    fontSize: 80,
    fontWeight: "bold",
  },
  instruction: {
    color: "#ffd700",
    fontSize: 10,
    marginTop: 5,
    letterSpacing: 2,
    fontWeight: "bold",
    opacity: 0.8,
  },
  storyArea: {
    padding: 30,
    flex: 1,
  },
  logHeader: {
    color: "#ffd700",
    textAlign: "center",
    opacity: 0.5,
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 15,
    fontWeight: "bold",
  },
  storyText: {
    color: "#e0e0e0",
    fontSize: 18,
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 28,
  },
  dashboard: {
    padding: 20,
    paddingBottom: 40,
  },
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
  statLabel: {
    color: "#888",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  statValue: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },
  unit: {
    color: "#ffd700",
    fontSize: 16,
  },
  statusLight: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#333",
  },
  statusLightActive: {
    backgroundColor: "#ffd700",
    shadowColor: "#ffd700",
    shadowRadius: 5,
    shadowOpacity: 1,
  },
});
