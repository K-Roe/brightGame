import { Stack, useRouter, useSegments } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import "./globals.css";

function RootLayoutNav() {
  const { authToken, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    Speech.getAvailableVoicesAsync().catch(() => {});
    Speech.speak("", { volume: 0 });

    const inAuthGroup = segments[0] === "(auth)";

    if (!authToken && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (authToken && inAuthGroup) {
      router.replace("/(main)");
    }
  }, [authToken, isLoading, segments]);

  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(main)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
