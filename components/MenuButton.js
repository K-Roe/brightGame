import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function MenuButton({
  onPress,
  title,
  subtitle,
  emoji,
  backgroundColor = "#1e90ff", // Default blue if no color is passed
}) {
  return (
    <TouchableOpacity
      style={[styles.mainButton, { backgroundColor }]}
      onPress={onPress}
    >
      <Text style={styles.buttonEmoji}>{emoji}</Text>
      <View>
        <Text style={styles.mainButtonText}>{title}</Text>
        <Text style={styles.subText}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainButton: {
    flexDirection: "row",
    width: "85%",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonEmoji: { fontSize: 30, marginRight: 15 },
  mainButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  subText: { color: "rgba(255,255,255,0.7)", fontSize: 12 },
});
