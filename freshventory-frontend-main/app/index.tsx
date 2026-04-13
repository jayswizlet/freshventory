import React, { useEffect, useState } from "react";
import { Redirect, Slot } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import * as SecureStore from "expo-secure-store";

export default function RootLayout() {
    const [isLoading, setIsLoading] = useState(true);
    const [hasOnboarded, setHasOnboarded] = useState(false);

    useEffect(() => {
    const checkOnboarding = async () => {
        const onboarded = await SecureStore.getItemAsync("hasOnboarded");
        setHasOnboarded(onboarded === "true");
        setIsLoading(false);
    };

    checkOnboarding();
    }, []);

    if (isLoading) {
    // Show a loading indicator while checking the onboarding status
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        </View>
    );
    }

    if (!hasOnboarded) {
    // If the user hasn't completed onboarding, render the onboarding screen
    return <Redirect href="/oboarding" />;
    }
}