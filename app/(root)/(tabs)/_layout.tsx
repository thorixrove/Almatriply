
import { useUserStore } from '@/store/useStore';
import { Feather } from "@expo/vector-icons";
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

function AndroidTabs() {
  const isAdmin = useUserStore((state) => state.isAdmin)
  const savedCount = useUserStore((state) => state.savedCount)
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? "#7DB7FF" : "#4A9EFF",
        tabBarInactiveTintColor: isDark ? "#A0A4AE" : "#5C5F68",
        tabBarStyle: {
          backgroundColor: isDark ? "#121212" : "#FFFFFF",
          borderTopColor: isDark ? "#2C2C2C" : "#E8E6DF",
          paddingTop: 10,
          height: 100,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Add",
          href: isAdmin ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Feather name="plus-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarBadge: savedCount > 0 ? savedCount : undefined,
          tabBarIcon: ({ color, size }) => (
            <Feather name="bookmark" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function TabsLayout() {
  return <AndroidTabs/>
}