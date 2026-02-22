import BattleView from "@/components/quest/BattleView";
import { LocationCoord, QuestMode } from "@/types/quest";
import * as Location from "expo-location";
import React, { useRef, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Polyline } from "react-native-maps";

export default function JoggingQuest() {
  const [mode, setMode] = useState<QuestMode>("WALKING");
  const [distance, setDistance] = useState(0);
  const [routeCoordinates, setRouteCoordinates] = useState<LocationCoord[]>([]);
  const [story, setStory] = useState(
    "The GPS signal is locked. Start moving to explore the Cinder-Gate.",
  );

  const locationWatcher = useRef<any>(null);

  // Helper: Haversine distance
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const startQuest = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    locationWatcher.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 5 },
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
              // LOGIC: Every 0.05km (50m), trigger a story or battle
              if (Math.floor(newTotal * 20) > Math.floor(old * 20)) {
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

  const triggerEvent = () => {
    const chance = Math.random();
    if (chance > 0.7) {
      setMode("BATTLE");
      setStory("A foul stench fills the air... Something has found you.");
    } else {
      setStory(
        "You discover an old shrine. The air feels lighter here. +10 XP",
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* SECTION 1: VISUALS (MAP OR BATTLE) */}
      <View style={styles.visualArea}>
        {mode === "BATTLE" ? (
          <BattleView
            onVictory={() => {
              setMode("WALKING");
              setStory("The beast is gone. Continue your journey.");
            }}
          />
        ) : (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={StyleSheet.absoluteFillObject}
            customMapStyle={mapStyle}
            showsUserLocation={true}
            followsUserLocation={true}
          >
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#00FFCC"
              strokeWidth={4}
            />
          </MapView>
        )}
      </View>

      {/* SECTION 2: STORY AREA */}
      <View style={styles.storyArea}>
        <Text style={styles.logHeader}>SYSTEM LOG</Text>
        <ScrollView style={styles.logScroll}>
          <Text style={styles.storyText}>{story}</Text>
        </ScrollView>
      </View>

      {/* SECTION 3: DASHBOARD/ACTIONS */}
      <View style={styles.dashboard}>
        <View style={styles.statRow}>
          <View>
            <Text style={styles.statLabel}>DISTANCE</Text>
            <Text style={styles.statValue}>
              {distance.toFixed(2)}
              <Text style={styles.unit}>KM</Text>
            </Text>
          </View>
          <TouchableOpacity style={styles.btn} onPress={startQuest}>
            <Text style={styles.btnText}>SYNC GPS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { featureType: "water", stylers: [{ color: "#000000" }] },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  visualArea: { height: "40%", borderBottomWidth: 2, borderColor: "#00FFCC" },
  storyArea: { height: "35%", padding: 20, backgroundColor: "#0a0a0a" },
  logHeader: {
    color: "#00FFCC",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 10,
  },
  storyText: { color: "#fff", fontSize: 18, lineHeight: 28 },
  dashboard: {
    height: "25%",
    padding: 20,
    backgroundColor: "#111",
    justifyContent: "center",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: { color: "#444", fontWeight: "bold" },
  statValue: { color: "#fff", fontSize: 32, fontWeight: "bold" },
  unit: { fontSize: 14, color: "#00FFCC" },
  btn: { padding: 15, borderWidth: 1, borderColor: "#00FFCC" },
  btnText: { color: "#fff", fontWeight: "bold" },
});
