import { useSupabase } from "./useSupabase"
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
            const { data: admins, error: adminsError } = await authSupabase
                .from("users")
                .select("clerk_id")
                .eq("is_admin", true)

            console.log("Admins found:", admins, adminsError)

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

                const { error: notifError } = await authSupabase
                    .from("notifications")
                    .insert(notifications)

                console.log("Notify admins insert error:", notifError)
            }
        }
        setSaveLoading(false)
    }
  return {isSaved, saveLoading, toggleSave}
}