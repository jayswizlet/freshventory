import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import * as SecureStore from "expo-secure-store";

const dietaryRestrictions = [
  "None",
  "Vegetarian",
  "Vegan",
  "Gluten-free",
  "Lactose-free",
  "Nut allergy",
  "Shellfish allergy",
];

export default function ProfileScreen() {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    phone: string;
    dietaryRestrictions: string[];
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);

  // Fetch user data from Firestore
  const fetchUserData = async () => {
    try {
      const email = await SecureStore.getItemAsync("userEmail");
      if (email) {
        const userDoc = await getDoc(doc(db, "users", email));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            id: email,
            name: userData.name,
            email: userData.email,
            phone: userData.phone_num,
            dietaryRestrictions: userData.dietary_restr ? userData.dietary_restr.split(", ") : [],
          });
          setSelectedRestrictions(userData.dietary_restr ? userData.dietary_restr.split(", ") : []);
        } else {
          console.error("User not found in the database.");
        }
      } else {
        console.error("No email found in SecureStore.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Save updated dietary restrictions to Firestore
  const saveDietaryRestrictions = async () => {
    if (user) {
      try {
        const updatedUser = {
          ...user,
          dietaryRestrictions: selectedRestrictions,
        };

        // Update the user data in Firestore
        await updateDoc(doc(db, "users", user.id), {
          dietary_restr: selectedRestrictions.join(", "),
        });

        setUser(updatedUser);
        setIsEditModalVisible(false);
        console.log("Dietary restrictions updated successfully!");
      } catch (error) {
        console.error("Error updating dietary restrictions:", error);
      }
    }
  };

  const toggleRestriction = (restriction: string) => {
    setSelectedRestrictions((prev) =>
      prev.includes(restriction)
        ? prev.filter((item) => item !== restriction)
        : [...prev, restriction]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loaderContainer}>
        <Text>No user data found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={{
              uri: "https://a.espncdn.com/i/headshots/nba/players/full/1966.png",
            }}
            style={styles.avatar}
          />
          <Text style={styles.welcomeText}>Welcome back, {user.name}!</Text>
        </View>

        {/* Personal Information Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          <Text style={styles.cardContent}>Email: {user.email}</Text>
          <Text style={styles.cardContent}>Phone: {user.phone}</Text>
        </View>

        {/* Dietary Restrictions Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dietary Restrictions</Text>
          {user.dietaryRestrictions.length > 0 ? (
            user.dietaryRestrictions.map((restriction, index) => (
              <Text key={index} style={styles.cardContent}>
                • {restriction}
              </Text>
            ))
          ) : (
            <Text style={styles.cardContent}>No dietary restrictions.</Text>
          )}

          {/* Edit Restrictions Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsEditModalVisible(true)}
          >
            <Text style={styles.buttonText}>Edit Restrictions</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Restrictions Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Dietary Restrictions</Text>
            <FlatList
              data={dietaryRestrictions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.restrictionItem,
                    selectedRestrictions.includes(item) && styles.selectedRestriction,
                  ]}
                  onPress={() => toggleRestriction(item)}
                >
                  <Text
                    style={[
                      styles.restrictionText,
                      selectedRestrictions.includes(item) && styles.selectedRestrictionText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveDietaryRestrictions}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  restrictionItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#f0f0f0",
  },
  selectedRestriction: {
    backgroundColor: "#007AFF",
  },
  restrictionText: {
    fontSize: 16,
  },
  selectedRestrictionText: {
    color: "white",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: "#ff3b30",
    padding: 10,
    borderRadius: 4,
    width: "45%",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#34c759",
    padding: 10,
    borderRadius: 4,
    width: "45%",
    alignItems: "center",
  },
});
