import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Slot } from "expo-router";
import "../global.css";


const publishabelKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishabelKey) {
  throw new Error("Add your Clerk Publishabel Key to the .env file")
}

export default function RootLayout() {
  return(
    <ClerkProvider publishableKey={publishabelKey} tokenCache={tokenCache}>
      <Slot/>
    </ClerkProvider>
  )
}