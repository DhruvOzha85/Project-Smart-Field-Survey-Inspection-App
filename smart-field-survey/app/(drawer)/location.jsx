import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchLocation = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(currentLocation);
    } catch (error) {
      setErrorMsg("Failed to get location. Make sure GPS is enabled.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const copyToClipboard = async () => {
    if (location) {
      const locationString = `Lat: ${location.coords.latitude}, Lon: ${location.coords.longitude}`;
      await Clipboard.setStringAsync(locationString);
      
      Alert.alert("Copied!", "Location coordinates copied to clipboard.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="location" size={40} color="#2563EB" />
        <Text style={styles.title}>Current Location</Text>
      </View>

      <View style={styles.card}>
        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.statusText}>Fetching Location...</Text>
          </View>
        ) : errorMsg ? (
          <View style={styles.centerBox}>
            <Ionicons name="warning-outline" size={40} color="#EF4444" />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : location ? (
          <View style={styles.locationDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Latitude:</Text>
              <Text style={styles.detailValue}>{location.coords.latitude.toFixed(5)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Longitude:</Text>
              <Text style={styles.detailValue}>{location.coords.longitude.toFixed(5)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Accuracy:</Text>
              <Text style={styles.detailValue}>± {location.coords.accuracy.toFixed(2)} meters</Text>
            </View>
          </View>
        ) : null}
      </View>

      <View style={styles.actionButtons}>
        <Pressable 
          style={[styles.button, styles.refreshButton]} 
          onPress={fetchLocation}
          disabled={loading}
        >
          <Ionicons name="refresh" size={20} color="white" />
          <Text style={styles.buttonText}>Refresh Location</Text>
        </Pressable>

        <Pressable 
          style={[styles.button, styles.copyButton, (!location || loading) && styles.disabledButton]} 
          onPress={copyToClipboard}
          disabled={!location || loading}
        >
          <Ionicons name="copy-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Copy Coordinates</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F172A",
    marginTop: 10,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    minHeight: 200,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 30,
  },
  centerBox: {
    alignItems: "center",
  },
  statusText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748B",
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center",
  },
  locationDetails: {
    gap: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: "#64748B",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 18,
    color: "#0F172A",
    fontWeight: "bold",
  },
  actionButtons: {
    gap: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  refreshButton: {
    backgroundColor: "#2563EB",
  },
  copyButton: {
    backgroundColor: "#10B981",
  },
  disabledButton: {
    backgroundColor: "#94A3B8",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
