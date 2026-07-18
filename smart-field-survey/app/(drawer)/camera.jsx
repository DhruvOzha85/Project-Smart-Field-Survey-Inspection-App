import { useState, useRef } from "react";
import { View, Text, StyleSheet, Pressable, Image, Alert, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [captureTime, setCaptureTime] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef(null);

  if (!permission) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Opening Camera...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.7, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      setPhoto(data.uri);
      
      const now = new Date();
      setCaptureTime(now.toLocaleString());
    }
  };

  const deletePhoto = () => {
    Alert.alert(
      "Delete Photo",
      "Are you sure you want to delete this photo?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            setPhoto(null);
            setCaptureTime(null);
          }
        }
      ]
    );
  };

  if (photo) {
    return (
      <SafeAreaView style={styles.previewContainer}>
        <Image source={{ uri: photo }} style={styles.previewImage} />
        
        <View style={styles.infoBox}>
          <Text style={styles.timeText}>Captured at: {captureTime}</Text>
        </View>

        <View style={styles.actionRow}>
          <Pressable style={[styles.actionButton, styles.retakeBtn]} onPress={() => setPhoto(null)}>
            <Ionicons name="refresh" size={24} color="white" />
            <Text style={styles.actionBtnText}>Retake</Text>
          </Pressable>

          <Pressable style={[styles.actionButton, styles.deleteBtn]} onPress={deletePhoto}>
            <Ionicons name="trash" size={24} color="white" />
            <Text style={styles.actionBtnText}>Delete</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.cameraContainer}>
      <CameraView 
        style={styles.camera} 
        facing="back" 
        ref={cameraRef}
        onCameraReady={() => setIsCameraReady(true)}
      >
        <View style={styles.cameraControls}>
          <View style={styles.captureButtonContainer}>
            <Pressable 
              style={styles.captureButton} 
              onPress={takePicture}
              disabled={!isCameraReady}
            >
              <View style={styles.captureInnerCircle} />
            </Pressable>
          </View>
        </View>
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#475569",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F8FAFC",
  },
  permissionText: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
    color: "#0F172A",
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
  },
  captureButtonContainer: {
    alignSelf: "flex-end",
    alignItems: "center",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureInnerCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "white",
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  previewImage: {
    flex: 1,
    width: "100%",
    resizeMode: "contain",
  },
  infoBox: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  timeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "#0F172A",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retakeBtn: {
    backgroundColor: "#3B82F6",
  },
  deleteBtn: {
    backgroundColor: "#EF4444",
  },
  actionBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
