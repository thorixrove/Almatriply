import { useSupabase } from "@/hooks/useSupabase"
import { useAuth } from "@clerk/expo"
import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect, useRouter } from "expo-router"
import { useCallback, useState } from "react"
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

type NotificationItem = {
  id: string
  title: string
  body: string
  type: string
  property_id: string | null
  is_read: boolean
  created_at: string
}

function timeAgo(dateString: string) {
  const diffMs = Date.now() - new Date(dateString).getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return "Baru saja"
  if (minutes < 60) return `${minutes}m lalu`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}j lalu`
  const days = Math.floor(hours / 24)
  return `${days}h lalu`
}

export default function NotificationsScreen() {
  const router = useRouter()
  const { userId } = useAuth()
  const authSupabase = useSupabase()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      fetchNotifications()
    }, [userId])
  )

  const fetchNotifications = async () => {
    if (!userId) return
    setLoading(true)

    const { data } = await authSupabase
      .from("notifications")
      .select("*")
      .eq("user_clerk_id", userId)
      .order("created_at", { ascending: false })

    setNotifications(data ?? [])
    setLoading(false)
  }

  const handlePress = async (item: NotificationItem) => {
    if (!item.is_read) {
      await authSupabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", item.id)

      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, is_read: true } : n))
      )
    }

    if (item.property_id) {
      router.push({
        pathname: "/(root)/property/[id]",
        params: { id: item.property_id },
      })
    }
  }

  const handleDelete = async (itemId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== itemId))
    await authSupabase.from("notifications").delete().eq("id", itemId)
  }

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

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" className="mt-10" />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, paddingTop: 0 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handlePress(item)}
              className={`flex-row gap-3 p-4 rounded-2xl mb-3 ${
                item.is_read
                  ? "bg-white dark:bg-gray-900"
                  : "bg-blue-50 dark:bg-blue-950"
              }`}
            >
              <View className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 items-center justify-center">
                <Ionicons
                  name="home-outline"
                  size={18}
                  color={isDark ? "#60A5FA" : "#2563EB"}
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 dark:text-gray-100 font-semibold text-sm mb-0.5">
                  {item.title}
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-sm leading-5">
                  {item.body}
                </Text>
                <Text className="text-gray-300 dark:text-gray-600 text-xs mt-1">
                  {timeAgo(item.created_at)}
                </Text>
              </View>
              {!item.is_read && (
                <View className="w-2 h-2 rounded-full bg-blue-600 mt-1" />
              )}
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                className="ml-1"
              >
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={isDark ? "#6B7280" : "#9CA3AF"}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View className="items-center justify-center px-10 py-20">
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
                Kabar tentang informasi lebih lanjut akan muncul di sini.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}