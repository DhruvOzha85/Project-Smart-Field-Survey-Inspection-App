import { useState } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Alert, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const initialSurveys = [
  { id: "SRV-001", siteName: "Alpha Farm", client: "John Doe", priority: "High", date: "2023-10-12", status: "Completed", notes: "All good" },
  { id: "SRV-002", siteName: "Beta Factory", client: "Jane Smith", priority: "Medium", date: "2023-10-15", status: "Pending", notes: "Needs review" },
  { id: "SRV-003", siteName: "Gamma Warehouse", client: "Bob Jones", priority: "Low", date: "2023-10-18", status: "In Progress", notes: "Started inspection" },
];

export default function HistoryScreen() {
  const [surveys, setSurveys] = useState(initialSurveys);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");
  
  const [selectedSurvey, setSelectedSurvey] = useState(null); 

  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.siteName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          survey.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === "All" || survey.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const deleteSurvey = (id) => {
    Alert.alert("Delete Survey", "Are you sure you want to delete this survey?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => {
          setSurveys(surveys.filter(s => s.id !== id));
          setSelectedSurvey(null);
      }}
    ]);
  };

  const renderSurvey = ({ item }) => (
    <Pressable style={styles.surveyCard} onPress={() => setSelectedSurvey(item)}>
      <View style={styles.cardHeader}>
        <Text style={styles.surveyId}>{item.id}</Text>
        <View style={[styles.priorityBadge, 
          item.priority === 'High' ? styles.priorityHigh : 
          item.priority === 'Medium' ? styles.priorityMedium : styles.priorityLow
        ]}>
          <Text style={[styles.priorityText, 
            item.priority === 'High' ? styles.priorityTextHigh : 
            item.priority === 'Medium' ? styles.priorityTextMedium : styles.priorityTextLow
          ]}>{item.priority}</Text>
        </View>
      </View>
      
      <Text style={styles.siteName}>{item.siteName}</Text>
      <Text style={styles.clientText}>Client: {item.client}</Text>
      
      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>{item.date}</Text>
        <View style={styles.statusContainer}>
          <Ionicons name="ellipse" size={10} color={item.status === 'Completed' ? '#10B981' : '#F59E0B'} />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Survey History</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Site Name or ID..."
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

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter:</Text>
        {['All', 'High', 'Medium', 'Low'].map(p => (
          <Pressable 
            key={p} 
            style={[styles.filterChip, filterPriority === p && styles.filterChipActive]}
            onPress={() => setFilterPriority(p)}
          >
            <Text style={[styles.filterChipText, filterPriority === p && styles.filterChipTextActive]}>{p}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredSurveys}
        keyExtractor={item => item.id}
        renderItem={renderSurvey}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color="#CBD5E1" />
            <Text style={styles.emptyText}>No surveys found.</Text>
          </View>
        }
      />

      <Modal visible={!!selectedSurvey} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedSurvey && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Survey Details</Text>
                  <Pressable onPress={() => setSelectedSurvey(null)}>
                    <Ionicons name="close-circle" size={32} color="#94A3B8" />
                  </Pressable>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Survey ID:</Text>
                  <Text style={styles.detailValue}>{selectedSurvey.id}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Site Name:</Text>
                  <Text style={styles.detailValue}>{selectedSurvey.siteName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Client:</Text>
                  <Text style={styles.detailValue}>{selectedSurvey.client}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date:</Text>
                  <Text style={styles.detailValue}>{selectedSurvey.date}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text style={styles.detailValue}>{selectedSurvey.status}</Text>
                </View>
                <View style={styles.notesContainer}>
                  <Text style={styles.detailLabel}>Notes:</Text>
                  <Text style={styles.notesText}>{selectedSurvey.notes}</Text>
                </View>

                <View style={styles.modalActions}>
                  <Pressable style={[styles.modalBtn, styles.editBtn]} onPress={() => {
                    Alert.alert("Edit", "Survey edit mode opened (Mock).");
                    setSelectedSurvey(null);
                  }}>
                    <Ionicons name="pencil" size={20} color="white" />
                    <Text style={styles.btnText}>Edit</Text>
                  </Pressable>
                  
                  <Pressable style={[styles.modalBtn, styles.deleteBtn]} onPress={() => deleteSurvey(selectedSurvey.id)}>
                    <Ionicons name="trash" size={20} color="white" />
                    <Text style={styles.btnText}>Delete</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#0F172A" },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "white", marginHorizontal: 20, marginBottom: 15, paddingHorizontal: 15, borderRadius: 12, borderWidth: 1, borderColor: "#E2E8F0", height: 50 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: "#0F172A" },
  filterContainer: { flexDirection: "row", alignItems: "center", marginHorizontal: 20, marginBottom: 20, flexWrap: "wrap", gap: 8 },
  filterLabel: { fontSize: 14, fontWeight: "600", color: "#64748B", marginRight: 5 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: "#F1F5F9", borderWidth: 1, borderColor: "#E2E8F0" },
  filterChipActive: { backgroundColor: "#2563EB", borderColor: "#2563EB" },
  filterChipText: { fontSize: 13, color: "#64748B", fontWeight: "500" },
  filterChipTextActive: { color: "white" },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  surveyCard: { backgroundColor: "white", padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: "#F1F5F9", elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  surveyId: { fontSize: 12, color: "#64748B", fontWeight: "600" },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  priorityHigh: { backgroundColor: "#FEE2E2" },
  priorityMedium: { backgroundColor: "#FEF3C7" },
  priorityLow: { backgroundColor: "#DCFCE7" },
  priorityText: { fontSize: 11, fontWeight: "bold" },
  priorityTextHigh: { color: "#EF4444" },
  priorityTextMedium: { color: "#F59E0B" },
  priorityTextLow: { color: "#10B981" },
  siteName: { fontSize: 18, fontWeight: "bold", color: "#0F172A", marginBottom: 4 },
  clientText: { fontSize: 14, color: "#475569", marginBottom: 12 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: "#F1F5F9", paddingTop: 12 },
  dateText: { fontSize: 12, color: "#94A3B8" },
  statusContainer: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusText: { fontSize: 13, fontWeight: "500", color: "#475569" },
  emptyContainer: { alignItems: "center", marginTop: 40 },
  emptyText: { marginTop: 12, color: "#94A3B8", fontSize: 16 },
  
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "white", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 400 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: "bold", color: "#0F172A" },
  detailRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  detailLabel: { fontSize: 15, color: "#64748B", fontWeight: "500" },
  detailValue: { fontSize: 15, color: "#0F172A", fontWeight: "bold" },
  notesContainer: { paddingVertical: 12 },
  notesText: { marginTop: 8, fontSize: 15, color: "#475569", lineHeight: 22 },
  modalActions: { flexDirection: "row", justifyContent: "space-between", marginTop: 30, gap: 12 },
  modalBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 16, borderRadius: 12, gap: 8 },
  editBtn: { backgroundColor: "#2563EB" },
  deleteBtn: { backgroundColor: "#EF4444" },
  btnText: { color: "white", fontSize: 16, fontWeight: "bold" }
});
