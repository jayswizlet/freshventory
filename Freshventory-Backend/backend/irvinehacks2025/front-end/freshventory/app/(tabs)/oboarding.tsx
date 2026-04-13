import React, { useState } from "react"
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import * as SecureStore from "expo-secure-store"
import { useRouter } from "expo-router"

const dietaryRestrictions = [
  "None",
  "Vegetarian",
  "Vegan",
  "Gluten-free",
  "Lactose-free",
  "Nut allergy",
  "Shellfish allergy",
]

export default function OnboardingScreen() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([])
  const router = useRouter()

  const toggleRestriction = (restriction: string) => {
    setSelectedRestrictions((prev) =>
      prev.includes(restriction) ? prev.filter((r) => r !== restriction) : [...prev, restriction],
    )
  }

  const handleSubmit = async () => {
    // Save user data
    const userData = { name, email, phone, dietaryRestrictions: selectedRestrictions }
    await SecureStore.setItemAsync("userData", JSON.stringify(userData))

    // Set onboarding as completed
    await SecureStore.setItemAsync("onboardingCompleted", "true")

    // Navigate to the main app
    router.replace("/")
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Welcome to FreshVentory</Text>
        <Text style={styles.subtitle}>Let's get to know you</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter your name" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Dietary Restrictions</Text>
          <View style={styles.restrictionsContainer}>
            {dietaryRestrictions.map((restriction) => (
              <TouchableOpacity
                key={restriction}
                style={[
                  styles.restrictionButton,
                  selectedRestrictions.includes(restriction) && styles.selectedRestriction,
                ]}
                onPress={() => toggleRestriction(restriction)}
              >
                <Text
                  style={[
                    styles.restrictionText,
                    selectedRestrictions.includes(restriction) && styles.selectedRestrictionText,
                  ]}
                >
                  {restriction}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Get Started</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  restrictionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  restrictionButton: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedRestriction: {
    backgroundColor: "#007AFF",
  },
  restrictionText: {
    fontSize: 14,
  },
  selectedRestrictionText: {
    color: "white",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})

