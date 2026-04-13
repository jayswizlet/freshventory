import React, { useEffect, useState } from "react"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { Ionicons } from "@expo/vector-icons"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Tabs, Redirect } from "expo-router"
import * as SecureStore from "expo-secure-store"

export default function TabLayout() {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean | null>(null)

  useEffect(() => {
    checkOnboardingStatus()
  }, [])

  const checkOnboardingStatus = async () => {
    const status = await SecureStore.getItemAsync("onboardingCompleted")
    setIsOnboardingCompleted(status === "true")
  }

  if (isOnboardingCompleted === null) {
    // Still loading, you might want to show a loading screen here
    return null
  }

  if (isOnboardingCompleted === false) {
    return <Redirect href="/onboarding" />
  }

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="recipes"
        options={{
          title: "Recipes",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="chef-hat" color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Scan",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="camera" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <Ionicons size={28} name="person" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
    </Tabs>
  )
}

