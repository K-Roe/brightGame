import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        "Quest Error",
        "Your credentials are required to enter the realm.",
      );
      return;
    }
    setLoading(true);
    try {
      const response = await api.post("/login", { email, password });
      if (response.data.token) {
        await login(response.data.token);
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "The gates are sealed. Check your connection.";
      Alert.alert("Access Denied", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Game Title Area */}
      <View style={styles.headerArea}>
        <Text style={styles.headerText}>
          BRIGHT<Text style={{ color: "#ffd700" }}>QUEST</Text>
        </Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.card}>
        <Text style={styles.subText}>IDENTIFY YOURSELF, TRAVELER</Text>

        <TextInput
          placeholder="HERO'S EMAIL"
          placeholderTextColor="#64748b"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="PLAYER KEY"
          placeholderTextColor="#64748b"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
          style={[styles.primaryBtn, loading && styles.disabledBtn]}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.btnText}>ENTER REALM</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.registerText}>
            NEW TO THE QUEST?{" "}
            <Text style={styles.registerLink}>JOIN THE FELLOWSHIP</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backBtnText}>RETURN TO START</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f1a", // Deep space/fantasy blue
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerArea: {
    marginBottom: 40,
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 2,
  },
  divider: {
    height: 3,
    width: 120,
    backgroundColor: "#ffd700",
    marginTop: 8,
    borderRadius: 2,
    // Note: Shadow properties work differently on Android/iOS
    shadowColor: "#ffd700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  card: {
    width: "100%",
    backgroundColor: "#1c1c2e",
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.2)",
  },
  subText: {
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 25,
    fontSize: 12,
    letterSpacing: 1.5,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#0f0f1a",
    color: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#334155",
  },
  primaryBtn: {
    backgroundColor: "#1e90ff",
    padding: 18,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
    shadowColor: "#1e90ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  disabledBtn: {
    backgroundColor: "#475569",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  registerText: {
    color: "#64748b",
    textAlign: "center",
    marginTop: 20,
    fontSize: 13,
  },
  registerLink: {
    color: "#ffd700",
    fontWeight: "bold",
  },
  backBtn: {
    marginTop: 30,
  },
  backBtnText: {
    color: "#475569",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 2,
  },
});
