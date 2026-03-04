import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Polyline } from "react-native-maps";

// Internal Imports
import BattleView from "@/components/quest/BattleView";
import { getRandomQuest } from "@/data/quests";
import { QuestData, QuestMode } from "@/types/quest";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const COLORS = {
  background: "#0f0f1a",
  card: "#1c1c2e",
  primaryGold: "#ffd700",
  textWhite: "#ffffff",
  textMuted: "rgba(255, 255, 255, 0.7)",
  danger: "#8b0000",
  mapRoads: "#2a2a40",
};

export default function JoggingQuest() {
  const [activeQuest] = useState<QuestData>(() => getRandomQuest());
  const [mode, setMode] = useState<QuestMode>("WALKING");
  const [story, setStory] = useState(
    activeQuest.milestones[0]?.text || "JOURNEY BEGINS...",
  );

  const [isTracking, setIsTracking] = useState(false);
  const [distance, setDistance] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [location, setLocation] = useState<any>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);

  // Permission States
  const [permissionStatus, setPermissionStatus] =
    useState<Location.PermissionStatus | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const locationWatcher = useRef<Location.LocationSubscription | null>(null);
  const modeRef = useRef<QuestMode>("WALKING");

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // Check permission on mount
  useEffect(() => {
    (async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      setPermissionStatus(status);
    })();
  }, []);

  const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setPermissionStatus(status);
  };

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

    if (permissionStatus !== Location.PermissionStatus.GRANTED) {
      await requestPermission();
      return;
    }

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

  // --- PERMISSION OVERLAY ---
  if (permissionStatus === null) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color={COLORS.primaryGold} size="large" />
      </View>
    );
  }

  if (permissionStatus !== Location.PermissionStatus.GRANTED) {
    return (
      <View style={[styles.container, styles.centered, { padding: 40 }]}>
        <Text style={styles.questTitle}>PERMISSIONS REQUIRED</Text>
        <Text
          style={[
            styles.storyText,
            { textAlign: "center", marginTop: 20, marginBottom: 30 },
          ]}
        >
          To track your journey through the realm, you must grant access to your
          location.
        </Text>
        <TouchableOpacity
          style={[styles.mainButton, styles.btnInit, { width: "100%" }]}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>GRANT ACCESS</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.headerHUD}>
        <Text style={styles.questTitle}>{activeQuest.title.toUpperCase()}</Text>
        <View style={styles.lineDecor} />
      </View>

      {/* MAP / BATTLE AREA */}
      <View style={styles.visualArea}>
        {mode === "BATTLE" ? (
          <BattleView
            onVictory={() => {
              setMode("WALKING");
              setStory("FOE DEFEATED. CONTINUE YOUR JOURNEY.");
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
              latitude: location ? location.coords.latitude : 37.78825,
              longitude: location ? location.coords.longitude : -122.4324,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <Polyline
              coordinates={routeCoordinates}
              strokeColor={COLORS.primaryGold}
              strokeWidth={5}
            />
          </MapView>
        )}
      </View>

      {/* STORY LOG */}
      <View style={styles.terminalContainer}>
        <View style={styles.terminalHeader}>
          <Text style={styles.terminalHeaderText}>CHRONICLE_LOG</Text>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: isTracking
                  ? COLORS.primaryGold
                  : COLORS.danger,
              },
            ]}
          />
        </View>
        <ScrollView
          style={styles.terminalBody}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.storyText}>
            <Text style={styles.prompt}>» </Text>
            {story}
          </Text>
        </ScrollView>
      </View>

      {/* STATS & BUTTON */}
      <View style={styles.dashboard}>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>STRETCH_COVERED</Text>
            <View style={styles.valueWrapper}>
              <Text style={styles.statValue}>{distance.toFixed(2)}</Text>
              <Text style={styles.unitText}>KM</Text>
            </View>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>TIME_ELAPSED</Text>
            <Text style={[styles.statValue, { color: COLORS.textWhite }]}>
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
            {isTracking ? "ABANDON QUEST" : "COMMENCE QUEST"}
          </Text>
          <View style={styles.buttonCorner} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#0f0f1a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#ffd700" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1c1c2e" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#000000" }],
  },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: { justifyContent: "center", alignItems: "center" },
  headerHUD: { paddingVertical: 15, alignItems: "center" },
  questTitle: {
    color: COLORS.primaryGold,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 4,
    textShadowColor: "rgba(255, 215, 0, 0.4)",
    textShadowRadius: 10,
  },
  lineDecor: {
    height: 2,
    width: "40%",
    backgroundColor: COLORS.primaryGold,
    marginTop: 5,
    opacity: 0.5,
  },
  visualArea: {
    flex: 1.2, // Gives map more room while staying flexible
    marginHorizontal: 15,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: COLORS.primaryGold,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  terminalContainer: {
    flex: 0.8, // Adjusts based on screen height
    margin: 15,
    backgroundColor: COLORS.card,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.2)",
    padding: 15,
  },
  terminalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 215, 0, 0.1)",
    marginBottom: 8,
    paddingBottom: 4,
  },
  terminalHeaderText: {
    color: COLORS.primaryGold,
    fontSize: 10,
    fontWeight: "bold",
    opacity: 0.8,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  terminalBody: { flex: 1 },
  prompt: { color: COLORS.primaryGold, fontWeight: "bold" },
  storyText: {
    color: COLORS.textWhite,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "serif",
  },
  dashboard: { paddingHorizontal: 20, paddingBottom: 20 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  statBox: { width: "48%" },
  statLabel: {
    color: COLORS.primaryGold,
    fontSize: 10,
    fontWeight: "bold",
    opacity: 0.7,
    marginBottom: 4,
  },
  valueWrapper: { flexDirection: "row", alignItems: "baseline" },
  statValue: { color: "#FFF", fontSize: 28, fontWeight: "900" },
  unitText: {
    color: COLORS.primaryGold,
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "bold",
  },
  mainButton: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 2,
  },
  btnInit: {
    borderColor: COLORS.primaryGold,
    backgroundColor: "rgba(255, 215, 0, 0.05)",
  },
  btnAbort: {
    borderColor: COLORS.danger,
    backgroundColor: "rgba(139, 0, 0, 0.1)",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
  },
  buttonCorner: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 15,
    height: 15,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 10,
  },
});
