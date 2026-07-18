import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Alert, RefreshControl,ActivityIndicator} from "react-native";
import * as Contacts from "expo-contacts";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ContactsScreen() {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [permission, setPermission] = useState(null);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      setPermission(status);
      
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
          sort: Contacts.SortTypes.FirstName,
        });
        
        if (data.length > 0) {
          setContacts(data);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load contacts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadContacts();
    setRefreshing(false);
  };

  const copyNumber = async (number) => {
    if (number) {
      await Clipboard.setStringAsync(number);
      Alert.alert("Copied", "Phone number copied to clipboard.");
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const nameMatch = contact.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch;
  });

  const renderContact = ({ item }) => {
    const phoneNumber = item.phoneNumbers && item.phoneNumbers[0]?.number;
    
    const initial = item.name ? item.name.charAt(0).toUpperCase() : "?";

    return (
      <View style={styles.contactCard}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        
        <View style={styles.contactInfo}>
          <Text style={styles.contactName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.contactPhone}>{phoneNumber || "No Number"}</Text>
        </View>

        {phoneNumber && (
          <Pressable 
            style={styles.copyButton} 
            onPress={() => copyNumber(phoneNumber)}
          >
            <Ionicons name="copy-outline" size={20} color="#2563EB" />
          </Pressable>
        )}
      </View>
    );
  };

  if (permission === 'denied') {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Ionicons name="people" size={60} color="#94A3B8" />
        <Text style={styles.errorText}>Contacts permission denied</Text>
        <Pressable style={styles.retryButton} onPress={loadContacts}>
          <Text style={styles.retryText}>Try Again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Client Contacts</Text>
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>{filteredContacts.length} Contacts</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#94A3B8"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#94A3B8" />
          </Pressable>
        )}
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading Contacts...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id || Math.random().toString()}
          renderItem={renderContact}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#2563EB"]}
            />
          }
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Ionicons name="people-outline" size={48} color="#CBD5E1" />
              <Text style={styles.emptyText}>No contacts found.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F172A",
  },
  counterBadge: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  counterText: {
    color: "#1D4ED8",
    fontSize: 14,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#0F172A",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: "#64748B",
  },
  copyButton: {
    padding: 10,
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
  },
  errorText: {
    marginTop: 15,
    fontSize: 16,
    color: "#475569",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: "white",
    fontWeight: "bold",
  },
  loadingText: {
    marginTop: 12,
    color: "#64748B",
    fontSize: 16,
  },
  emptyText: {
    marginTop: 12,
    color: "#94A3B8",
    fontSize: 16,
  },
});
