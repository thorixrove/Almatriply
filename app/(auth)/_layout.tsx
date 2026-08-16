import { View, Text } from 'react-native'
import React from 'react'
import { useAuth } from '@clerk/expo'
import { Redirect, Stack } from 'expo-router'

export default function AuthLayout() {
  const { isSignedIn, isLoaded} = useAuth()

  if (!isLoaded) return null

  if (isSignedIn) return <Redirect href="/"/>


  return <Stack screenOptions={{ headerShown: false}}/>
}