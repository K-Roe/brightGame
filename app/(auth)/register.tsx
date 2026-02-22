import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../../services/api";

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [weight, setWeight] = useState(""); // Adding starting weight for your goal
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !weight) {
      Alert.alert(
        "Quest Error",
        "All scrolls must be filled before starting your journey.",
      );
      return;
    }

    setLoading(true);

    try {
      // Laravel expects: name, email, password, password_confirmation
      // We are also sending 'starting_weight' to save in your DB
      const response = await api.post("/register", {
        name: email.split("@")[0],
        email: email,
        password: password,
        password_confirmation: password,
        starting_weight: weight,
      });

      if (response.data.token) {
        await AsyncStorage.setItem("user-token", response.data.token);
      }

      Alert.alert(
        "Welcome, Hero!",
        "Your journey with BrightQuest begins now.",
      );
      router.replace("/(main)");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "The gates are blocked.";
      Alert.alert("Enrollment Failed", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerArea}>
          <Text style={styles.headerText}>
            JOIN THE <Text style={{ color: "#ffd700" }}>FELLOWSHIP</Text>
          </Text>
          <Text style={styles.flavorText}>
            Step out of the shadows and into the light.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>EMAIL ADDRESS</Text>
          <TextInput
            placeholder="hero@realm.com"
            placeholderTextColor="#475569"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>CHOOSE A PASSWORD</Text>
          <TextInput
            placeholder="********"
            placeholderTextColor="#475569"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.label}>STARTING WEIGHT (LBS/KG)</Text>
          <TextInput
            placeholder="0"
            placeholderTextColor="#475569"
            keyboardType="numeric"
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
          />
          <Text style={styles.hintText}>
            This will be your "Level 1" starting stat.
          </Text>

          <TouchableOpacity
            onPress={handleSignUp}
            disabled={loading}
            activeOpacity={0.8}
            style={[styles.primaryBtn, loading && styles.disabledBtn]}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.btnText}>BEGIN MY QUEST</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.loginLinkArea}
          >
            <Text style={styles.loginText}>
              ALREADY A HERO? <Text style={styles.loginHighlight}>LOGIN</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f1a",
  },
  scrollContainer: {
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  headerArea: {
    marginBottom: 30,
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 1,
  },
  flavorText: {
    color: "#64748b",
    fontSize: 14,
    marginTop: 5,
  },
  card: {
    width: "100%",
    backgroundColor: "#1c1c2e",
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.1)",
  },
  label: {
    color: "#ffd700",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#0f0f1a",
    color: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#334155",
  },
  hintText: {
    color: "#475569",
    fontSize: 11,
    marginBottom: 20,
    marginLeft: 4,
    fontStyle: "italic",
  },
  primaryBtn: {
    backgroundColor: "#1e90ff",
    padding: 18,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
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
  loginLinkArea: {
    marginTop: 20,
  },
  loginText: {
    color: "#64748b",
    textAlign: "center",
    fontSize: 13,
  },
  loginHighlight: {
    color: "#ffd700",
    fontWeight: "bold",
  },
});
