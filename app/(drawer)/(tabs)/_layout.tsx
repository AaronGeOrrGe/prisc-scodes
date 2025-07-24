import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import TabBar from '../../../components/TabBar'; // Import the new custom tab bar

export default function TabsLayout() {
  const router = useRouter();

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />} // Use the custom tab bar
      screenOptions={({ route }) => ({
        headerLeft: () => null,
        headerRight: () =>
          route.name !== 'mirror' ? (
            <TouchableOpacity onPress={() => router.push('/components/search')} style={{ marginRight: 16 }}>
              <Ionicons name="search-outline" size={24} color="#000" />
            </TouchableOpacity>
          ) : null,
      })}
    > 
      <Tabs.Screen name="mirror" options={{ headerShown: false, title: 'Mirror' }} />
      <Tabs.Screen
        name="ToolsScreen"
        options={{
          title: 'TOOLS',
          headerTitleAlign: 'left',
          headerShown: true,
          headerStyle: { backgroundColor: '#A07BB7' },
          headerTitleStyle: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 26,
            textTransform: 'uppercase',
            letterSpacing: 1,
          },
          headerLeft: () => null,
        }}
      />
      <Tabs.Screen
        name="CanvasScreen"
        options={{
          title: 'CANVAS',
          headerTitleAlign: 'left',
          headerShown: true,
          headerStyle: { backgroundColor: '#A07BB7' },
          headerTitleStyle: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 26,
            textTransform: 'uppercase',
            letterSpacing: 1,
          },
          headerLeft: () => null,
        }}
      />
      <Tabs.Screen name="Templates" options={{ headerShown: false }} />
      <Tabs.Screen
        name="LayerScreen"
        options={{
          title: 'LAYERS',
          headerTitleAlign: 'left',
          headerShown: true,
          headerStyle: { backgroundColor: '#A07BB7' },
          headerTitleStyle: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 26,
            textTransform: 'uppercase',
            letterSpacing: 1,
          },
          headerLeft: () => null,
        }}
      />
    </Tabs>
  );
}
