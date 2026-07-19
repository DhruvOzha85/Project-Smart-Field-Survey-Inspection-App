import { useState, useRef } from "react";
import { View, Text, StyleSheet, Pressable, Image, Alert, ActivityIndicator, Platform } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import useStore from "../../store/useStore";
import { useRouter } from "expo-router";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [captureTime, setCaptureTime] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef(null);
  const router = useRouter();
  
  const { updateSurveyDraft, darkMode } = useStore();

  const theme = {
    background: darkMode ? "#0F172A" : "#F8FAFC",
    text: darkMode ? "#F1F5F9" : "#0F172A",
    textSecondary: darkMode ? "#94A3B8" : "#64748B",
    primary: "#4F46E5",
  };

  if (!permission) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Opening Camera...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.permissionContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.permissionText, { color: theme.text }]}>We need your permission to show the camera</Text>
        <Pressable 
          style={({ pressed }) => [
            styles.button, 
            { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 }
          ]} 
          onPress={requestPermission}
        >
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
    setPhoto(null);
    setCaptureTime(null);
  };

  const saveToDraft = () => {
    updateSurveyDraft({ photoUri: photo });
    Alert.alert("Success", "Photo attached to survey draft!");
    router.push('/(drawer)/(tabs)/survey');
    
    // Reset local state after saving
    setPhoto(null);
    setCaptureTime(null);
  };

  if (photo) {
    return (
      <SafeAreaView style={[styles.previewContainer, { backgroundColor: theme.background }]}>
        <Image source={{ uri: photo }} style={styles.previewImage} />
        
        <View style={styles.infoBox}>
          <Text style={styles.timeText}>Captured at: {captureTime}</Text>
        </View>

        <View style={[styles.actionRow, { backgroundColor: theme.background }]}>
          <Pressable 
            style={({ pressed }) => [
              styles.actionButton, styles.retakeBtn, 
              { opacity: pressed ? 0.7 : 1 }
            ]} 
            onPress={deletePhoto}
          >
            <Ionicons name="refresh" size={24} color="white" />
            <Text style={styles.actionBtnText}>Retake</Text>
          </Pressable>

          <Pressable 
            style={({ pressed }) => [
              styles.actionButton, styles.saveBtn, 
              { opacity: pressed ? 0.7 : 1 }
            ]} 
            onPress={saveToDraft}
          >
            <Ionicons name="checkmark-circle" size={24} color="white" />
            <Text style={styles.actionBtnText}>Use Photo</Text>
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
              style={({ pressed }) => [
                styles.captureButton,
                { backgroundColor: pressed ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 0.3)" }
              ]} 
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
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "500",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  permissionText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 24,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 6 }
    })
  },
  buttonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 16,
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
    marginBottom: 50,
  },
  captureButtonContainer: {
    alignSelf: "flex-end",
    alignItems: "center",
  },
  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: "center",
    alignItems: "center",
  },
  captureInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
  previewContainer: {
    flex: 1,
  },
  previewImage: {
    flex: 1,
    width: "100%",
    resizeMode: "cover", // better than contain for full screen preview
  },
  infoBox: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  timeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6 },
      android: { elevation: 4 }
    })
  },
  retakeBtn: {
    backgroundColor: "#EF4444",
  },
  saveBtn: {
    backgroundColor: "#10B981",
  },
  actionBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 8,
  },
});
