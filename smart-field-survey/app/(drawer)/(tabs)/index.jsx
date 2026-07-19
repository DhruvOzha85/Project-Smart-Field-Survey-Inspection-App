import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useStore from "../../../store/useStore";

export default function Dashboard() {
  const router = useRouter();
  const navigation = useNavigation();
  const { darkMode } = useStore();

  const theme = {
    background: darkMode ? "#0F172A" : "#F8FAFC",
    card: darkMode ? "#1E293B" : "white",
    text: darkMode ? "#F1F5F9" : "#0F172A",
    textSecondary: darkMode ? "#94A3B8" : "#64748B",
    border: darkMode ? "#334155" : "#E2E8F0",
    primary: "#4F46E5",
    primaryLight: darkMode ? "#3730A3" : "#EEF2FF",
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.welcomeText, { color: theme.textSecondary }]}>Welcome back,</Text>
            <Text style={[styles.appName, { color: theme.text }]}>Dhruv Ozha</Text>
          </View>
          
          <View style={styles.headerActions}>
            <Pressable 
              onPress={() => navigation.openDrawer()}
              style={({ pressed }) => [
                styles.iconButton, 
                { backgroundColor: theme.card, opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <Ionicons name="menu" size={24} color={theme.text} />
            </Pressable>
            
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>DO</Text>
            </View>
          </View>
        </View>

        {/* Hero Summary Card */}
        <View style={[styles.summaryCard, { backgroundColor: theme.primary }]}>
          <View style={styles.studentDetails}>
            <Text style={styles.studentCourse}>Smart Field Survey</Text>
            <Text style={styles.studentName}>B.E. CSE Student</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.surveyCountContainer}>
            <Text style={styles.surveyCountNumber}>5</Text>
            <Text style={styles.surveyCountLabel}>Today&apos;s Surveys</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <Pressable 
            style={({ pressed }) => [
              styles.actionCard, 
              { backgroundColor: darkMode ? "#1e1b4b" : "#EEF2FF", opacity: pressed ? 0.8 : 1 }
            ]} 
            onPress={() => router.push("/survey")}
          >
            <View style={[styles.iconCircle, { backgroundColor: darkMode ? "#3730a3" : "#C7D2FE" }]}>
               <Ionicons name="document-text" size={26} color="#4F46E5" />
            </View>
            <Text style={[styles.actionText, { color: theme.text }]}>New Survey</Text>
          </Pressable>

          <Pressable 
            style={({ pressed }) => [
              styles.actionCard, 
              { backgroundColor: darkMode ? "#064e3b" : "#DCFCE7", opacity: pressed ? 0.8 : 1 }
            ]} 
            onPress={() => router.push("/camera")}
          >
            <View style={[styles.iconCircle, { backgroundColor: darkMode ? "#065f46" : "#BBF7D0" }]}>
               <Ionicons name="camera" size={26} color="#059669" />
            </View>
            <Text style={[styles.actionText, { color: theme.text }]}>Camera</Text>
          </Pressable>

          <Pressable 
            style={({ pressed }) => [
              styles.actionCard, 
              { backgroundColor: darkMode ? "#450a0a" : "#FEE2E2", opacity: pressed ? 0.8 : 1 }
            ]} 
            onPress={() => router.push("/profile")}
          >
            <View style={[styles.iconCircle, { backgroundColor: darkMode ? "#7f1d1d" : "#FECACA" }]}>
               <Ionicons name="pie-chart" size={26} color="#DC2626" />
            </View>
            <Text style={[styles.actionText, { color: theme.text }]}>Stats</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeaderRow}>
           <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Surveys</Text>
           <Pressable>
              <Text style={{ color: theme.primary, fontWeight: '600' }}>See All</Text>
           </Pressable>
        </View>
        
        <View style={[styles.recentSurveyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.recentSurveyHeader}>
            <Text style={[styles.siteName, { color: theme.text }]}>ABC Farm Inspection</Text>
            <View style={styles.priorityBadge}>
              <Text style={styles.priorityText}>High</Text>
            </View>
          </View>
          <Text style={[styles.clientName, { color: theme.textSecondary }]}>Client: Ritesh</Text>
          <Text style={[styles.surveyDate, { color: theme.textSecondary }]}>Today, 10:30 AM</Text>
          
          <View style={[styles.statusDivider, { backgroundColor: theme.border }]} />
          
          <View style={styles.statusContainer}>
            <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            <Text style={styles.statusText}>Completed & Saved</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  appName: {
    fontSize: 26,
    fontWeight: "800",
  },
  headerActions: {
    flexDirection: "row", 
    gap: 12, 
    alignItems: "center" 
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 }
    })
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E7FF",
  },
  avatarText: {
    color: "white",
    fontSize: 15,
    fontWeight: "800",
  },
  summaryCard: {
    borderRadius: 20,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
    ...Platform.select({
      ios: { shadowColor: "#4F46E5", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 12 },
      android: { elevation: 12 }
    })
  },
  studentDetails: {
    flex: 1,
  },
  studentCourse: {
    color: "#E0E7FF",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  studentName: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 20,
  },
  surveyCountContainer: {
    alignItems: "center",
  },
  surveyCountNumber: {
    color: "white",
    fontSize: 40,
    fontWeight: "800",
  },
  surveyCountLabel: {
    color: "#E0E7FF",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 16,
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 36,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "700",
  },
  recentSurveyCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 40,
    borderWidth: 1,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8 },
      android: { elevation: 2 }
    })
  },
  recentSurveyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  siteName: {
    fontSize: 17,
    fontWeight: "800",
  },
  priorityBadge: {
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  priorityText: {
    color: "#DC2626",
    fontSize: 11,
    fontWeight: "800",
    textTransform: 'uppercase',
  },
  clientName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  surveyDate: {
    fontSize: 13,
    marginBottom: 16,
  },
  statusDivider: {
    height: 1,
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    marginLeft: 8,
    color: "#10B981",
    fontSize: 14,
    fontWeight: "700",
  },
});
