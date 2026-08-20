import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store/useStore";
import { Property } from "@/types";
import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import ImageViewing from "react-native-image-viewing";
import { useSavedProperty } from "@/hooks/useSavedProperty";
import { formatPrice } from "@/lib/utils";
import { useSupabase } from "@/hooks/useSupabase";


const { width } = Dimensions.get("window")
const ADMIN_PHONE = "6281240925791"

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { userId } = useAuth()
  const router = useRouter()
  const isAdmin = useUserStore((state) => state.isAdmin)
  const insets = useSafeAreaInsets()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [imageViewerVisible, setImageViewerVisible] = useState(false)

  const { isSaved, saveLoading, toggleSave } = useSavedProperty(id ?? "")
  const authSupabase = useSupabase()

  useEffect(() => {
    fetchProperty()
  }, [id])

  const fetchProperty = async () => {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single()
    setProperty(data)
    setLoading(false)
  }


  const handleDelete = () => {
    Alert.alert("Delete Property", "Are you sure?", [{ text: "Cancel", style: "cancel" },
    {
      text: "Delete",
      style: "destructive",
      onPress: async () => {
        await authSupabase.from("properties").delete().eq("id", id)
        router.replace("/(root)/(tabs)")
      },
    },
    ])
  }

  const handleMarkSold = () => {
    Alert.alert("Mark as  Sold", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Mark Sold",
        onPress: async () => {
          await authSupabase
            .from("properties")
            .update({ is_sold: true })
            .eq("id", id)
          setProperty((prev) => (prev ? { ...prev, is_sold: true } : prev))
        },
      },
    ])
  }

  const handleContact = () => {
    const message = `Hi! Saya tertarik dengan properti: ${property?.title}`;
    const url = `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(
      message
    )}`;
    Linking.openURL(url);
  }

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width)
    setActiveIndex(index)
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    )
  }

  if (!property) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <Text className="text-gray-500 dark:text-gray-400">Property not found</Text>
      </View>
    )
  }


  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${property.longitude - 0.003
    }%2C${property.latitude - 0.003}%2C${property.longitude + 0.003}%2C${property.latitude + 0.003
    }&layer=mapnik&marker=${property.latitude}%2C${property.longitude}`

  const isLongDesc = (property.description?.length ?? 0) > 150
  const displayDesc =
    expanded || !isLongDesc
      ? property.description
      : property.description?.slice(0, 150) + "..."


  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View>
          <View style={{ opacity: property.is_sold ? 0.5 : 1 }}>
            <FlatList
              data={property.images}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setImageViewerVisible(true)}>
                  <Image
                    source={{ uri: item }}
                    style={{ width, height: 300 }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={onScroll}
              scrollEventThrottle={16}
            />
          </View>

          {/* Image count badge */}
          <View className="absolute bottom-3 right-4 bg-black/50 px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-medium">
              {activeIndex + 1}/{property.images.length}
            </Text>
          </View>

          {/* Dot Indicator */}
          {property.images.length > 1 && (
            <View className="absolute bottom-3 left-0 right-0 flex-row justify-center gap-1">
              {property.images.map((_, i) => (
                <View
                  key={i}
                  className={`h-1.5 rounded-full ${i === activeIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                    }`}
                >
                </View>
              ))}
            </View>
          )}

          {/* Back + Save button */}
          <SafeAreaView className="absolute top-0 left-0 right-0">
            <View className="flex-row items-center justify-between px-4 pt-2">
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full items-center justify-center"
                style={{ elevation: 3 }}
              >
                <Ionicons name="arrow-back" size={20} color={isDark ? "#F3F4F6" : "#111827"} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleSave}
                disabled={saveLoading}
                className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full items-center justify-center"
                style={{ elevation: 3 }}
              >
                <Ionicons
                  name={isSaved ? "bookmark" : "bookmark-outline"}
                  size={20}
                  color={isSaved ? "#EF4444" : isDark ? "#F3F4F6" : "#111827"}
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        {/* Content */}
        <View
          className="px-5 pt-5 pb-8"
          style={{ 
            opacity: property.is_sold ? 0.6 : 1,
            paddingBottom: insets.bottom + 5,
          }}
        >
          {/* Badges */}
          <View className="flex-row gap-2 mb-3 flex-wrap">
            <View className="bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-full">
              <Text className="text-blue-600 dark:text-blue-400 text-xs font-semibold capitalize">
                {property.type}
              </Text>
            </View>
            {property.is_featured && (
              <View className="bg-amber-50 dark:bg-amber-950 px-3 py-1 rounded-full">
                <Text className="text-amber-600 dark:text-amber-400 text-xs font-semibold">
                  ⭐ Featured
                </Text>
              </View>
            )}
            {property.is_sold && (
              <View className="bg-red-50 dark:bg-red-950 px-3 py-1 rounded-full">
                <Text className="text-red-500 dark:text-red-400 text-xs font-semibold">Sold</Text>
              </View>
            )}
          </View>

          {/* Title + Price */}
          <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {property.title}
          </Text>
          <Text className="text-blue-600 dark:text-blue-400 text-xl font-bold mb-4">
            {formatPrice(property.price)}
          </Text>

          {/* Space Row */}
          <View className="flex-row justify-between bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 mb-5">
            <SpecItem
              icon="bed-outline"
              label="Beds"
              value={`${property.bedrooms}`}
              isDark={isDark}
            />
            <SpecItem
              icon="water-outline"
              label="Baths"
              value={`${property.bathrooms}`}
              isDark={isDark}
            />
            <SpecItem
              icon="expand-outline"
              label="Area"
              value={`${property.area_sqft} ft²`}
              isDark={isDark}
            />
            <SpecItem icon="home-outline" label="Type" value={property.type} isDark={isDark} />
          </View>

          {/* Description */}
          <Text className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">
            Description
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-sm leading-6 mb-1">
            {displayDesc}
          </Text>
          {isLongDesc && (
            <TouchableOpacity onPress={() => setExpanded(!expanded)}>
              <Text className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-5">
                {expanded ? "Show less" : "Read more"}
              </Text>
            </TouchableOpacity>
          )}

          <View className="mb-5" />

          {/* Location */}
          <Text className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">
            Location
          </Text>
          <View className="flex-row items-center gap-2 mb-4">
            <Ionicons name="location-outline" size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
            <Text className="text-gray-500 dark:text-gray-400 text-sm flex-1">
              {property.address}, {property.city}
            </Text>
          </View>

          {/* Map Preview */}
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(root)/property/map",
                params: {
                  latitude: property.latitude,
                  longitude: property.longitude,
                  title: property.title,
                  address: `${property.address}, ${property.city}`,
                },
              })
            }
            activeOpacity={0.9}
            className="rounded-2xl overflow-hidden mb-6"
            style={{ height: 200 }}
          >
            <WebView
              source={{ uri: mapUrl }}
              style={{ flex: 1 }}
              scrollEnabled={false}
              pointerEvents="none"
            />
            <View className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-full flex-row items-center gap-1">
              <Ionicons name="expand-outline" size={12} color={isDark ? "#D1D5DB" : "#374151"} />
              <Text className="text-gray-600 dark:text-gray-300 text-xs font-medium">
                Tap to expand
              </Text>
            </View>
          </TouchableOpacity>

          {/* Contact Button */}
          <TouchableOpacity
            onPress={handleContact}
            className="flex-row items-center justify-center gap-2 bg-blue-600 py-4 rounded-2xl mb-4"
          >
            <Ionicons name="logo-whatsapp" size={20} color="white" />
            <Text className="text-white font-bold text-base">
              Contact Agent
            </Text>
          </TouchableOpacity>

          {/* Admin Actions */}
          {isAdmin && (
            <View className="flex-row gap-3">
              {!property.is_sold && (
                <TouchableOpacity
                  onPress={handleMarkSold}
                  className="flex-1 flex-row items-center justify-center gap-2 bg-amber-50 dark:bg-amber-950 py-4 rounded-2xl border border-amber-200 dark:border-amber-800"
                >
                  <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color="#D97706"
                  />
                  <Text className="text-amber-600 dark:text-amber-400 font-semibold">
                    Mark Sold
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
              onPress={handleDelete}
              className="flex-1 flex-row items-center justify-center gap-2 bg-red-50 dark:bg-red-950 py-4 rounded-2xl border border-red-100 dark:border-red-900"
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
                <Text className="text-red-500 dark:text-red-400 font-semibold">Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Image Viewer */}
      <ImageViewing
      images={property.images.map((uri) => ({ uri}))}
      imageIndex={activeIndex}
      visible={imageViewerVisible}
      onRequestClose={() => setImageViewerVisible(false)}
      />
    </View>
  )
}

function SpecItem({
  icon,
  label,
  value,
  isDark,
}: {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  value: string
  isDark: boolean
}) {
  return(
        <View className="items-center gap-1">
      <Ionicons name={icon} size={20} color={isDark ? "#60A5FA" : "#2563EB"} />
      <Text className="text-gray-900 dark:text-gray-100 font-bold text-sm">{value}</Text>
      <Text className="text-gray-400 dark:text-gray-500 text-xs">{label}</Text>
    </View>
  )
}