import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function CreateSurvey() {
  const router = useRouter();

  const [siteName, setSiteName] = useState("");
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = () => {
    if (!siteName.trim()) {
      Alert.alert("Validation Error", "Please enter a Site Name.");
      return;
    }
    if (!clientName.trim()) {
      Alert.alert("Validation Error", "Please enter a Client Name.");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Validation Error", "Please enter a Description.");
      return;
    }

    Alert.alert("Success", "Survey created successfully!", [
      { text: "OK", onPress: () => router.push("/") }
    ]);
    
    setSiteName("");
    setClientName("");
    setDescription("");
    setPriority("Medium");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>New Survey</Text>
          <Text style={styles.headerSubtitle}>Fill out the inspection details below.</Text>
        </View>

        <View style={styles.formContainer}>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Site Name <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="business-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. ABC Farm"
                value={siteName}
                onChangeText={setSiteName}
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Client Name <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. John Doe"
                value={clientName}
                onChangeText={setClientName}
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter survey description and notes..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityContainer}>
              {['Low', 'Medium', 'High'].map((level) => (
                <Pressable
                  key={level}
                  style={[
                    styles.priorityButton,
                    priority === level && styles.priorityButtonActive,
                    priority === level && level === 'High' && { backgroundColor: '#FEE2E2', borderColor: '#EF4444' },
                    priority === level && level === 'Medium' && { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' },
                    priority === level && level === 'Low' && { backgroundColor: '#DCFCE7', borderColor: '#10B981' },
                  ]}
                  onPress={() => setPriority(level)}
                >
                  <Text style={[
                    styles.priorityText,
                    priority === level && level === 'High' && { color: '#EF4444' },
                    priority === level && level === 'Medium' && { color: '#F59E0B' },
                    priority === level && level === 'Low' && { color: '#10B981' },
                  ]}>
                    {level}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="calendar-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Survey</Text>
          </Pressable>
          
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    backgroundColor: "#2563EB",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#BFDBFE",
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#0F172A",
  },
  textArea: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 120,
  },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    marginHorizontal: 4,
  },
  priorityButtonActive: {
    borderWidth: 2,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  submitButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
