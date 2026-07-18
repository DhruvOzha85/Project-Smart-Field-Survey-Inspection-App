import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: "Dashboard",
          title: "Dashboard",
        }}
      />

      <Drawer.Screen
        name="camera"
        options={{
          drawerLabel: "Camera",
          title: "Camera",
        }}
      />

      <Drawer.Screen
        name="contacts"
        options={{
          drawerLabel: "Contacts",
          title: "Contacts",
        }}
      />

      <Drawer.Screen
        name="location"
        options={{
          drawerLabel: "Location",
          title: "Location",
        }}
      />

      <Drawer.Screen
        name="clipboard"
        options={{
          drawerLabel: "Clipboard",
          title: "Clipboard",
        }}
      />

      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: "Settings",
          title: "Settings",
        }}
      />
    </Drawer>
  );
}