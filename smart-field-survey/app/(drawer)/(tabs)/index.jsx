import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Dashboard() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Smart Field Survey</Text>
            <Text style={styles.appName}></Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>DO</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.studentDetails}>
            <Text style={styles.studentName}>Dhruv Ozha</Text>
            <Text style={styles.studentCourse}>B.E. CSE Student</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.surveyCountContainer}>
            <Text style={styles.surveyCountLabel}>Today's Surveys</Text>
            <Text style={styles.surveyCountNumber}>5</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <Pressable 
            style={[styles.actionCard, { backgroundColor: '#E0E7FF' }]} 
            onPress={() => router.push("/survey")}
          >
            <Ionicons name="document-text" size={32} color="#4338CA" />
            <Text style={[styles.actionText, { color: '#4338CA' }]}>New Survey</Text>
          </Pressable>

          <Pressable 
            style={[styles.actionCard, { backgroundColor: '#DCFCE7' }]} 
            onPress={() => router.push("/camera")}
          >
            <Ionicons name="camera" size={32} color="#15803D" />
            <Text style={[styles.actionText, { color: '#15803D' }]}>Camera</Text>
          </Pressable>

          <Pressable 
            style={[styles.actionCard, { backgroundColor: '#FEE2E2' }]} 
            onPress={() => router.push("/history")}
          >
            <Ionicons name="time" size={32} color="#B91C1C" />
            <Text style={[styles.actionText, { color: '#B91C1C' }]}>History</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Recent Surveys</Text>
        <View style={styles.recentSurveyCard}>
          <View style={styles.recentSurveyHeader}>
            <Text style={styles.siteName}>ABC Farm Inspection</Text>
            <View style={styles.priorityBadge}>
              <Text style={styles.priorityText}>High</Text>
            </View>
          </View>
          <Text style={styles.clientName}>Client: John Doe</Text>
          <Text style={styles.surveyDate}>Today, 10:30 AM</Text>
          <View style={styles.statusContainer}>
            <Ionicons name="checkmark-circle" size={16} color="#16A34A" />
            <Text style={styles.statusText}>Completed</Text>
          </View>
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
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: "#64748B",
    marginBottom: 4,
  },
  appName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F172A",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  summaryCard: {
    backgroundColor: "#2563EB",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  studentCourse: {
    color: "#BFDBFE",
    fontSize: 14,
  },
  divider: {
    width: 1,
    height: "80%",
    backgroundColor: "#60A5FA",
    marginHorizontal: 20,
  },
  surveyCountContainer: {
    alignItems: "center",
  },
  surveyCountNumber: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
  },
  surveyCountLabel: {
    color: "#BFDBFE",
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 16,
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 6,
  },
  actionText: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: "700",
  },
  recentSurveyCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  recentSurveyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  siteName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0F172A",
  },
  priorityBadge: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "bold",
  },
  clientName: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 4,
  },
  surveyDate: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    marginLeft: 6,
    color: "#16A34A",
    fontSize: 14,
    fontWeight: "500",
  },
});
