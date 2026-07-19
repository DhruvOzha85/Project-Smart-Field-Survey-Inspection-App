import { View, Text, StyleSheet, Switch, ScrollView, Pressable, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import useStore from "../../store/useStore";
import { useNavigation } from "@react-navigation/native";


export default function SettingsScreen() {
  const { 
    pushNotifications, setPushNotifications, 
    emailNotifications, setEmailNotifications, 
    darkMode, setDarkMode, 
    autoSync, setAutoSync 
  } = useStore();
  const navigation = useNavigation();

  const theme = {
    background: darkMode ? "#0F172A" : "#F8FAFC",
    card: darkMode ? "#1E293B" : "white",
    text: darkMode ? "#F1F5F9" : "#0F172A",
    textSecondary: darkMode ? "#94A3B8" : "#475569",
    border: darkMode ? "#334155" : "#E2E8F0",
    divider: darkMode ? "#334155" : "#F1F5F9",
  };

  const renderSettingRow = (icon, title, value, onValueChange) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Ionicons name={icon} size={24} color={theme.textSecondary} />
        <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
      </View>
      <Switch 
        value={value} 
        onValueChange={onValueChange} 
        trackColor={{ false: darkMode ? "#475569" : "#E2E8F0", true: "#93C5FD" }}
        thumbColor={value ? "#2563EB" : (darkMode ? "#CBD5E1" : "#F8FAFC")}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.openDrawer()}
            style={({ pressed }) => [styles.iconButton, { backgroundColor: theme.card, opacity: pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }]}>
            <Ionicons name="menu" size={24} color={theme.text} />
          </Pressable>
          <Ionicons name="settings" size={40} color="#2563EB" />
          <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Notifications</Text>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {renderSettingRow("notifications-outline", "Push Notifications", pushNotifications, setPushNotifications)}
          <View style={[styles.divider, { backgroundColor: theme.divider }]} />
          {renderSettingRow("mail-outline", "Email Notifications", emailNotifications, setEmailNotifications)}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Preferences</Text>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {renderSettingRow("moon-outline", "Dark Mode", darkMode, setDarkMode)}
          <View style={[styles.divider, { backgroundColor: theme.divider }]} />
          {renderSettingRow("sync-circle-outline", "Auto-Sync Surveys", autoSync, setAutoSync)}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>About</Text>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Pressable style={({ pressed }) => [styles.linkRow, { backgroundColor: pressed ? theme.card : "transparent", opacity: pressed ? 0.8 : 1 }]} >
            <Text style={[styles.linkText, { color: theme.text }]}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </Pressable>
          <View style={[styles.divider, { backgroundColor: theme.divider }]} />
          <Pressable style={styles.linkRow}>
            <Text style={[styles.linkText, { color: theme.text }]}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </Pressable>
          <View style={[styles.divider, { backgroundColor: theme.divider }]} />
          <View style={styles.versionRow}>
            <Text style={[styles.linkText, { color: theme.text }]}>App Version</Text>
            <Text style={[styles.versionText, { color: theme.textSecondary }]}>v1.0.0</Text>
          </View>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    marginBottom: 25,
    borderWidth: 1,
    overflow: "hidden",
    // backgroundColor will be set inline using theme.card
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6 },
      android: { elevation: 4 }
    })
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
    fontWeight: "500",
  },
  divider: {
    height: 1,
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4 },
      android: { elevation: 2 }
    })
  },
  linkText: {
    fontSize: 16,
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
    fontWeight: "600",
  },
});
