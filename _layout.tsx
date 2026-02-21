import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import './globals.css';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#888',
        
        tabBarStyle: {
          backgroundColor: '#121212', 
          borderTopWidth: 1,
          borderTopColor: '#333', 
          paddingBottom: 5,      
          height: 60,
        },

        headerStyle: {
          backgroundColor: '#121212',
        },
        headerTintColor: '#fff', 
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
        
        headerShadowVisible: false, 
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="todoList"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="check-square" color={color} />,
        }}
      />
    </Tabs>
  );
}