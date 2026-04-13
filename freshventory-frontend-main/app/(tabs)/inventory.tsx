import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase.js";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";

interface InventoryItem {
  id: string;
  name: string;
}

export default function InventoryScreen() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState("");

  // Fetch data from Firestore
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ingredients"));
        const items: InventoryItem[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setInventory(items);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };

    fetchInventory();
  }, []);

  // Add item to Firestore database
  const addItem = async () => {
    if (newItemName) {
      try {
        const docRef = await addDoc(collection(db, "ingredients"), {
          name: newItemName,
        });

        const newItem: InventoryItem = {
          id: docRef.id,
          name: newItemName,
        };
        setInventory((prevInventory) => [...prevInventory, newItem]);

        setIsAddModalVisible(false);
        setNewItemName("");
      } catch (error) {
        console.error("Error adding item to Firestore:", error);
      }
    } else {
      console.log("Item name is required.");
    }
  };

  // Delete item from Firestore and update state
  const deleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, "ingredients", id));
      setInventory((prevInventory) => prevInventory.filter((item) => item.id !== id));
      console.log("Item deleted successfully.");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const renderRightActions = (id: string) => {
    return (
      <View style={styles.deleteButton}>
        <TouchableOpacity onPress={() => deleteItem(id)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({ item }: { item: InventoryItem }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <View style={styles.itemRow}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
        </View>
      </View>
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Inventory</Text>

        {/* Inventory List */}
        <FlatList
          data={inventory}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />

        {/* Add Item Button */}
        <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalVisible(true)}>
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity>

        {/* Add Item Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isAddModalVisible}
          onRequestClose={() => setIsAddModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Item</Text>
              <TextInput
                style={styles.input}
                placeholder="Item Name"
                value={newItemName}
                onChangeText={setNewItemName}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsAddModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={addItem}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 16,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 8,
    marginVertical: 12,
    marginHorizontal: 8,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
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
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 10,
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
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
