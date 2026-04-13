import React, { useEffect, useState } from "react"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Tabs, Redirect } from "expo-router"
import * as SecureStore from "expo-secure-store"
import { View, ActivityIndicator } from "react-native"

export default function TabLayout() {
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
        name="scan"
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
        name="inventory"
        options={{
          title: "Inventory",
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="inventory" color={color} />,
        }}
      />
    </Tabs>
  )
}

