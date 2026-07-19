import { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { documentDirectory, writeAsStringAsync, EncodingType } from "expo-file-system";
import * as Sharing from "expo-sharing";
import useStore from "../../../store/useStore";
import { getSurveys } from "../../../db/database";

export default function ProfileScreen() {
  const { darkMode } = useStore();
  const [stats, setStats] = useState({
    total: 0,
    recent: 0,
    withPhotos: 0,
  });
  const [loading, setLoading] = useState(false);
  const [surveys, setSurveys] = useState([]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const allSurveys = await getSurveys();
      setSurveys(allSurveys);
      
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      let recentCount = 0;
      let photoCount = 0;

      allSurveys.forEach(s => {
        if (s.photoUri) photoCount++;
        if (new Date(s.timestamp) >= oneWeekAgo) recentCount++;
      });

      setStats({
        total: allSurveys.length,
        recent: recentCount,
        withPhotos: photoCount,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  const exportCSV = async () => {
    if (surveys.length === 0) {
      Alert.alert("No Data", "There are no surveys to export.");
      return;
    }

    try {
      // Basic CSV generation
      const header = "ID,Title,Description,Latitude,Longitude,ContactID,Timestamp\n";
      const rows = surveys.map(s => {
        // escape commas in strings
        const title = `"${s.title.replace(/"/g, '""')}"`;
        const desc = `"${s.description.replace(/"/g, '""')}"`;
        return `${s.id},${title},${desc},${s.latitude || ''},${s.longitude || ''},${s.contactId || ''},${s.timestamp}`;
      }).join("\n");

      const csvData = header + rows;
      const fileUri = documentDirectory + "surveys_export.csv";
      
      await writeAsStringAsync(fileUri, csvData, { encoding: EncodingType.UTF8 });
      
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "text/csv",
          dialogTitle: "Export Survey Data",
        });
      } else {
        Alert.alert("Export Error", "Sharing is not available on this device.");
      }
    } catch (error) {
      console.error("Error exporting CSV:", error);
      Alert.alert("Export Error", "Failed to generate CSV file.");
    }
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: () => console.log("Logged out") }
    ]);
  };

  const theme = {
    background: darkMode ? "#0F172A" : "#F8FAFC",
    card: darkMode ? "#1E293B" : "white",
    text: darkMode ? "#F1F5F9" : "#0F172A",
    textSecondary: darkMode ? "#94A3B8" : "#64748B",
    border: darkMode ? "#334155" : "#E2E8F0",
    optionBg: darkMode ? "#334155" : "#F1F5F9",
    primary: "#4F46E5",
  };

  const renderOption = (icon, title, color = theme.text, onPress = null) => (
    <Pressable 
      style={({ pressed }) => [
        styles.optionRow, 
        { borderBottomColor: theme.border, backgroundColor: pressed ? (darkMode ? '#334155' : '#F8FAFC') : 'transparent' }
      ]} 
      onPress={onPress ? onPress : () => Alert.alert(title, `${title} settings coming soon!`)}
    >
      <View style={[styles.optionIconContainer, { backgroundColor: theme.optionBg }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={[styles.optionTitle, { color }]}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={[styles.header, { backgroundColor: theme.primary, shadowColor: theme.primary }]}>
          <View style={styles.avatarContainer}>
            <Text style={[styles.avatarText, { color: theme.primary }]}>DO</Text>
          </View>
          <Text style={styles.nameText}>Dhruv Ozha</Text>
          <Text style={styles.roleText}>B.E. CSE Student</Text>
        </View>

        <View style={[styles.statsContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {loading ? (
             <ActivityIndicator size="small" color={theme.primary} style={{flex: 1}} />
          ) : (
            <>
              <View style={styles.statBox}>
                <Text style={[styles.statNumber, { color: theme.text }]}>{stats.total}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Surveys</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <View style={styles.statBox}>
                <Text style={[styles.statNumber, { color: theme.text }]}>{stats.recent}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>This Week</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <View style={styles.statBox}>
                <Text style={[styles.statNumber, { color: theme.text }]}>{stats.withPhotos}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>With Photos</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.optionsContainer}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Data Management</Text>
          <View style={[styles.optionsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {renderOption("download-outline", "Export Data to CSV", "#10B981", exportCSV)}
          </View>

          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Account Settings</Text>
          <View style={[styles.optionsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {renderOption("person-outline", "Edit Profile")}
            {renderOption("notifications-outline", "Notifications")}
            {renderOption("shield-checkmark-outline", "Privacy & Security")}
          </View>
          
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Support</Text>
          <View style={[styles.optionsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {renderOption("help-circle-outline", "Help Center")}
            {renderOption("document-text-outline", "Terms of Service")}
          </View>

          <Pressable 
            style={({ pressed }) => [
              styles.logoutButton, 
              { backgroundColor: darkMode ? "#450a0a" : "#FEF2F2", opacity: pressed ? 0.7 : 1 }
            ]} 
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingVertical: 36,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 24,
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 8 }
    })
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 4,
    borderColor: "#E0E7FF",
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "800",
  },
  nameText: {
    fontSize: 24,
    fontWeight: "800",
    color: "white",
    marginBottom: 6,
  },
  roleText: {
    fontSize: 16,
    color: "#E0E7FF",
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 24,
    marginBottom: 32,
    borderWidth: 1,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8 },
      android: { elevation: 2 }
    })
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  divider: {
    width: 1,
    height: "100%",
    alignSelf: "center",
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
    marginLeft: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  optionsCard: {
    borderRadius: 20,
    marginBottom: 32,
    borderWidth: 1,
    overflow: "hidden",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  optionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FCA5A5",
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#EF4444",
  },
});
