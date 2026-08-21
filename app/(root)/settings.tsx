import { Ionicons } from "@expo/vector-icons"
import Constants from "expo-constants"
import { useRouter } from "expo-router"
import { useColorScheme } from "nativewind"
import { useEffect, useState } from "react"
import { Alert, Switch, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDarkModeToggle } from "@/hooks/useDarkModeToggle"
import { usePushNotifications } from "@/hooks/usePushNotifications"
import { useSupabase } from "@/hooks/useSupabase"
import { useAuth } from "@clerk/expo"

export default function SettingsScreen() {
  const router = useRouter()
  const { colorScheme } = useColorScheme()
  // dark mode sekarang bersumber dari Supabase (per akun), bukan AsyncStorage
  const { darkMode, toggleDarkMode } = useDarkModeToggle()
  const { userId } = useAuth()
  const authSupabase = useSupabase()
  const { registerForPushNotifications, unregisterPushNotifications } =
    usePushNotifications()

  const [pushEnabled, setPushEnabled] = useState(false)
  const [pushLoading, setPushLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    loadPreferences()
  }, [userId])

  const loadPreferences = async () => {
    if (!userId) return
    const { data } = await authSupabase
      .from("users")
      .select("expo_push_token")
      .eq("clerk_id", userId)
      .single()

    setPushEnabled(!!data?.expo_push_token)
    setLoaded(true)
  }

  const togglePush = async (value: boolean) => {
    setPushLoading(true)

    if (value) {
      const granted = await registerForPushNotifications()
      if (!granted) {
        Alert.alert(
          "Izin Diperlukan",
          "Aktifkan izin notifikasi buat aplikasi ini di pengaturan HP kamu."
        )
        setPushLoading(false)
        return
      }
      setPushEnabled(true)
    } else {
      await unregisterPushNotifications()
      setPushEnabled(false)
    }

    setPushLoading(false)
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
                <Switch
                  value={pushEnabled}
                  onValueChange={togglePush}
                  disabled={pushLoading}
                />
              }
            />
            <View className="h-px bg-gray-100 dark:bg-gray-800 ml-14" />
            <SettingRow
              icon="moon-outline"
              label="Dark Mode"
              right={
                <Switch
                  value={darkMode}
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
              onPress={() => router.push("/(root)/privacy-policy")}
            />
            <View className="h-px bg-gray-100 dark:bg-gray-800 ml-14" />
            <SettingRow
              icon="reader-outline"
              label="Terms of Service"
              chevron
              onPress={() => router.push("/(root)/terms-of-service")}
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