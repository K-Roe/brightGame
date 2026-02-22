import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, { LatLng, PROVIDER_GOOGLE, Polyline } from "react-native-maps";

// Internal Imports
import BattleView from "@/components/quest/BattleView";
import { getRandomQuest } from "@/data/quests";
import { QuestData, QuestMode } from "@/types/quest";

const { width } = Dimensions.get("window");

export default function JoggingQuest() {
  // --- QUEST SELECTION ---
  const [activeQuest] = useState<QuestData>(() => getRandomQuest());

  // --- STATE ---
  const [mode, setMode] = useState<QuestMode>("WALKING");
  const [distance, setDistance] = useState(0);
  const [routeCoordinates, setRouteCoordinates] = useState<LatLng[]>([]);
  const [story, setStory] = useState(
    activeQuest.milestones[0]?.text || "The mist clears...",
  );
  const [isTracking, setIsTracking] = useState(false);

  // --- REFS ---
  const locationWatcher = useRef<Location.LocationSubscription | null>(null);
  // Ref to track the mode because the location callback is a closure
  const modeRef = useRef<QuestMode>("WALKING");

  // Keep the ref in sync with state
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // --- CLEANUP ---
  useEffect(() => {
    return () => {
      if (locationWatcher.current) locationWatcher.current.remove();
    };
  }, []);

  // --- DISTANCE LOGIC ---
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const handleMovement = (addedDist: number) => {
    setDistance((old) => {
      const newTotal = old + addedDist;

      // 1. Check for specific milestones in the Quest File
      const milestone = activeQuest.milestones.find(
        (m) => newTotal >= m.atKm && old < m.atKm,
      );

      if (milestone) {
        setStory(milestone.text);
        if (milestone.type === "BATTLE") {
          setMode("BATTLE");
        }
      }
      // 2. Random Encounters (only if no milestone was hit)
      else if (Math.floor(newTotal * 20) > Math.floor(old * 20)) {
        if (Math.random() > 0.8) {
          setMode("BATTLE");
          setStory("⚠️ A wild creature lunges from the shadows!");
        }
      }

      return newTotal;
    });
  };

  // --- TEST BUTTON LOGIC ---
  const simulateWalking = () => {
    // Only allow testing if we aren't in a battle
    if (mode === "WALKING") {
      handleMovement(0.01);
      const last = routeCoordinates[routeCoordinates.length - 1] || {
        latitude: 37.78825,
        longitude: -122.4324,
      };
      setRouteCoordinates([
        ...routeCoordinates,
        {
          latitude: last.latitude + 0.0001,
          longitude: last.longitude + 0.0001,
        },
      ]);
    }
  };

  // --- GPS CONTROL ---
  const toggleQuest = async () => {
    if (isTracking) {
      if (locationWatcher.current) locationWatcher.current.remove();
      setIsTracking(false);
      return;
    }

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    setIsTracking(true);
    locationWatcher.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 5 },
      (newLoc) => {
        // GATE: Stop distance tracking if in Battle
        if (modeRef.current !== "WALKING") return;

        const { latitude, longitude } = newLoc.coords;
        setRouteCoordinates((prev) => {
          if (prev.length > 0) {
            const last = prev[prev.length - 1];
            const d = calculateDistance(
              last.latitude,
              last.longitude,
              latitude,
              longitude,
            );

            // JITTER FILTER: Ignore jumps larger than 100 meters (0.1km)
            // per 5-meter interval. This stops "teleporting."
            if (d < 0.1) {
              handleMovement(d);
            }
          }
          return [...prev, { latitude, longitude }];
        });
      },
    );
  };

  return (
    <View style={styles.container}>
      {/* MAP / BATTLE AREA */}
      <View style={styles.visualArea}>
        <View style={styles.questHeader}>
          <Text style={styles.questTitle}>{activeQuest.title}</Text>
        </View>

        {mode === "BATTLE" ? (
          <BattleView
            onVictory={() => {
              setMode("WALKING");
              setStory("Victory! The path is clear.");
            }}
          />
        ) : (
          <>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={StyleSheet.absoluteFillObject}
              customMapStyle={mapStyle}
              showsUserLocation={true}
              followsUserLocation={true}
              initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <Polyline
                coordinates={routeCoordinates}
                strokeColor="#ffd700"
                strokeWidth={4}
              />
            </MapView>
            <TouchableOpacity style={styles.testBtn} onPress={simulateWalking}>
              <Text style={styles.testBtnText}>TEST +0.01km</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* STORY AREA */}
      <View style={styles.storyArea}>
        <Text style={styles.logHeader}>— JOURNAL LOG —</Text>
        <ScrollView
          style={styles.logScroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.storyText}>{story}</Text>
        </ScrollView>
      </View>

      {/* DASHBOARD AREA */}
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
            <Text style={styles.btnText}>
              {isTracking ? "PAUSE" : "START QUEST"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// --- STYLING ---
const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#1a1a1a" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2c2c2c" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#000000" }],
  },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050505" },
  visualArea: {
    height: "45%",
    borderBottomWidth: 3,
    borderColor: "#ffd700",
    backgroundColor: "#000",
  },
  questHeader: {
    position: "absolute",
    top: 50,
    width: "100%",
    alignItems: "center",
    zIndex: 20,
  },
  questTitle: {
    backgroundColor: "rgba(28, 28, 46, 0.9)",
    color: "#ffd700",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ffd700",
    fontSize: 11,
    fontWeight: "bold",
  },
  testBtn: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "rgba(255, 215, 0, 0.8)",
    padding: 8,
    borderRadius: 5,
    zIndex: 30,
  },
  testBtnText: { color: "#000", fontSize: 10, fontWeight: "bold" },
  storyArea: {
    height: "30%",
    padding: 20,
    backgroundColor: "#1c1c2e",
    margin: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.2)",
  },
  logHeader: {
    color: "#ffd700",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 10,
    opacity: 0.6,
  },
  logScroll: { flex: 1 },
  storyText: {
    color: "#e0e0e0",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    fontStyle: "italic",
  },
  dashboard: { height: "25%", paddingHorizontal: 15, justifyContent: "center" },
  statCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  statLabel: { color: "#888", fontSize: 10, fontWeight: "bold" },
  statValue: { color: "#fff", fontSize: 34, fontWeight: "bold" },
  unit: { fontSize: 14, color: "#ffd700" },
  btn: {
    backgroundColor: "#ffd700",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  btnActive: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ffd700",
  },
  btnText: { color: "#000", fontWeight: "bold", fontSize: 12 },
});
