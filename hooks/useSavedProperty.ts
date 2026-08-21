import { useSupabase } from "./useSupabase"
import { sendPushNotifications } from "@/lib/pushNotifications"
import { useAuth } from "@clerk/expo"
import { useEffect, useState } from "react"


export function useSavedProperty(propertyId: string, onUnsave?: () => void) {
    const {userId} = useAuth()
    const authSupabase = useSupabase()

    const [ isSaved, setIsSaved] = useState(false)
    const [ saveLoading, setSaveLoading] = useState(false)

    useEffect(() => {
        checkIfSaved()
    }, [propertyId, userId])

    const checkIfSaved = async () => {
        if (!userId) return
        const { data} = await authSupabase
        .from("saved_properties")
        .select("id")
        .eq("user_clerk_id", userId)
        .eq("property_id", propertyId)
        .single()
        setIsSaved(!!data)
    }

    const toggleSave = async () => {
        if (!userId || saveLoading) return
        setSaveLoading(true)
        if (isSaved) {
            await authSupabase
            .from("saved_properties")
            .delete()
            .eq("user_clerk_id", userId)
            .eq("property_id", propertyId)
            setIsSaved(false)
            onUnsave?.()
        } else {
            await authSupabase
            .from("saved_properties")
            .insert({ user_clerk_id: userId, property_id: propertyId})
            setIsSaved(true)

            // Notifikasi semua admin kalau ada yang nyimpen properti
            const { data: admins } = await authSupabase
                .from("users")
                .select("clerk_id, expo_push_token")
                .eq("is_admin", true)

            if (admins && admins.length > 0) {
                const { data: propertyData } = await authSupabase
                    .from("properties")
                    .select("title")
                    .eq("id", propertyId)
                    .single()

                const notifications = admins.map((admin) => ({
                    user_clerk_id: admin.clerk_id,
                    title: "Property Saved",
                    body: `Seseorang menyimpan properti "${propertyData?.title ?? "properti"}".`,
                    type: "property_saved",
                    property_id: propertyId,
                }))
                await authSupabase.from("notifications").insert(notifications)

                // Kirim push notification beneran ke admin
                const tokens = admins
                    .map((a) => a.expo_push_token)
                    .filter((t): t is string => !!t)

                await sendPushNotifications(
                    tokens,
                    "Property Saved",
                    `Seseorang menyimpan properti "${propertyData?.title ?? "properti"}".`,
                    { property_id: propertyId }
                )
            }
        }
        setSaveLoading(false)
    }
  return {isSaved, saveLoading, toggleSave}
}