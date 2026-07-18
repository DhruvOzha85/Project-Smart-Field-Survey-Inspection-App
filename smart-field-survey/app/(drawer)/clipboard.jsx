import { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, Alert, ScrollView } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ClipboardScreen() {
  const [pastedNotes, setPastedNotes] = useState("");

  const copyToClipboard = async (text, type) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copied!", `${type} copied to clipboard.`);
  };

  const pasteFromClipboard = async () => {
    const text = await Clipboard.getStringAsync();
    if (text) {
      setPastedNotes(text);
    } else {
      Alert.alert("Clipboard Empty", "There is no text in your clipboard to paste.");
    }
  };

  const clearClipboard = async () => {
    await Clipboard.setStringAsync("");
    setPastedNotes("");
    Alert.alert("Cleared", "Clipboard data has been cleared.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Ionicons name="clipboard" size={40} color="#2563EB" />
          <Text style={styles.title}>Clipboard Manager</Text>
        </View>

        <Text style={styles.sectionTitle}>Copy Items</Text>
        
        <Pressable style={styles.copyCard} onPress={() => copyToClipboard("SRV-2023-8921", "Survey ID")}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardLabel}>Survey ID</Text>
            <Text style={styles.cardValue}>SRV-2023-8921</Text>
          </View>
          <Ionicons name="copy-outline" size={24} color="#2563EB" />
        </Pressable>

        <Pressable style={styles.copyCard} onPress={() => copyToClipboard("+1 (555) 123-4567", "Contact Number")}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardLabel}>Contact Number</Text>
            <Text style={styles.cardValue}>+1 (555) 123-4567</Text>
          </View>
          <Ionicons name="copy-outline" size={24} color="#2563EB" />
        </Pressable>

        <Pressable style={styles.copyCard} onPress={() => copyToClipboard("Lat: 34.0522, Lon: -118.2437", "Location")}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardLabel}>Current Location</Text>
            <Text style={styles.cardValue}>Lat: 34.0522, Lon: -118.2437</Text>
          </View>
          <Ionicons name="copy-outline" size={24} color="#2563EB" />
        </Pressable>

        <Text style={styles.sectionTitle}>Paste Notes</Text>
        <View style={styles.pasteArea}>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="Pasted notes will appear here..."
            value={pastedNotes}
            onChangeText={setPastedNotes}
            textAlignVertical="top"
          />
          <Pressable style={styles.pasteButton} onPress={pasteFromClipboard}>
            <Ionicons name="download-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Paste from Clipboard</Text>
          </Pressable>
        </View>

        <Pressable style={styles.clearButton} onPress={clearClipboard}>
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
          <Text style={styles.clearButtonText}>Clear Clipboard Data</Text>
        </Pressable>
        
      </ScrollView>
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
    marginTop: 10,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F172A",
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 15,
  },
  copyCard: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardInfo: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  pasteArea: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 30,
  },
  textArea: {
    height: 100,
    fontSize: 16,
    color: "#0F172A",
    marginBottom: 15,
  },
  pasteButton: {
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
    marginBottom: 40,
    gap: 8,
  },
  clearButtonText: {
    color: "#EF4444",
    fontWeight: "bold",
    fontSize: 16,
  },
});
