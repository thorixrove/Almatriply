import { useUser } from "@clerk/expo";
import { useEffect } from "react";
import { useColorScheme } from "nativewind";
import { useSupabase } from "./useSupabase";
import { useUserStore } from "@/store/useStore";

export const useUserSync = () => {
    const { user } = useUser()
    const setIsAdmin = useUserStore((state) => state.setIsAdmin)
    const setSavedCount = useUserStore((state) => state.setSavedCount)
    const setDarkMode = useUserStore((state) => state.setDarkMode)
    const { setColorScheme } = useColorScheme()
    const authSupabase = useSupabase()

    useEffect(() => {
        if (!user) {
            // Reset biar data lama nggak nyangkut pas logout / ganti akun
            setIsAdmin(false)
            setSavedCount(0)
            setDarkMode(false)
            setColorScheme("light")
            return
        }
        syncUser()
    }, [user])

    const applyDarkMode = (isDark: boolean) => {
        setDarkMode(isDark)
        setColorScheme(isDark ? "dark" : "light")
    }

    const syncUser = async () => {
        const { data } = await authSupabase
            .from("users")
            .select("clerk_id, is_admin, dark_mode")
            .eq("clerk_id", user!.id)
            .single()

        if (data) {
            setIsAdmin(data.is_admin ?? false)
            applyDarkMode(data.dark_mode ?? false)
        } else {
            const { data: newUser } = await authSupabase
                .from("users")
                .insert({
                    clerk_id: user!.id,
                    email: user!.emailAddresses[0].emailAddress,
                    first_name: user!.firstName,
                    last_name: user!.lastName,
                    avatar_url: user!.imageUrl,
                })
                .select("is_admin, dark_mode")
                .single()

            setIsAdmin(newUser?.is_admin ?? false)
            applyDarkMode(newUser?.dark_mode ?? false)
        }

        fetchSavedCount()
    }

    const fetchSavedCount = async () => {
        const { count } = await authSupabase
            .from("saved_properties")
            .select("id", { count: "exact", head: true })
            .eq("user_clerk_id", user!.id)

        setSavedCount(count ?? 0)
    }
}