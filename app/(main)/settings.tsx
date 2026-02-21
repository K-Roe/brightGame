import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function SettingsScreen() {
  // const { id } = useLocalSearchParams<{ id: string }>(); // Typed params
  const router = useRouter();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings for User: </Text>
      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
}