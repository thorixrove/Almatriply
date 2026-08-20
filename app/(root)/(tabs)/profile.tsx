import { useAuth, useUser } from "@clerk/expo"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { useRouter } from "expo-router"
import { useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function ProfileScreen() {
  const { user, isLoaded } = useUser()
  const { signOut } = useAuth()
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const isDark = useColorScheme() === "dark"

  const handleSignOut = async () => {
    try {
      await signOut()
      router.replace("/sign-in")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleUpdateProfileImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to update your profile picture."
        )
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true
      })

      if (result.canceled) return

      setIsUpdating(true)

      const base64Image = result.assets[0].base64
      const uri = result.assets[0].uri
      const filename = uri.split("/").pop() || "profile.jpg"
      const match = /\.(\w+)$/.exec(filename)
      const mimeType = match ? `image/${match[1]}` : "image/jpeg"
      const dataUrl = `data:${mimeType};base64,${base64Image}`

      await user?.setProfileImage({ file: dataUrl })
      Alert.alert("Success", "Profile picture updated successfully!")
    } catch (error) {
      console.error("Error updating profile image:", error)
      Alert.alert(
        "Error",
        "Failed to update profile picture. Please try again."
      )
    } finally {
      setIsUpdating(false)
    }
  }

  if (!isLoaded || !user) {
    return (
      <SafeAreaView
        className={`flex-1 items-center justify-center ${
          isDark ? "bg-slate-950" : "bg-white"
        }`}
      >
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView
      edges={["top"]}
      className={`flex-1 ${isDark ? "bg-slate-950" : "bg-gray-50"}`}
    >
      <View className="items-center py-8">
        <View className="relative">
          <Image
            source={{ uri: user.imageUrl }}
            className="w-24 h-24 rounded-full mb-4"
          />
          <TouchableOpacity
            onPress={handleUpdateProfileImage}
            disabled={isUpdating}
            className="absolute bottom-3 right-0 bg-blue-600 rounded-full p-2"
          >
            {isUpdating ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="camera" size={16} color="white" />
            )}
          </TouchableOpacity>
        </View>
        <Text className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
          {user.firstName} {user.lastName}
        </Text>
        <Text className={`mt-1 ${isDark ? "text-slate-300" : "text-gray-500"}`}>
          {user.emailAddresses[0].emailAddress}
        </Text>
      </View>

      <View className="px-6 gap-2">
        <MenuItem
          icon="bookmark-outline"
          label="Saved Properties"
          onPress={() => router.push("/(root)/(tabs)/saved")}
          darkMode={isDark}
        />
        <MenuItem
          icon="notifications-outline"
          label="Notifications"
          onPress={() => router.push("/(root)/notifications")}
          darkMode={isDark}
        />
        <MenuItem
          icon="settings-outline"
          label="Settings"
          onPress={() => router.push("/(root)/settings")}
          darkMode={isDark}
        />
        <MenuItem
          icon="help-circle-outline"
          label="Help & Support"
          onPress={() =>
            Linking.openURL(
              "mailto:thorixrover@gmail.com?subject=Help%20%26%20Support%20-%20Kribb%20App"
            )
          }
          darkMode={isDark}
        />
      </View>

      <View className="px-6 mt-auto mb-8">
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Log Out", "Are you sure you want to log out?", [
              { text: "No", style: "cancel" },
              { text: "Yes", style: "destructive", onPress: handleSignOut }
            ])
          }
          className={`flex-row items-center justify-center gap-2 py-4 rounded-2xl border ${
            isDark
              ? "bg-red-950/40 border-red-900"
              : "bg-red-50 border-red-100"
          }`}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text className="text-red-500 font-semibold text-base">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

function MenuItem({
  icon,
  label,
  onPress,
  darkMode
}: {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  onPress?: () => void
  darkMode: boolean
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center gap-4 px-4 py-4 rounded-2xl ${
        darkMode ? "bg-slate-900" : "bg-gray-50"
      }`}
    >
      <Ionicons
        name={icon}
        size={22}
        color={darkMode ? "#CBD5E1" : "#6B7280"}
      />
      <Text
        className={`flex-1 font-medium text-base ${
          darkMode ? "text-slate-200" : "text-gray-700"
        }`}
      >
        {label}
      </Text>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={darkMode ? "#64748B" : "#D1D5DB"}
      />
    </TouchableOpacity>
  )
}