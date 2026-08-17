import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '@clerk/expo'
import { useRouter } from 'expo-router'


export default function ProfileScreen() {
  const { signOut} = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.replace("/sign-in")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }
  
  return (
    <SafeAreaView>
    <View>
      <Text>ProfileScreen</Text>
    </View>

          <View className="px-6 mt-auto mb-8">
        <TouchableOpacity
          onPress={handleSignOut}
          className="flex-row items-center justify-center gap-2 bg-red-50 py-4 rounded-2xl border border-red-100"
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text className="text-red-500 font-semibold text-base">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}