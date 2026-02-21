import AsyncStorage from "@react-native-async-storage/async-storage";
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
import api from "../../services/api"; // Import the axios instance we created
import { GameStyles } from "../../src/constants/theme";

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (email === "" || password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      // 1. Hit your local Laravel API
      // Laravel Breeze API expects: name, email, password, password_confirmation
      const response = await api.post("/register", {
        name: email.split("@")[0],
        email: email,
        password: password,
        password_confirmation: password,
      });

      // 2. If Laravel returns a token (Sanctum), save it
      if (response.data.token) {
        await AsyncStorage.setItem("user-token", response.data.token);
      }

      console.log("User registered with Laravel!");
      Alert.alert("Success!", "Account created successfully.");

      // 3. Navigate to the main game
      router.replace("/(main)");
    } catch (error) {
      // 4. Handle Laravel validation errors (e.g., email already taken)
      const errorMsg = error.response?.data?.message || "Registration failed";
      console.error("Laravel Error:", error.response?.data);
      Alert.alert("Registration Failed", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className={GameStyles.container}>
      <View className={GameStyles.card}>
        <Text className={GameStyles.headerText}>Create Account</Text>

        <Text className={GameStyles.subText}>Join the game!</Text>

        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          className={GameStyles.input}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Password"
          className={GameStyles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={handleSignUp}
          disabled={loading}
          className={`${GameStyles.primaryBtn} ${loading ? GameStyles.primaryBtnDisabled : ""}`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className={GameStyles.btnText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-blue-600 text-center">
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
