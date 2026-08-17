import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { useSignIn } from '@clerk/expo'
import { useRouter, Link } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function SignInScreen() {
  const { signIn, errors, fetchStatus} = useSignIn()
  const router = useRouter()
  const [ showPassword, setShowPassword] = useState(false)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")

  const onSignInPress = async () => {
    const { error} = await signIn.password({
      emailAddress: email,
      password,
    })

    if (error) {
      return
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl}) => {
          if (session?.currentTask) {
            console.log(session?.currentTask)
            return
          }
          const url = decorateUrl("/")
          router.replace(url as any)
        },
      })
    } else if (signIn.status === "needs_first_factor") {
      await signIn.mfa.sendPhoneCode()
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code"
      )
      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode()
      }
    } else {
      console.error("Sign-in attempt not complete:", signIn)
    }
  }

  const onVerifyPress = async () => {
    await signIn.mfa.verifyEmailCode({ code })

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl}) => {
          if (session?.currentTask) {
            console.log(session?.currentTask)
            return
          }
          const url = decorateUrl("/")
          router.replace(url as any)
        },
      })
    } else {
      console.error("Sign-In attempt not complete:", signIn)
    }
  }


  const isLoading = fetchStatus === "fetching"

  if  (signIn.status === "needs_client_trust") {
    return(
          <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "android" ? 20:0}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center items-center bg-white px-6">
        <Image
          source={require("../../assets/images/almatriply.png")}
          className="w-32 h-16 mb-8"
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-gray-800 mb-2">
          Verify your account
        </Text>

        <TextInput
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
          placeholder="Enter verification code"
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
        />
        {errors.fields.code && (
          <Text className='text-red-500 mb-4'>
            {errors.fields.code.message}
          </Text>
        )}

        <TouchableOpacity
        onPress={onVerifyPress}
        disabled={isLoading}
        className="w-full bg-blue-600 py-4 rounded-xl items-center mb-4"
        >
          {isLoading ? (
            <ActivityIndicator color="white"/>
          ) : (
            <Text className='text-white font-bold text-base'>Verify</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
        onPress={() => signIn.mfa.sendEmailCode()}
        className='py-2 mb-2'
        >
          <Text className='text-blue-600'>I need a new code</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => signIn.reset()} className='py-2'>
          <Text className='text-blue-600'>Start over</Text>
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    )
  }


  return(
          <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "android" ? 20:0}
      className="flex-1 bg-white"
    >
  <ScrollView 
  contentContainerStyle={{ flexGrow: 1}}
  className='bg-white'
  keyboardShouldPersistTaps="handled"
  >
    <View className='flex-1 justify-center px-6 py-12'>
      <Image
      source={require("../../assets/images/almatriply.png")}
      className='w-32 h-16 mb-8'
      resizeMode='contain'
      />
      <Text className='text-3xl font-bold text-gray-800 mb-2'>
        Welcome back
      </Text>
      <Text className='text-gray-500 mb-8'>Sign in to your account</Text>


        <TextInput
        className='w-full border border-gray-300 rounded-xl px-4 py-3 mb-4'
        placeholder='Email address'
        placeholderTextColor="#9CA3AF"
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
        autoCapitalize='none'
        />
      {errors.fields.identifier && (
        <Text className='text-red-500 mb-4'>
          {errors.fields.identifier.message}
        </Text>
      )}

          <View className="relative justify-center mb-4">
            <TextInput
              className="w-full border border-[#E8E6DF] bg-white rounded-xl px-4 py-3 pr-12 text-[#1A1D26]"
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2"
              style={{ transform: [{ translateY: -10 }] }}
            >
              <Ionicons
                size={20}
                name={showPassword ? "eye" : "eye-off"}
                color="#8A8D96"
              />
            </TouchableOpacity>
          </View>


      {errors.fields.password && (
        <Text className='text-red-500 mb-4'>
          {errors.fields.password.message}
        </Text>
      )}

      <TouchableOpacity
      onPress={onSignInPress}
      disabled={isLoading}
      className="w-full bg-blue-600 py-4 rounded-xl items-center mb-4"
      >
        {isLoading ? (
          <ActivityIndicator color="white"/>
        ) : (
          <Text className='text-white font-bold text-base'>Sign In</Text>
        )}
      </TouchableOpacity>

      <View className='flex-row justify-center'>
        <Text className='text-gray-500'>Don&apos;t have an account?</Text>
        <Link href="/sign-up">
        <Text className='text-blue-600 font-semibold'>Sign Up</Text>
        </Link>
      </View>

      <View nativeID='clerk-captcha'/>
    </View>
  </ScrollView>
  </KeyboardAvoidingView>
  )
}