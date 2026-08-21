import { useUser } from "@clerk/expo";
import { useColorScheme } from "nativewind";
import { useUserStore } from "@/store/useStore";
import { useSupabase } from "./useSupabase";

// Pakai hook ini di layar Settings/Profile untuk tombol toggle dark mode
export const useDarkModeToggle = () => {
    const { user } = useUser()
    const darkMode = useUserStore((state) => state.darkMode)
    const setDarkMode = useUserStore((state) => state.setDarkMode)
    const { setColorScheme } = useColorScheme()
    const authSupabase = useSupabase()

    const toggleDarkMode = async () => {
        if (!user) return

        const newValue = !darkMode

        // update tampilan + state lokal langsung (optimistic update)
        setDarkMode(newValue)
        setColorScheme(newValue ? "dark" : "light")

        // simpan ke database supaya persist per akun
        const { error } = await authSupabase
            .from("users")
            .update({ dark_mode: newValue })
            .eq("clerk_id", user.id)

        if (error) {
            console.error("Failed to save dark mode preference:", error)
            // rollback kalau gagal simpan
            setDarkMode(!newValue)
            setColorScheme(!newValue ? "dark" : "light")
        }
    }

    return { darkMode, toggleDarkMode }
}