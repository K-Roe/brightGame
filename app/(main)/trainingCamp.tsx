import MenuButton from "@/components/MenuButton";
import { useRouter } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function TrainingCamp() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>
            TRAINING <Text style={{ color: "#8a2be2" }}>CAMP</Text>
          </Text>
          <Text style={styles.subtitle}>
            Forge your body into a weapon of light.
          </Text>
        </View>

        {/* EXERCISE QUESTS */}
        <MenuButton
          title="TRIAL OF STRENGTH"
          subtitle="Complete 20 Push-ups"
          emoji="💪"
          backgroundColor="#1c1c2e"
          onPress={() =>
            router.push({
              pathname: "/PushUpQuest", // Ensure this matches your filename
              params: { goal: 20, name: "Trial of Strength" },
            })
          }
        />

        <MenuButton
          title="RITUAL OF STAMINA"
          subtitle="Hold Plank for 60 Seconds"
          emoji="⏳"
          backgroundColor="#1c1c2e"
          onPress={() =>
            router.push({
              pathname: "/PlankQuest", // Ensure this matches your filename
              params: { goal: 60, name: "Ritual of Stamina" },
            })
          }
        />

        <MenuButton
          title="CORE FORTIFICATION"
          subtitle="Complete 30 Sit-ups"
          emoji="🧘"
          backgroundColor="#1c1c2e"
          onPress={() =>
            router.push({
              pathname: "/SitUpQuest",
              params: { goal: 30, name: "Core Fortification" },
            })
          }
        />

        {/* BACK BUTTON */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>RETURN TO TOWN</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f1a" },
  scrollContainer: { alignItems: "center", paddingVertical: 60 },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 2,
  },
  subtitle: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    marginTop: 5,
    fontStyle: "italic",
  },
  backButton: {
    marginTop: 40,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 8,
    width: "85%",
  },
  backButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
