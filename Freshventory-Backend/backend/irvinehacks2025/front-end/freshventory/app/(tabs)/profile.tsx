import React from "react"
import { View, StyleSheet, ScrollView, Text, Image, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

// Mock data (replace with actual data fetching logic)
const user = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  avatar: "https://i.pravatar.cc/150?img=68",
}

const savedRecipes = [
  { id: "1", name: "Vegetable Stir Fry" },
  { id: "2", name: "Chicken Parmesan" },
  { id: "3", name: "Quinoa Salad" },
]

const dietaryRestrictions = ["Gluten-free", "Lactose intolerant", "No peanuts"]

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.welcomeText}>Welcome back, {user.name}!</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          <Text style={styles.cardContent}>Email: {user.email}</Text>
          <Text style={styles.cardContent}>Phone: {user.phone}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Saved Recipes</Text>
          {savedRecipes.map((recipe) => (
            <Text key={recipe.id} style={styles.cardContent}>
              • {recipe.name}
            </Text>
          ))}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>View All Recipes</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dietary Restrictions</Text>
          {dietaryRestrictions.map((restriction, index) => (
            <Text key={index} style={styles.cardContent}>
              • {restriction}
            </Text>
          ))}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Edit Restrictions</Text>
          </TouchableOpacity>
        </View>
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
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  cardContent: {
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})

