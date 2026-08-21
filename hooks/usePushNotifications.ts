import { useSupabase } from "./useSupabase"
import { useAuth } from "@clerk/expo"
import Constants from "expo-constants"
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import { Platform } from "react-native"


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
})

export function usePushNotifications() {
    const { userId } = useAuth()
    const authSupabase = useSupabase()


    const registerForPushNotifications = async (): Promise<boolean> => {
        if (!Device.isDevice) {
            console.log("Push notifications butuh device fisik, bukan emulator/simulator")
            return false
        }

        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
            })
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync()
        let finalStatus = existingStatus

        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync()
            finalStatus = status
        }

        if (finalStatus !== "granted") {
            return false
        }

        const projectId = Constants.expoConfig?.extra?.eas?.projectId
        const tokenResult = await Notifications.getExpoPushTokenAsync(
            projectId ? { projectId } : undefined
        )
        const token = tokenResult.data

        if (userId && token) {
            await authSupabase
                .from("users")
                .update({ expo_push_token: token })
                .eq("clerk_id", userId)
        }
        return true
    }

    const unregisterPushNotifications = async () => {
        if (!userId) return
        await authSupabase
            .from("users")
            .update({ expo_push_token: null })
            .eq("clerk_id", userId)
    }

    return{ registerForPushNotifications, unregisterPushNotifications}
}