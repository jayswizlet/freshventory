import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import * as SecureStore from "expo-secure-store";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", email));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.phone_num === phone) {
          // Save the email to SecureStore for later use
          await SecureStore.setItemAsync("userEmail", email);

          console.log("Login successful!");
          // Navigate to the main app
          router.replace("/(tabs)/scan");
        } else {
          setErrorMessage("Invalid phone number. Please try again.");
        }
      } else {
        setErrorMessage("User not found. Please check your email.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.content}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Enter your email and phone number to log in.</Text>

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
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
        </View>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>      
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/oboarding")}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 16,
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignSelf: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    color: "#666",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
});
