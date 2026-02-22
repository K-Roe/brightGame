import BattleView from "@/components/quest/BattleView";
import { QuestMode } from "@/types/quest";
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

const { width } = Dimensions.get("window");

export default function JoggingQuest() {
  // --- STATE ---
  const [mode, setMode] = useState<QuestMode>("WALKING");
  const [distance, setDistance] = useState(0);
  const [routeCoordinates, setRouteCoordinates] = useState<LatLng[]>([]);
  const [story, setStory] = useState(
    "The GPS signal is locked. Step into the mist to begin your journey...",
  );
  const [isTracking, setIsTracking] = useState(false);

  // --- REFS ---
  const locationWatcher = useRef<Location.LocationSubscription | null>(null);

  // --- LOGIC: Cleanup on Unmount ---
  useEffect(() => {
    return () => {
      if (locationWatcher.current) {
        locationWatcher.current.remove();
      }
    };
  }, []);

  // --- LOGIC: Distance Calculation ---
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

  // --- LOGIC: Trigger RPG Events ---
  const triggerEvent = () => {
    const chance = Math.random();
    if (chance > 0.8) {
      setMode("BATTLE");
      setStory("⚠️ AMBUSH! A Shadow Creeper lunges from the darkness!");
    } else {
      const messages = [
        "You find a discarded health potion. Your resolve strengthens.",
        "The wind howls. You feel the presence of ancient spirits.",
        "You've reached a milestone! +10 XP gained for endurance.",
      ];
      setStory(messages[Math.floor(Math.random() * messages.length)]);
    }
  };

  // --- LOGIC: Start/Stop Tracking ---
  const toggleQuest = async () => {
    if (isTracking) {
      if (locationWatcher.current) locationWatcher.current.remove();
      setIsTracking(false);
      setStory("Quest paused. Your progress has been etched into history.");
      return;
    }

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setStory("Permission denied. The gods cannot track your path.");
      return;
    }

    setIsTracking(true);
    setStory("The journey begins. May your stride be swift.");

    locationWatcher.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 5, // Update every 5 meters
      },
      (newLocation) => {
        const { latitude, longitude } = newLocation.coords;

        setRouteCoordinates((prev) => {
          if (prev.length > 0) {
            const last = prev[prev.length - 1];
            const d = calculateDistance(
              last.latitude,
              last.longitude,
              latitude,
              longitude,
            );

            setDistance((old) => {
              const newTotal = old + d;
              // Trigger event every 100 meters (0.1km)
              if (Math.floor(newTotal * 10) > Math.floor(old * 10)) {
                triggerEvent();
              }
              return newTotal;
            });
          }
          return [...prev, { latitude, longitude }];
        });
      },
    );
  };

  return (
    <View style={styles.container}>
      {/* SECTION 1: VISUALS (MAP OR BATTLE) */}
      <View style={styles.visualArea}>
        {mode === "BATTLE" ? (
          <BattleView
            onVictory={() => {
              setMode("WALKING");
              setStory(
                "Victory! The creature dissolves into mist. Continue on.",
              );
            }}
          />
        ) : (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={StyleSheet.absoluteFillObject}
            customMapStyle={mapStyle}
            showsUserLocation={true}
            followsUserLocation={true}
            initialRegion={{
              latitude: routeCoordinates[0]?.latitude || 37.78825,
              longitude: routeCoordinates[0]?.longitude || -122.4324,
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
        )}
      </View>

      {/* SECTION 2: STORY AREA */}
      <View style={styles.storyArea}>
        <Text style={styles.logHeader}>— JOURNAL LOG —</Text>
        <ScrollView
          style={styles.logScroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.storyText}>{story}</Text>
        </ScrollView>
      </View>

      {/* SECTION 3: DASHBOARD */}
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

// --- MAP STYLING (RPG DARK THEME) ---
const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#1a1a1a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
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

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },
  visualArea: {
    height: "45%",
    borderBottomWidth: 3,
    borderColor: "#ffd700",
    backgroundColor: "#000",
  },
  storyArea: {
    height: "30%",
    padding: 20,
    backgroundColor: "#1c1c2e",
    margin: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.2)",
    elevation: 5,
  },
  logHeader: {
    color: "#ffd700",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 3,
    textAlign: "center",
    marginBottom: 10,
    opacity: 0.7,
  },
  logScroll: { flex: 1 },
  storyText: {
    color: "#e0e0e0",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    fontStyle: "italic",
  },
  dashboard: {
    height: "25%",
    paddingHorizontal: 15,
    justifyContent: "center",
  },
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
  statLabel: {
    color: "#888",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  statValue: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "bold",
  },
  unit: {
    fontSize: 14,
    color: "#ffd700",
  },
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
  btnText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 12,
  },
});
