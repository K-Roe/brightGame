import { StyleSheet, Text, View } from "react-native";

const StatBar = ({ label, value, color }) => {
  const maxValue = 100;
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <View style={styles.statBlock}>
      <View style={styles.statInfo}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <View style={styles.statBarBg}>
        <View
          style={[
            styles.statBarFill,
            { width: `${percentage}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
};

export default function CharacterCard({ character }) {
  if (!character) return null;

  const xpProgress = (character.xp / (character.level * 1000)) * 100;

  return (
    <View style={styles.statsCard}>
      <Text style={styles.statsTitle}>
        {character.name} - LVL {character.level}{" "}
        {character.hero_class?.toUpperCase()}
      </Text>

      {/* XP Bar Overlay */}
      <View style={styles.xpBarContainer}>
        <View style={[styles.xpBarFill, { width: `${xpProgress}%` }]} />
      </View>
      <Text style={styles.xpText}>
        XP: {character.xp} / {character.level * 1000}
      </Text>

      <Text style={styles.statsText}>🔥 {character.weightLost}kg Melted</Text>

      <Text style={styles.statsSubText}>
        BMI: {character.bmi} (
        {parseFloat(character.bmi) > 25 ? "Overweight" : "Healthy"})
      </Text>

      <View style={styles.statsContainer}>
        <Text style={styles.descriptionText}>
          "{character.desc || "No description yet."}"
        </Text>
        <View style={styles.statRow}>
          <StatBar label="STR" value={character.str} color="#ff4444" />
          <StatBar label="DEX" value={character.dex} color="#44ff44" />
        </View>
        <View style={styles.statRow}>
          <StatBar label="AGI" value={character.agi} color="#1e90ff" />
          <StatBar label="INT" value={character.int} color="#8a2be2" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsCard: {
    backgroundColor: "#1c1c2e",
    width: "100%",
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ffd700",
    marginBottom: 20,
  },
  statsTitle: { color: "#ffd700", fontSize: 18, fontWeight: "bold" },
  xpBarContainer: {
    height: 4,
    backgroundColor: "#333",
    marginTop: 8,
    borderRadius: 2,
  },
  xpBarFill: { height: "100%", backgroundColor: "#ffd700", borderRadius: 2 },
  xpText: { color: "#aaa", fontSize: 10, marginTop: 4 },
  statsText: { color: "#fff", fontSize: 22, marginVertical: 8 },
  statsSubText: { color: "#aaa", fontSize: 13 },
  statsContainer: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 12,
  },
  descriptionText: {
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 12,
    fontSize: 12,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statBlock: { width: "48%" },
  statInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  statLabel: { color: "#ffd700", fontSize: 10, fontWeight: "bold" },
  statValue: { color: "#fff", fontSize: 10 },
  statBarBg: {
    height: 6,
    backgroundColor: "#0f0f1a",
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: "#334155",
  },
  statBarFill: { height: "100%", borderRadius: 3 },
});
