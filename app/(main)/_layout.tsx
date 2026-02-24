// app/(main)/_layout.tsx
import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen
        name="createCharacter"
        options={{ title: "Create Character" }}
      />
      <Stack.Screen name="quest" options={{ title: "Quest" }} />
      <Stack.Screen name="trainingCamp" options={{ title: "trainingCamp" }} />
      <Stack.Screen name="PushUpQuest" options={{ title: "PushUpQuest" }} />
      <Stack.Screen name="PlankQuest" options={{ title: "PlankQuest" }} />
      <Stack.Screen name="SitUpQuest" options={{ title: "SitUpQuest" }} />
    </Stack>
  );
}
