import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Internal Imports
import BattleView from "@/components/quest/BattleView";
import { getRandomQuest } from "@/data/quests";
import { QuestData, QuestMode } from "@/types/quest";

const { width } = Dimensions.get("window");

export default function JoggingQuest() {
  const [activeQuest] = useState<QuestData>(() => getRandomQuest());
  const [mode, setMode] = useState<QuestMode>("WALKING");
  const [distance, setDistance] = useState(0);
  const [story, setStory] = useState(
    activeQuest.milestones[0]?.text || "The journey begins...",
  );
  const [isTracking, setIsTracking] = useState(false);

  // --- ANIMATION REFS ---
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const locationWatcher = useRef<Location.LocationSubscription | null>(null);
  const modeRef = useRef<QuestMode>("WALKING");

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // Sync the animation value whenever distance changes
  useEffect(() => {
    // We multiply distance by a large number (e.g., 5000) to make movement visible
    // We use the modulo (%) to loop the background infinitely
    const toValue = -((distance * 5000) % width);

    Animated.spring(scrollAnim, {
      toValue,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  }, [distance]);

  const handleMovement = (addedDist: number) => {
    setDistance((old) => {
      const newTotal = old + addedDist;
      const milestone = activeQuest.milestones.find(
        (m) => newTotal >= m.atKm && old < m.atKm,
      );

      if (milestone) {
        setStory(milestone.text);
        if (milestone.type === "BATTLE") setMode("BATTLE");
      }
      return newTotal;
    });
  };

  const simulateWalking = () => {
    if (mode === "WALKING") handleMovement(0.02); // Increased for testing visibility
  };

  const toggleQuest = async () => {
    if (isTracking) {
      if (locationWatcher.current) locationWatcher.current.remove();
      setIsTracking(false);
      return;
    }
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;
    setIsTracking(true);
    let lastCoord: { lat: number; lon: number } | null = null;
    locationWatcher.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 5 },
      (newLoc) => {
        if (modeRef.current !== "WALKING") return;
        const { latitude, longitude } = newLoc.coords;
        if (lastCoord) {
          const d = 0.005; // Simplified distance for demo
          handleMovement(d);
        }
        lastCoord = { lat: latitude, lon: longitude };
      },
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.visualArea}>
        <View style={styles.questHeader}>
          <Text style={styles.questTitle}>{activeQuest.title}</Text>
        </View>

        {mode === "BATTLE" ? (
          <BattleView
            onVictory={() => {
              setMode("WALKING");
              setStory("Victory!");
            }}
          />
        ) : (
          <View style={styles.worldContainer}>
            {/* MOVING BACKGROUND */}
            <Animated.View
              style={[
                styles.scrollingBg,
                { transform: [{ translateX: scrollAnim }] },
              ]}
            >
              <View style={styles.placeholderBg}>
                {/* Visual markers so you can see movement */}
                <View style={styles.grassMarker} />
                <View style={styles.grassMarker} />
              </View>
              <View style={styles.placeholderBg}>
                <View style={styles.grassMarker} />
                <View style={styles.grassMarker} />
              </View>
              <View style={styles.placeholderBg}>
                <View style={styles.grassMarker} />
                <View style={styles.grassMarker} />
              </View>
            </Animated.View>

            {/* CHARACTER */}
            <View style={styles.characterContainer}>
              <Text style={{ fontSize: 50 }}>🚶</Text>
              <Text style={styles.walkingText}>
                {isTracking ? "VENTURING..." : "READY"}
              </Text>
            </View>

            <TouchableOpacity style={styles.testBtn} onPress={simulateWalking}>
              <Text style={styles.testBtnText}>STEP</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.storyArea}>
        <Text style={styles.logHeader}>— MISSION LOG —</Text>
        <ScrollView style={styles.logScroll}>
          <Text style={styles.storyText}>{story}</Text>
        </ScrollView>
      </View>

      <View style={styles.dashboard}>
        <View style={styles.statCard}>
          <View>
            <Text style={styles.statLabel}>DISTANCE</Text>
            <Text style={styles.statValue}>
              {distance.toFixed(2)}
              <Text style={styles.unit}> KM</Text>
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.btn, isTracking && styles.btnActive]}
            onPress={toggleQuest}
          >
            <Text style={styles.btnText}>{isTracking ? "STOP" : "START"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050505" },
  visualArea: {
    height: "45%",
    backgroundColor: "#1a1a2e",
    overflow: "hidden",
    borderBottomWidth: 2,
    borderColor: "#ffd700",
  },
  worldContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollingBg: {
    flexDirection: "row",
    width: width * 3, // Triple width for seamless looping
    height: "100%",
    position: "absolute",
    left: 0,
  },
  placeholderBg: {
    width: width,
    height: "100%",
    backgroundColor: "#1a1a2e",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  grassMarker: {
    width: 20,
    height: "100%",
    backgroundColor: "rgba(255, 215, 0, 0.1)", // Vertical stripes to see motion
    marginLeft: width / 4,
  },
  characterContainer: { alignItems: "center", zIndex: 10 },
  walkingText: { color: "#ffd700", fontWeight: "bold", fontSize: 12 },
  testBtn: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#ffd700",
    padding: 15,
    borderRadius: 50,
    zIndex: 100,
  },
  testBtnText: { color: "#000", fontWeight: "bold" },
  questHeader: {
    position: "absolute",
    top: 50,
    width: "100%",
    alignItems: "center",
    zIndex: 20,
  },
  questTitle: {
    backgroundColor: "#1c1c2e",
    color: "#ffd700",
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ffd700",
  },
  storyArea: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1c1c2e",
    margin: 15,
    borderRadius: 15,
  },
  logHeader: {
    color: "#ffd700",
    textAlign: "center",
    opacity: 0.6,
    marginBottom: 10,
  },
  storyText: { color: "#e0e0e0", fontSize: 18, textAlign: "center" },
  dashboard: { padding: 20 },
  statCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 20,
    borderRadius: 20,
  },
  statLabel: { color: "#888", fontSize: 10 },
  statValue: { color: "#fff", fontSize: 30, fontWeight: "bold" },
  unit: { color: "#ffd700", fontSize: 14 },
  btn: { backgroundColor: "#ffd700", padding: 15, borderRadius: 10 },
  btnActive: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ffd700",
  },
  btnText: { fontWeight: "bold" },
});
