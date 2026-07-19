import { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert, Modal, FlatList, Image, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import useStore from "../../../store/useStore";
import * as Contacts from "expo-contacts";
import { saveSurvey, getContacts } from "../../../db/database";

export default function CreateSurvey() {
  const router = useRouter();
  
  const { surveyDraft, updateSurveyDraft, resetSurveyDraft, darkMode } = useStore();
  const [contacts, setContacts] = useState([]);
  const [isContactModalVisible, setContactModalVisible] = useState(false);
  const [selectedContactName, setSelectedContactName] = useState("");

  const loadContacts = async () => {
    try {
      const localData = await getContacts();
      
      const { status } = await Contacts.requestPermissionsAsync();
      let deviceContacts = [];
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });
        
        if (data && data.length > 0) {
          deviceContacts = data.map((c, index) => ({
            id: `device-${c.id || index}`,
            name: c.name || "Unknown",
            phone: c.phoneNumbers && c.phoneNumbers.length > 0 ? c.phoneNumbers[0].number : ""
          }));
        }
      }
      
      const allContacts = [...localData, ...deviceContacts];
      setContacts(allContacts);
      
      // If we have a selected contact ID, update the displayed name
      if (surveyDraft.contactId) {
        const contact = allContacts.find(c => c.id === surveyDraft.contactId);
        if (contact) setSelectedContactName(contact.name);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadContacts();
    }, [surveyDraft.contactId])
  );

  const handleSubmit = async () => {
    if (!surveyDraft.title.trim()) {
      Alert.alert("Validation Error", "Please enter a Site Name.");
      return;
    }
    if (!surveyDraft.description.trim()) {
      Alert.alert("Validation Error", "Please enter a Description.");
      return;
    }

    try {
      await saveSurvey({
        title: surveyDraft.title,
        description: surveyDraft.description,
        latitude: surveyDraft.latitude,
        longitude: surveyDraft.longitude,
        contactId: surveyDraft.contactId,
        photoUri: surveyDraft.photoUri,
        timestamp: new Date().toISOString()
      });
      
      Alert.alert("Success", "Survey created and saved locally!", [
        { text: "OK", onPress: () => {
            resetSurveyDraft();
            router.push("/");
          }
        }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save survey.");
    }
  };

  const theme = {
    background: darkMode ? "#0F172A" : "#F8FAFC",
    card: darkMode ? "#1E293B" : "white",
    text: darkMode ? "#F1F5F9" : "#0F172A",
    textSecondary: darkMode ? "#94A3B8" : "#64748B",
    border: darkMode ? "#334155" : "#E2E8F0",
    inputBg: darkMode ? "#1E293B" : "white",
    primary: "#4F46E5",
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={[styles.header, { backgroundColor: theme.primary, shadowColor: theme.primary }]}>
          <Text style={styles.headerTitle}>New Survey</Text>
          <Text style={styles.headerSubtitle}>Fill out the inspection details below.</Text>
        </View>

        <View style={styles.formContainer}>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Site Name <Text style={styles.required}>*</Text></Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
              <Ionicons name="business-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="e.g. ABC Farm"
                value={surveyDraft.title}
                onChangeText={(text) => updateSurveyDraft({ title: text })}
                placeholderTextColor={theme.textSecondary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Select Contact</Text>
            <Pressable 
              style={({ pressed }) => [
                styles.inputWrapper, 
                { backgroundColor: pressed ? theme.border : theme.inputBg, borderColor: theme.border, paddingVertical: 14 }
              ]}
              onPress={() => setContactModalVisible(true)}
            >
              <Ionicons name="person-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <Text style={[styles.input, { color: selectedContactName ? theme.text : theme.textSecondary }]}>
                {selectedContactName || "Select a contact..."}
              </Text>
            </Pressable>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Description <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
              placeholder="Enter survey description and notes..."
              value={surveyDraft.description}
              onChangeText={(text) => updateSurveyDraft({ description: text })}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.attachmentsRow}>
            <Pressable 
              style={({ pressed }) => [
                styles.attachButton, 
                { backgroundColor: theme.card, borderColor: surveyDraft.photoUri ? "#10B981" : theme.border, opacity: pressed ? 0.7 : 1 }
              ]} 
              onPress={() => router.push('/camera')}
            >
              <Ionicons name="camera" size={24} color={surveyDraft.photoUri ? "#10B981" : theme.textSecondary} />
              <Text style={[styles.attachText, { color: surveyDraft.photoUri ? "#10B981" : theme.textSecondary }]}>
                {surveyDraft.photoUri ? "Photo Attached" : "Add Photo"}
              </Text>
            </Pressable>

            <Pressable 
              style={({ pressed }) => [
                styles.attachButton, 
                { backgroundColor: theme.card, borderColor: surveyDraft.latitude ? "#10B981" : theme.border, opacity: pressed ? 0.7 : 1 }
              ]} 
              onPress={() => router.push('/location')}
            >
              <Ionicons name="location" size={24} color={surveyDraft.latitude ? "#10B981" : theme.textSecondary} />
              <Text style={[styles.attachText, { color: surveyDraft.latitude ? "#10B981" : theme.textSecondary }]}>
                {surveyDraft.latitude ? "GPS Tagged" : "Tag Location"}
              </Text>
            </Pressable>
          </View>

          {surveyDraft.photoUri && (
             <Image source={{ uri: surveyDraft.photoUri }} style={styles.thumbnailPreview} />
          )}

          <Pressable 
            style={({ pressed }) => [
              styles.submitButton, 
              { backgroundColor: theme.primary, shadowColor: theme.primary, opacity: pressed ? 0.8 : 1 }
            ]} 
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Save Survey Offline</Text>
          </Pressable>
          
        </View>
      </ScrollView>

      {/* Contact Picker Modal */}
      <Modal visible={isContactModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Select Contact</Text>
              <Pressable onPress={() => setContactModalVisible(false)} style={{ padding: 4 }}>
                <Ionicons name="close" size={24} color={theme.textSecondary} />
              </Pressable>
            </View>
            
            <FlatList 
              data={contacts}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={<Text style={{ color: theme.textSecondary, textAlign: 'center', marginTop: 20 }}>No contacts available. Add one in Contacts tab.</Text>}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Pressable 
                  style={({ pressed }) => [
                    styles.contactItem, 
                    { borderBottomColor: theme.border, backgroundColor: pressed ? (darkMode ? '#334155' : '#F1F5F9') : 'transparent' }
                  ]}
                  onPress={() => {
                    updateSurveyDraft({ contactId: item.id });
                    setSelectedContactName(item.name);
                    setContactModalVisible(false);
                  }}
                >
                  <View style={styles.contactAvatar}>
                    <Text style={styles.contactAvatarText}>{item.name ? item.name.charAt(0).toUpperCase() : '?'}</Text>
                  </View>
                  <View>
                    <Text style={[styles.contactName, { color: theme.text }]}>{item.name}</Text>
                    <Text style={{ color: theme.textSecondary }}>{item.phone}</Text>
                  </View>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 24,
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 8 }
    })
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#E0E7FF",
    fontWeight: '500',
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
    fontWeight: "700",
    marginBottom: 8,
    marginLeft: 4,
  },
  required: {
    color: "#EF4444",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 120,
  },
  attachmentsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 12,
  },
  attachButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderWidth: 1.5,
    borderRadius: 16,
    gap: 8,
  },
  attachText: {
    fontSize: 14,
    fontWeight: "700",
  },
  thumbnailPreview: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginBottom: 24,
    resizeMode: "cover",
  },
  submitButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 8 }
    })
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    height: "65%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E0E7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  contactAvatarText: {
    color: "#4F46E5",
    fontWeight: "bold",
    fontSize: 18,
  },
  contactName: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 4,
  }
});
