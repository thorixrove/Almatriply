import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Constants from "expo-constants"
import { useRouter } from "expo-router"
import { useColorScheme } from "nativewind"
import { useEffect, useState } from "react"
import { Linking, Switch, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const PUSH_NOTIF_KEY = "settings_push_notifications"
const DARK_MODE_KEY = "settings_dark_mode"

export default function SettingsScreen() {
  const router = useRouter()
  const { colorScheme, setColorScheme } = useColorScheme()

  const [pushEnabled, setPushEnabled] = useState(true)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    loadPreferences()
  }, [])

  const loadPreferences = async () => {
    const storedPush = await AsyncStorage.getItem(PUSH_NOTIF_KEY)
    const storedDark = await AsyncStorage.getItem(DARK_MODE_KEY)

    if (storedPush !== null) setPushEnabled(storedPush === "true")
    if (storedDark !== null) setColorScheme(storedDark === "dark" ? "dark" : "light")

    setLoaded(true)
  }

  const togglePush = async (value: boolean) => {
    setPushEnabled(value)
    await AsyncStorage.setItem(PUSH_NOTIF_KEY, String(value))
  }

  const toggleDarkMode = async (value: boolean) => {
    const next = value ? "dark" : "light"
    setColorScheme(next)
    await AsyncStorage.setItem(DARK_MODE_KEY, next)
  }

  const appVersion = Constants.expoConfig?.version ?? "1.0.0"

  if (!loaded) return null

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-2 pb-4 gap-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={colorScheme === "dark" ? "#F9FAFB" : "#111827"}
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Settings
        </Text>
      </View>

      <View className="px-5 gap-6">
        {/* Preferences */}
        <View>
          <Text className="text-xs font-semibold text-gray-400 uppercase mb-2 px-1">
            Preferences
          </Text>
          <View className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
            <SettingRow
              icon="notifications-outline"
              label="Push Notifications"
              right={
                <Switch value={pushEnabled} onValueChange={togglePush} />
              }
            />
            <View className="h-px bg-gray-100 dark:bg-gray-800 ml-14" />
            <SettingRow
              icon="moon-outline"
              label="Dark Mode"
              right={
                <Switch
                  value={colorScheme === "dark"}
                  onValueChange={toggleDarkMode}
                />
              }
            />
          </View>
        </View>

        {/* About */}
        <View>
          <Text className="text-xs font-semibold text-gray-400 uppercase mb-2 px-1">
            About
          </Text>
          <View className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
            <SettingRow
              icon="document-text-outline"
              label="Privacy Policy"
              chevron
              onPress={() =>
                Linking.openURL("https://your-privacy-policy-url.com")
              }
            />
            <View className="h-px bg-gray-100 dark:bg-gray-800 ml-14" />
            <SettingRow
              icon="reader-outline"
              label="Terms of Service"
              chevron
              onPress={() =>
                Linking.openURL("https://your-terms-url.com")
              }
            />
            <View className="h-px bg-gray-100 dark:bg-gray-800 ml-14" />
            <SettingRow
              icon="information-circle-outline"
              label="App Version"
              right={
                <Text className="text-gray-400 text-sm">{appVersion}</Text>
              }
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

function SettingRow({
  icon,
  label,
  onPress,
  right,
  chevron,
}: {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  onPress?: () => void
  right?: React.ReactNode
  chevron?: boolean
}) {
  const Wrapper = onPress ? TouchableOpacity : View

  return (
    <Wrapper
      onPress={onPress}
      className="flex-row items-center gap-3 px-4 py-4"
    >
      <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center">
        <Ionicons name={icon} size={17} color="#2563EB" />
      </View>
      <Text className="flex-1 text-gray-800 dark:text-gray-100 font-medium text-base">
        {label}
      </Text>
      {right}
      {chevron && (
        <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
      )}
    </Wrapper>
  )
}