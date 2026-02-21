import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { GameStyles } from "../../src/constants/theme";
export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("System Error", "All data fields must be populated.");
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
        error.response?.data?.message || "Connection to server lost.";
      Alert.alert("Access Denied", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Tip: Use a dark background color or a subtle dark pattern image
    <View className={GameStyles.container}>
      {/* Game Title Area */}
      <View className="mb-12">
        <Text className={GameStyles.headerText}>GAME TITLE</Text>
        <View className="h-1 w-24 bg-cyan-500 self-center mt-1 rounded-full shadow-sm shadow-cyan-400" />
      </View>

      <View className={GameStyles.card}>
        <Text className={GameStyles.subText}>Authentication Required</Text>

        <TextInput
          placeholder="USER EMAIL"
          placeholderTextColor="#64748b"
          autoCapitalize="none"
          keyboardType="email-address"
          className={GameStyles.input}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="ACCESS KEY"
          placeholderTextColor="#64748b"
          className={GameStyles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
          className={`${GameStyles.primaryBtn} ${loading ? GameStyles.primaryBtnDisabled : ""}`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className={GameStyles.btnText}>INITIALIZE</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text className="text-slate-400 text-center mt-2 text-sm">
            NEW PLAYER?{" "}
            <Text className="text-cyan-400 font-bold">CREATE ACCOUNT</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.back()} className="mt-8">
        <Text className="text-slate-500 uppercase tracking-widest text-xs font-bold">
          Return to Main
        </Text>
      </TouchableOpacity>
    </View>
  );
}
