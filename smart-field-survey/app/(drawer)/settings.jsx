import { useState } from "react";
import { View, Text, StyleSheet, Switch, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  const renderSettingRow = (icon, title, value, onValueChange) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Ionicons name={icon} size={24} color="#64748B" />
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      <Switch 
        value={value} 
        onValueChange={onValueChange} 
        trackColor={{ false: "#E2E8F0", true: "#93C5FD" }}
        thumbColor={value ? "#2563EB" : "#F8FAFC"}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Ionicons name="settings" size={40} color="#2563EB" />
          <Text style={styles.title}>Settings</Text>
        </View>

        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          {renderSettingRow("notifications-outline", "Push Notifications", pushNotifications, setPushNotifications)}
          <View style={styles.divider} />
          {renderSettingRow("mail-outline", "Email Notifications", emailNotifications, setEmailNotifications)}
        </View>

        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.card}>
          {renderSettingRow("moon-outline", "Dark Mode", darkMode, setDarkMode)}
          <View style={styles.divider} />
          {renderSettingRow("sync-circle-outline", "Auto-Sync Surveys", autoSync, setAutoSync)}
        </View>

        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <Pressable style={styles.linkRow}>
            <Text style={styles.linkText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.linkRow}>
            <Text style={styles.linkText}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </Pressable>
          <View style={styles.divider} />
          <View style={styles.versionRow}>
            <Text style={styles.linkText}>App Version</Text>
            <Text style={styles.versionText}>v1.0.0</Text>
          </View>
        </View>
        
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#475569",
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingTitle: {
    fontSize: 16,
    color: "#0F172A",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  linkText: {
    fontSize: 16,
    color: "#0F172A",
    fontWeight: "500",
  },
  versionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  versionText: {
    fontSize: 16,
    color: "#94A3B8",
    fontWeight: "600",
  },
});
