import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator } from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase.js"; // Import your Firebase config

// Define the Ingredient and Recipe types
type Ingredient = {
  name: string;
  amount?: number;
  unit?: string;
  aisle?: string;
  original?: string;
};

type Recipe = {
  id: string;
  image: string;
  title: string;
  likes: number;
  missedIngredients: Ingredient[];
  usedIngredients: Ingredient[];
  unusedIngredients: Ingredient[];
  missedIngredientCount: number;
  usedIngredientCount: number;
};

export default function RecipesScreen() {
  // Properly typed state for recipes
  const [recipes, setRecipes] = useState<Recipe[]>([]); // Recipes are an array of Recipe
  const [loading, setLoading] = useState(true); // Loading state for fetching

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "recipes"),
      (snapshot) => {
        const updatedRecipes = snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            image: data.image || "",
            title: data.title || "Untitled Recipe",
            likes: data.likes || 0,
            missedIngredients: data.missedIngredients?.map((ingredient: Ingredient) => ({
              name: ingredient.name || "",
              amount: ingredient.amount || 0,
              unit: ingredient.unit || "",
              aisle: ingredient.aisle || "",
              original: ingredient.original || "",
            })) || [],
            usedIngredients: data.usedIngredients?.map((ingredient: Ingredient) => ({
              name: ingredient.name || "",
              amount: ingredient.amount || 0,
              unit: ingredient.unit || "",
              aisle: ingredient.aisle || "",
              original: ingredient.original || "",
            })) || [],
            unusedIngredients: data.unusedIngredients?.map((ingredient: Ingredient) => ({
              name: ingredient.name || "",
              amount: ingredient.amount || 0,
              unit: ingredient.unit || "",
              aisle: ingredient.aisle || "",
              original: ingredient.original || "",
            })) || [],
            missedIngredientCount: data.missedIngredientCount || 0,
            usedIngredientCount: data.usedIngredientCount || 0,
          };
        }) as Recipe[]; // Explicitly cast to Recipe[]

        setRecipes(updatedRecipes); // Update the state
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching recipes: ", error.message, error);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    // Show a loading indicator while fetching data
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <FlatList
      data={recipes} // Use the recipes data from Firestore
      keyExtractor={(item) => item.id} // Ensure unique keys
      renderItem={({ item: recipe }) => (
        <View style={styles.recipeCard}>
          {/* Recipe Title */}
          <Text style={styles.title}>{recipe.title}</Text>

          {/* Recipe Image */}
          <Image source={{ uri: recipe.image }} style={styles.image} />

          {/* Missed Ingredients */}
          <Text style={styles.sectionTitle}>Missing Ingredients:</Text>
          <FlatList
            data={recipe.missedIngredients || []} // Use a fallback for empty or undefined arrays
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={styles.ingredient}>
                - {item.amount} {item.unit} {item.name}
              </Text>
            )}
          />

          {/* Used Ingredients */}
          <Text style={styles.sectionTitle}>Ingredients:</Text>
          <FlatList
            data={recipe.usedIngredients || []} // Use a fallback for empty or undefined arrays
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={styles.ingredient}>
                - {item.amount} {item.unit} {item.name}
              </Text>
            )}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  recipeCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
  },
  ingredient: {
    fontSize: 14,
    color: "#555",
  },
});
