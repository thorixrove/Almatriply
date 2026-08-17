import { NativeTabs, Label, Icon } from 'expo-router/unstable-native-tabs';
import {Feather} from "@expo/vector-icons"
import { Tabs } from 'expo-router';


const useNativeTabs = false

export default function TabLayout() {
    if (useNativeTabs) {
  return (
    <NativeTabs
        backgroundColor="#0B0E14"
        tintColor="#4A9EFF"
        iconColor={{ default: "#5C5F68", selected: "#4A9EFF" }}
        labelStyle={{
        default: { color: "#5C5F68" },
        selected: { color: "#4A9EFF" },
        }}
    >
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf="house.fill"/>
      </NativeTabs.Trigger>

     <NativeTabs.Trigger name="search">
        <Icon sf="magnifyingglass" />
        <Label>Search</Label>
      </NativeTabs.Trigger>

        <NativeTabs.Trigger name="create">
          <Icon sf="plus.circle.fill" />
          <Label>Add Property</Label>
        </NativeTabs.Trigger>

      <NativeTabs.Trigger name="saved">
        <Icon sf="heart.fill" />
        <Label>Saved</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <Icon sf="person.fill" />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4A9EFF",
        tabBarInactiveTintColor: "#5C5F68",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E8E6DF",
          paddingTop: 4,
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
            <Feather name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Add Property",
          tabBarIcon: ({ color, size }) => (
            <Feather name="plus-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
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