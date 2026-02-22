import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BattleView({ onVictory }: { onVictory: () => void }) {
  return (
    <View style={styles.container}>
      <Text style={styles.monster}>👹</Text>
      <Text style={styles.alert}>SHADOW CREEPER AMBUSH!</Text>
      <TouchableOpacity style={styles.attackBtn} onPress={onVictory}>
        <Text style={styles.attackText}>STRIKE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a0505",
  },
  monster: { fontSize: 80, marginBottom: 10 },
  alert: { color: "#ff4d4d", fontWeight: "bold", marginBottom: 20 },
  attackBtn: { padding: 15, backgroundColor: "#ff4d4d", borderRadius: 8 },
  attackText: { color: "#fff", fontWeight: "bold" },
});
