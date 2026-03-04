import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Polyline } from "react-native-maps";

// Internal Imports
import BattleView from "@/components/quest/BattleView";
import { getRandomQuest } from "@/data/quests";
import { QuestData, QuestMode } from "@/types/quest";

const { width } = Dimensions.get("window");

export default function JoggingQuest() {
  const [activeQuest] = useState<QuestData>(() => getRandomQuest());
  const [mode, setMode] = useState<QuestMode>("WALKING");
  const [story, setStory] = useState(
    activeQuest.milestones[0]?.text || "SYSTEM INITIALIZED...",
  );

  const [isTracking, setIsTracking] = useState(false);
  const [distance, setDistance] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [location, setLocation] = useState<any>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const locationWatcher = useRef<Location.LocationSubscription | null>(null);
  const modeRef = useRef<QuestMode>("WALKING");

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

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
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

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

  const toggleTracking = async () => {
    if (isTracking) {
      setIsTracking(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (locationWatcher.current) locationWatcher.current.remove();
      return;
    }

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    setIsTracking(true);
    timerRef.current = setInterval(() => setSeconds((prev) => prev + 1), 1000);

    locationWatcher.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 2000,
        distanceInterval: 5,
      },
      (newLocation) => {
        if (modeRef.current !== "WALKING") return;
        const { latitude, longitude } = newLocation.coords;
        setLocation(newLocation);
        setRouteCoordinates((prev) => {
          if (prev.length > 0) {
            const last = prev[prev.length - 1];
            handleMovement(
              calculateDistance(
                last.latitude,
                last.longitude,
                latitude,
                longitude,
              ),
            );
          }
          return [...prev, { latitude, longitude }];
        });
      },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER HUD */}
      <View style={styles.headerHUD}>
        <View style={styles.glitchContainer}>
          <Text style={styles.questTitle}>
            {activeQuest.title.toUpperCase()}
          </Text>
          <View style={styles.lineDecor} />
        </View>
      </View>

      <View style={styles.visualArea}>
        {mode === "BATTLE" ? (
          <BattleView
            onVictory={() => {
              setMode("WALKING");
              setStory("THREAT NEUTRALIZED. RESUME SPRINT.");
            }}
          />
        ) : (
          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={StyleSheet.absoluteFillObject}
              customMapStyle={mapStyle}
              showsUserLocation={true}
              followsUserLocation={true}
              initialRegion={{
                latitude: location ? location.coords.latitude : 37.78825,
                longitude: location ? location.coords.longitude : -122.4324,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <Polyline
                coordinates={routeCoordinates}
                strokeColor="#00F0FF"
                strokeWidth={5}
              />
            </MapView>
            <View style={styles.scanline} />
          </View>
        )}
      </View>

      {/* TERMINAL STORY LOG */}
      <View style={styles.terminalContainer}>
        <View style={styles.terminalHeader}>
          <Text style={styles.terminalHeaderText}>LIVE_FEED.EXE</Text>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isTracking ? "#00F0FF" : "#FF0055" },
            ]}
          />
        </View>
        <ScrollView style={styles.terminalBody}>
          <Text style={styles.storyText}>
            <Text style={styles.prompt}>&gt; </Text>
            {story}
          </Text>
        </ScrollView>
      </View>

      {/* HUD DASHBOARD */}
      <View style={styles.dashboard}>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>DISTANCE</Text>
            <View style={styles.valueWrapper}>
              <Text style={styles.statValue}>{distance.toFixed(2)}</Text>
              <Text style={styles.unitText}>KM</Text>
            </View>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>ELAPSED_TIME</Text>
            <Text style={[styles.statValue, { color: "#BCF2F6" }]}>
              {formatTime(seconds)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.mainButton,
            isTracking ? styles.btnAbort : styles.btnInit,
          ]}
          onPress={toggleTracking}
        >
          <Text style={styles.buttonText}>
            {isTracking ? "ABORT_MISSION" : "INITIALIZE_QUEST"}
          </Text>
          <View style={styles.buttonCorner} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#000d1a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#00F0FF" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#001f3f" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#00050a" }],
  },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#00050a" },
  headerHUD: { padding: 20, paddingTop: 10, alignItems: "center" },
  glitchContainer: { width: "100%", alignItems: "center" },
  questTitle: {
    color: "#00F0FF",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 4,
    textShadowColor: "rgba(0, 240, 255, 0.7)",
    textShadowRadius: 10,
  },
  lineDecor: {
    height: 2,
    width: "60%",
    backgroundColor: "#00F0FF",
    marginTop: 5,
    opacity: 0.5,
  },
  visualArea: {
    height: "38%",
    marginHorizontal: 15,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#00F0FF",
    overflow: "hidden",
    backgroundColor: "#000",
  },
  mapContainer: { flex: 1 },
  scanline: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "rgba(0, 240, 255, 0.1)",
    zIndex: 10,
  },
  terminalContainer: {
    flex: 1,
    margin: 15,
    backgroundColor: "rgba(0, 20, 40, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(0, 240, 255, 0.3)",
    padding: 10,
  },
  terminalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 240, 255, 0.2)",
    marginBottom: 8,
    paddingBottom: 4,
  },
  terminalHeaderText: {
    color: "#00F0FF",
    fontSize: 10,
    fontWeight: "bold",
    opacity: 0.6,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  terminalBody: { flex: 1 },
  prompt: { color: "#00F0FF", fontWeight: "bold" },
  storyText: {
    color: "#BCF2F6",
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "monospace",
  },
  dashboard: { padding: 20, paddingBottom: 30 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  statBox: { width: "48%" },
  statLabel: {
    color: "#00F0FF",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
    opacity: 0.7,
    marginBottom: 4,
  },
  valueWrapper: { flexDirection: "row", alignItems: "baseline" },
  statValue: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "900",
    fontFamily: "monospace",
  },
  unitText: {
    color: "#00F0FF",
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "bold",
  },
  mainButton: {
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    position: "relative",
  },
  btnInit: {
    borderColor: "#00F0FF",
    backgroundColor: "rgba(0, 240, 255, 0.1)",
  },
  btnAbort: {
    borderColor: "#FF0055",
    backgroundColor: "rgba(255, 0, 85, 0.1)",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 3,
  },
  buttonCorner: {
    position: "absolute",
    bottom: -5,
    right: -5,
    width: 15,
    height: 15,
    backgroundColor: "#00050a",
  },
});
