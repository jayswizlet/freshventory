import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import { query, where, collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function ScannedResult() {
  const { photo } = useLocalSearchParams(); // Access photo URI from the route params
  const router = useRouter(); // Use router for navigation
  const [scannedItems, setScannedItems] = useState<string[]>([]); // Store the detected items
  const [alreadyExistingItems, setAlreadyExistingItems] = useState<string[]>([]); // Store the already existing items
  const [isProcessing, setIsProcessing] = useState(false); // Track if processing is in progress

  const apiUrl = "https://detect.roboflow.com/aicook-lcv4d/3"; // Replace with the actual API URL
  const apiKey = "fAwcjwOeWTzCAttEENEQ"; // Replace with your actual API key

  // Handle the API call to process the image
  async function processImage(photoUri: string) {
    try {
      setIsProcessing(true);

      // Convert the image to Base64
      const base64Image = await FileSystem.readAsStringAsync(photoUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Make the API call
      const response = await axios.post(
        apiUrl,
        base64Image,
        {
          params: { api_key: apiKey },
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      // Get the predictions from the API response
      const predictions = response.data.predictions;

      const ingredientsToAdd = new Set<string>();
      const existingItems = [];

      for (const item of predictions) {
        if (item.confidence > 0.7) {
          const ingredientQuery = query(
            collection(db, "ingredients"),
            where("name", "==", item.class)
          );
          const querySnapshot = await getDocs(ingredientQuery);

          if (querySnapshot.empty) {
            // Use Set to ensure uniqueness
            ingredientsToAdd.add(item.class);
          } else {
            existingItems.push(item.class);
          }
        }
      }

      setScannedItems(Array.from(ingredientsToAdd)); // Convert Set to Array
      setAlreadyExistingItems(existingItems);

      Alert.alert(
        "Scan Complete",
        "Review the detected items and press 'Complete Scan' to save them."
      );
    } catch (error) {
      console.error("Error processing image:", error);
      Alert.alert("Error", "Failed to process the image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }

  // Trigger processing when the component loads
  React.useEffect(() => {
    if (photo) {
      processImage(photo as string);
    }
  }, [photo]);

  // Handle Complete Scan
  const handleCompleteScan = async () => {
    try {
      // Add only the items listed in `scannedItems` to the database
      for (const ingredient of scannedItems) {
        await addDoc(collection(db, "ingredients"), { name: ingredient });
      }

      Alert.alert(
        "Success",
        `Ingredients added to inventory: ${scannedItems.join(", ")}`
      );

      // Navigate back to the scan page
      router.replace("/scan");
    } catch (error) {
      console.error("Error completing the scan:", error);
      Alert.alert("Error", "Failed to complete the scan. Please try again.");
    }
  };

  // Delete a detected item from the list
  const deleteItem = (item: string) => {
    setScannedItems((prevItems) => prevItems.filter((i) => i !== item));
    Alert.alert("Item Deleted", `${item} has been removed from the list.`);
  };

  return (
    <View style={styles.container}>
      {/* Top half for image preview */}
      <View style={styles.topContainer}>
        <Text style={styles.title}>Scanned Image</Text>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.image} />
        ) : (
          <Text style={styles.placeholder}>No photo available</Text>
        )}
      </View>

      {/* Bottom half for scanned items */}
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>Detected Items</Text>
        <FlatList
          data={scannedItems}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>• {item}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteItem(item)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            !isProcessing && <Text style={styles.placeholder}>No items detected.</Text>
          }
        />

        {/* Show items that already exist */}
        {alreadyExistingItems.length > 0 && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Already in Inventory</Text>
            <FlatList
              data={alreadyExistingItems}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item }) => (
                <Text style={styles.infoText}>• {item}</Text>
              )}
            />
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace("/scan")}
          >
            <Text style={styles.buttonText}>Retake Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.completeButton]}
            onPress={handleCompleteScan}
          >
            <Text style={styles.buttonText}>Complete Scan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  topContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    padding: 16,
  },
  bottomContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: "70%",
    resizeMode: "contain",
    borderRadius: 8,
  },
  placeholder: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  itemText: {
    fontSize: 18,
    marginVertical: 4,
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: "#007AFF",
  },
  completeButton: {
    backgroundColor: "#34c759",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoContainer: {
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#888",
  },
  infoText: {
    fontSize: 14,
    color: "#666",
  },
});
