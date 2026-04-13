import { CameraView, CameraType } from "expo-camera";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";

export default function Scan() {
  const [facing, setFacing] = useState<CameraType>("back");
  const cameraRef = useRef(null); // Reference to the CameraView
  const [photo, setPhoto] = useState<string | null>(null); // Store captured photo URI

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

  return (
    <View style={styles.container}>
      {photo ? (
        // Display the captured photo
        <>
          <Image source={{ uri: photo }} style={styles.preview} />
          <View style={styles.buttonContainer}>
            <Pressable style={styles.retakeButton} onPress={() => setPhoto(null)}>
              <Text style={styles.retakeText}>Retake Photo</Text>
            </Pressable>
            <Pressable style={styles.retakeButton} onPress={() => setPhoto(null)}>
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
    alignItems: "center", // Center content horizontally
    backgroundColor: "#fff",
  },
  camera: {
    flex: 1,
    width: "100%", // Make camera preview full width
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    position: "absolute",
    bottom: 20, // Position buttons at the bottom of the screen
    width: "100%",
  },
  button: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 5,
  },
  text: {
    fontSize: 25,
    color: "black",
    textAlign: "center",
    fontWeight: "bold"
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
    marginTop: 20, // Add space between the photo and the button
    alignSelf: "center", // Center the button horizontally
  },
  retakeText: {
    fontSize: 25,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
});
