import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase.js";
import * as SecureStore from "expo-secure-store";

// Import the logo
import logo from "../assets/Frame 4.png";

const dietaryRestrictions = [
  "None",
  "Vegetarian",
  "Vegan",
  "Gluten-free",
  "Lactose-free",
  "Nut allergy",
  "Shellfish allergy",
];

export default function OnboardingScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);
  const [errors, setErrors] = useState<{
    name: boolean;
    email: boolean;
    phone: boolean;
    emailMessage?: string;
  }>({
    name: false,
    email: false,
    phone: false,
    emailMessage: "",
  });

  const router = useRouter();

  const toggleRestriction = (restriction: string) => {
    setSelectedRestrictions((prev) =>
      prev.includes(restriction)
        ? prev.filter((r) => r !== restriction)
        : [...prev, restriction]
    );
  };

  const handleOnboarding = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const newErrors = {
      name: name.trim() === "",
      email: email.trim() === "" || !emailRegex.test(email),
      phone: phone.trim() === "",
      emailMessage:
        email.trim() === ""
          ? "Email is required"
          : !emailRegex.test(email)
          ? "Please enter a valid email address"
          : "",
    };

    setErrors(newErrors);

    if (!newErrors.name && !newErrors.email && !newErrors.phone) {
      try {
        const userData = {
          name,
          email,
          phone_num: phone,
          dietary_restr: selectedRestrictions.join(", "),
        };

        // Save to Firestore with email as the document ID
        await setDoc(doc(db, "users", email), userData);

        // Save the email to SecureStore for later use
        await SecureStore.setItemAsync("userEmail", email);

        console.log("User successfully onboarded!");

        // Navigate to the main app
        router.replace("/(tabs)/scan");
      } catch (error) {
        console.error("Error during onboarding:", error);
      }
    } else {
      Alert.alert("Error", "Please correct the highlighted fields.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo */}
        <Image source={logo} style={styles.logo} resizeMode="contain" />

        {/* Subtitle */}
        <Text style={styles.subtitle}>Let's get to know you</Text>

        {/* Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) setErrors((prev) => ({ ...prev, name: false }));
            }}
            placeholder="Enter your name"
          />
          {errors.name && <Text style={styles.errorText}>Name is required</Text>}
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email)
                setErrors((prev) => ({ ...prev, email: false, emailMessage: "" }));
            }}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
          {errors.email && <Text style={styles.errorText}>{errors.emailMessage}</Text>}
        </View>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: false }));
            }}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
          {errors.phone && <Text style={styles.errorText}>Phone number is required</Text>}
        </View>

        {/* Dietary Restrictions */}
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
                    selectedRestrictions.includes(restriction) &&
                      styles.selectedRestrictionText,
                  ]}
                >
                  {restriction}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Get Started Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleOnboarding}>
          <Text style={styles.submitButtonText}>Get Started</Text>
        </TouchableOpacity>

        {/* Log In Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.loginButtonText}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollContent: {
    padding: 20,
    alignItems: "center",
  },
  logo: {
    width: 300,
    height: 250,
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
    width: "100%",
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
    borderWidth: 1,
    borderColor: "#ccc",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
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
    width: "100%",
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: "#34c759",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})
