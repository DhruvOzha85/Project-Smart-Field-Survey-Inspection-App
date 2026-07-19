import { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Alert, RefreshControl, ActivityIndicator, Modal, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import * as Contacts from "expo-contacts";
import { getContacts, saveContact, deleteContact } from "../../db/database";
import useStore from "../../store/useStore";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export default function ContactsScreen() {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const { darkMode } = useStore();
  const navigation = useNavigation();

  const loadContacts = async () => {
    setLoading(true);
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
      
      setContacts([...localData, ...deviceContacts]);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to load contacts.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadContacts();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadContacts();
    setRefreshing(false);
  };

  const handleAddContact = async () => {
    if (!newName.trim()) {
      Alert.alert("Validation", "Name is required.");
      return;
    }
    
    try {
      await saveContact({ name: newName, phone: newPhone });
      setNewName("");
      setNewPhone("");
      setAddModalVisible(false);
      loadContacts();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to add contact.");
    }
  };

  const handleDelete = (id) => {
    Alert.alert("Delete", "Are you sure you want to delete this contact?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        await deleteContact(id);
        loadContacts();
      }}
    ]);
  };

  const copyNumber = async (number) => {
    if (number) {
      await Clipboard.setStringAsync(number);
      Alert.alert("Copied", "Phone number copied to clipboard.");
    }
  };

  const filteredContacts = contacts.filter(contact => {
    return contact.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const theme = {
    background: darkMode ? "#0F172A" : "#F8FAFC",
    card: darkMode ? "#1E293B" : "white",
    text: darkMode ? "#F1F5F9" : "#0F172A",
    textSecondary: darkMode ? "#94A3B8" : "#64748B",
    border: darkMode ? "#334155" : "#E2E8F0",
    inputBg: darkMode ? "#1E293B" : "white",
    primary: "#4F46E5",
  };

  const renderContact = ({ item }) => {
    const initial = item.name ? item.name.charAt(0).toUpperCase() : "?";

    return (
      <View style={[styles.contactCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={[styles.avatarContainer, { backgroundColor: darkMode ? "#3730A3" : "#E0E7FF" }]}>
          <Text style={[styles.avatarText, { color: theme.primary }]}>{initial}</Text>
        </View>
        
        <View style={styles.contactInfo}>
          <Text style={[styles.contactName, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
          <Text style={[styles.contactPhone, { color: theme.textSecondary }]}>{item.phone || "No Number"}</Text>
        </View>

        {item.phone ? (
          <Pressable 
            style={({ pressed }) => [
              styles.actionButton, 
              { backgroundColor: darkMode ? "#334155" : "#F1F5F9", opacity: pressed ? 0.7 : 1 }
            ]} 
            onPress={() => copyNumber(item.phone)}
          >
            <Ionicons name="copy-outline" size={20} color={theme.primary} />
          </Pressable>
        ) : null}
        
        {(!item.id || !item.id.toString().startsWith("device-")) && (
          <Pressable 
            style={({ pressed }) => [
              styles.actionButton, 
              { backgroundColor: darkMode ? "#450a0a" : "#FEF2F2", marginLeft: 8, opacity: pressed ? 0.7 : 1 }
            ]} 
            onPress={() => handleDelete(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.primary, shadowColor: theme.primary }]}>
        <Pressable
          onPress={() => navigation.openDrawer()}
          style={({ pressed }) => [styles.iconButton, { backgroundColor: theme.card, opacity: pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }]}
        >
          <Ionicons name="menu" size={24} color={theme.text} />
        </Pressable>
        <Text style={styles.title}>Client Contacts</Text>

        <View style={styles.counterBadge}>
          <Text style={[styles.counterText, { color: theme.primary }]}>{filteredContacts.length} Contacts</Text>
        </View>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
        <Ionicons name="search" size={20} color={theme.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search contacts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={theme.textSecondary}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery("")} style={{ padding: 4 }}>
            <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
          </Pressable>
        )}
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading Contacts...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderContact}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Ionicons name="people-outline" size={48} color={theme.textSecondary} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No contacts found.</Text>
            </View>
          }
        />
      )}

      {/* Floating Action Button */}
      <Pressable 
        style={({ pressed }) => [
          styles.fab, 
          { backgroundColor: theme.primary, shadowColor: theme.primary, opacity: pressed ? 0.8 : 1 }
        ]} 
        onPress={() => setAddModalVisible(true)}
      >
        <Ionicons name="add" size={30} color="white" />
      </Pressable>

      {/* Add Contact Modal */}
      <Modal visible={isAddModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Add New Contact</Text>
            
            <TextInput 
              style={[styles.modalInput, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
              placeholder="Name *"
              placeholderTextColor={theme.textSecondary}
              value={newName}
              onChangeText={setNewName}
            />
            
            <TextInput 
              style={[styles.modalInput, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
              placeholder="Phone Number"
              placeholderTextColor={theme.textSecondary}
              value={newPhone}
              onChangeText={setNewPhone}
              keyboardType="phone-pad"
            />
            
            <View style={styles.modalActions}>
              <Pressable 
                style={({ pressed }) => [styles.modalBtn, { backgroundColor: theme.inputBg, borderColor: theme.border, borderWidth: 1, opacity: pressed ? 0.7 : 1 }]} 
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={[styles.modalBtnText, { color: theme.text }]}>Cancel</Text>
              </Pressable>
              
              <Pressable 
                style={({ pressed }) => [styles.modalBtn, { backgroundColor: theme.primary, opacity: pressed ? 0.7 : 1 }]} 
                onPress={handleAddContact}
              >
                <Text style={[styles.modalBtnText, { color: "white" }]}>Save Contact</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 8 }
    })
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "white",
  },
  counterBadge: {
    backgroundColor: "white",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  counterText: {
    fontSize: 14,
    fontWeight: "700",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    height: 54,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "800",
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    fontWeight: "500",
  },
  actionButton: {
    padding: 10,
    borderRadius: 12,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 8 }
    })
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    borderRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 24,
  },
  modalInput: {
    height: 54,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 12,
  },
  modalBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  modalBtnText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
