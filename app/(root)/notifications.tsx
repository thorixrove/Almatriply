import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { Text, TouchableOpacity, useColorScheme, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function NotificationsScreen() {
  const router = useRouter()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

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
            color={isDark ? "#F9FAFB" : "#111827"}
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Notifications
        </Text>
      </View>

      {/* Empty state */}
      <View className="flex-1 items-center justify-center px-10">
        <View className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-950 items-center justify-center mb-5">
          <Ionicons
            name="notifications-outline"
            size={36}
            color={isDark ? "#60A5FA" : "#2563EB"}
          />
        </View>
        <Text className="text-gray-900 dark:text-gray-100 font-bold text-lg mb-2 text-center">
          Belum ada notifikasi
        </Text>
        <Text className="text-gray-400 dark:text-gray-400 text-sm text-center leading-5 mb-6">
          Kabar tentang properti yang kamu simpan, update status, dan
          penawaran baru bakal muncul di sini.
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(root)/(tabs)")}
          className="bg-blue-600 px-6 py-3 rounded-2xl"
        >
          <Text className="text-white font-semibold">Jelajahi Properti</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}