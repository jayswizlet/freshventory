import React, { useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import { CameraView, CameraType } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

export default function Scan() {
  const [facing, setFacing] = useState<CameraType>("back");
  const cameraRef = useRef(null); // Reference to the CameraView
  const [photo, setPhoto] = useState<string | null>(null); // Store captured photo URI
  const router = useRouter();

  // Toggle between front and back cameras
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  // Take a picture
  async function takePic() {
    if (cameraRef.current) {
      try {
        const photoData = await cameraRef.current.takePictureAsync(); // Capture photo
        setPhoto(photoData.uri); // Store the URI of the captured photo
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  }

  // Select a photo from the gallery
  async function pickPhoto() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri); // Store the URI of the selected photo
      }
    } catch (error) {
      console.error("Error selecting photo from gallery:", error);
      Alert.alert("Error", "Could not access your photo gallery.");
    }
  }

  return (
    <View style={styles.container}>
      {photo ? (
        // Display the captured or selected photo
        <>
          <Image source={{ uri: photo }} style={styles.preview} />
          <View style={styles.buttonContainer}>
            <Pressable style={styles.retakeButton} onPress={() => setPhoto(null)}>
              <Text style={styles.retakeText}>Retake Photo</Text>
            </Pressable>
            <Pressable
              style={styles.retakeButton}
              onPress={() => router.push({ pathname: "../scannedResult", params: { photo } })}
            >
              <Text style={styles.retakeText}>Start Scan</Text>
            </Pressable>
          </View>
        </>
      ) : (
        // Camera preview with buttons
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={takePic}>
              <Text style={styles.text}>Take Picture</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={pickPhoto}>
              <Text style={styles.text}>Upload Photo</Text>
            </Pressable>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    position: "absolute",
    bottom: 20,
    width: "100%",
  },
  button: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 5,
  },
  text: {
    fontSize: 20,
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
  },
  preview: {
    flex: 1,
    resizeMode: "contain",
    width: "100%",
  },
  retakeButton: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: "center",
  },
  retakeText: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
});
