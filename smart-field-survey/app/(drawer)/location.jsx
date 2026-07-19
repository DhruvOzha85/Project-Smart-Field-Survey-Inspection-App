import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator, Platform } from "react-native";
import * as Location from "expo-location";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import useStore from "../../store/useStore";

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const { darkMode, updateSurveyDraft } = useStore();

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
      
      // Auto-tag the current survey draft with the location
      updateSurveyDraft({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

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

  const theme = {
    background: darkMode ? "#0F172A" : "#F8FAFC",
    card: darkMode ? "#1E293B" : "white",
    text: darkMode ? "#F1F5F9" : "#0F172A",
    textSecondary: darkMode ? "#94A3B8" : "#64748B",
    border: darkMode ? "#334155" : "#F1F5F9",
    primary: "#4F46E5",
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.primary, shadowColor: theme.primary }]}>
        <Ionicons name="navigate-circle" size={40} color="white" />
        <Text style={styles.title}>Current Location</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.statusText, { color: theme.textSecondary }]}>Fetching Location...</Text>
          </View>
        ) : errorMsg ? (
          <View style={styles.centerBox}>
            <Ionicons name="warning-outline" size={48} color="#EF4444" />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : location ? (
          <View style={styles.locationContent}>
            <View style={styles.mapContainer}>
              <MapView 
                style={styles.map}
                initialRegion={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
              >
                <Marker 
                  coordinate={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  }}
                  title="You are here"
                  pinColor={theme.primary}
                />
              </MapView>
            </View>

            <View style={styles.locationDetails}>
              <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Latitude:</Text>
                <Text style={[styles.detailValue, { color: theme.text }]}>{location.coords.latitude.toFixed(5)}</Text>
              </View>
              
              <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Longitude:</Text>
                <Text style={[styles.detailValue, { color: theme.text }]}>{location.coords.longitude.toFixed(5)}</Text>
              </View>

              <View style={[styles.detailRow, { borderBottomColor: theme.border, borderBottomWidth: 0 }]}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Accuracy:</Text>
                <Text style={[styles.detailValue, { color: theme.text }]}>± {location.coords.accuracy.toFixed(2)} meters</Text>
              </View>
            </View>
          </View>
        ) : null}
      </View>

      <View style={styles.actionButtons}>
        <Pressable 
          style={({ pressed }) => [
            styles.button, 
            { backgroundColor: theme.primary, opacity: pressed || loading ? 0.7 : 1 }
          ]} 
          onPress={fetchLocation}
          disabled={loading}
        >
          <Ionicons name="refresh" size={22} color="white" />
          <Text style={styles.buttonText}>Refresh Location</Text>
        </Pressable>

        <Pressable 
          style={({ pressed }) => [
            styles.button, 
            (!location || loading) ? styles.disabledButton : { backgroundColor: "#10B981" },
            { opacity: pressed ? 0.7 : 1 }
          ]} 
          onPress={copyToClipboard}
          disabled={!location || loading}
        >
          <Ionicons name="copy-outline" size={22} color="white" />
          <Text style={styles.buttonText}>Copy Coordinates</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 24,
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 8 }
    })
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 8,
    color: "white",
  },
  card: {
    borderRadius: 20,
    padding: 16,
    minHeight: 200,
    justifyContent: "center",
    borderWidth: 1,
    marginHorizontal: 20,
    marginBottom: 24,
    flex: 1,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
      android: { elevation: 3 }
    })
  },
  centerBox: {
    alignItems: "center",
  },
  statusText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center",
    fontWeight: "600",
  },
  locationContent: {
    flex: 1,
    gap: 16,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    minHeight: 250,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  locationDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingBottom: 10,
    paddingTop: 4,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  detailValue: {
    fontSize: 18,
    fontWeight: "800",
  },
  actionButtons: {
    gap: 16,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 16,
    gap: 10,
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6 },
      android: { elevation: 4 }
    })
  },
  disabledButton: {
    backgroundColor: "#94A3B8",
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "800",
  },
});
