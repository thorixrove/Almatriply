import { create } from "zustand"

interface UserStore {
    isAdmin: boolean,
    setIsAdmin: (value: boolean) => void
    savedCount: number,
    setSavedCount: (value: number) => void,
    incrementSavedCount: () => void,
    decrementSavedCount: () => void,
}

export const useUserStore = create<UserStore>((set) => ({
    isAdmin: false,
    setIsAdmin: (value) => set({ isAdmin: value}),
    savedCount: 0,
    setSavedCount: (value) => set({ savedCount: value}),
    incrementSavedCount: () => set((state) => ({ savedCount: state.savedCount + 1 })),
    decrementSavedCount: () => set((state) => ({ savedCount: Math.max(0, state.savedCount - 1) })),
}))