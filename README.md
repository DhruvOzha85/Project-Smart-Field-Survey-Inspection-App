# Smart Field Survey & Inspection App

A robust **React Native (Expo)** mobile application designed for conducting field surveys and inspections in areas with low or no internet connectivity. The app uses an **offline-first architecture** to collect, manage, and store survey data locally, ensuring no data loss and seamless field operations.

## ✨ Key Features

- **True Offline-First Architecture**: Powered by `expo-sqlite`, all survey data and contacts are stored securely on the local device database.
- **Global State Management**: Uses `zustand` to persist active survey drafts and app settings (like Dark Mode) across app restarts without losing progress.
- **Integrated Camera (`expo-camera`)**: Capture photos directly within the app and automatically attach them to your active survey draft.
- **GPS Location Tagging (`react-native-maps`)**: Automatically fetch and tag surveys with precise GPS coordinates, and view your current location on an interactive map.
- **Local Contact Management**: Maintain a local database of field contacts (supervisors, clients) that can be linked directly to survey records.
- **Data Export & Sharing**: Generate and export all collected survey data as a `.csv` file using `expo-file-system` and `expo-sharing`.
- **Dynamic Theming**: Full Dark Mode support tailored for low-light field conditions, persisting via local storage.

## 🛠️ Technology Stack

- **Framework**: React Native (Expo)
- **Routing**: Expo Router (Drawer & Tabs)
- **Local Database**: `expo-sqlite`
- **State Management**: Zustand + AsyncStorage
- **Hardware Integrations**: 
  - `expo-camera` (Photo Capture)
  - `expo-location` & `react-native-maps` (GPS & Mapping)
  - `expo-clipboard` (Data copying)
  - `expo-file-system` & `expo-sharing` (CSV Export)

## 🚀 Getting Started

### Prerequisites

- Node.js (>=18)
- Expo CLI
- Expo Go app on your physical device (Recommended for testing Camera and Location) or a properly configured iOS Simulator / Android Emulator.

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd Project-Smart-Field-Survey-Inspection-App/smart-field-survey

# Install dependencies
npm install

# Start the Expo development server
npm start
```

Once the server is running, scan the QR code using the **Expo Go** app on your physical device to test the hardware integrations (Camera & GPS).

## 📁 Project Structure

```
smart-field-survey/
├─ app/
│  ├─ (drawer)/
│  │  ├─ (tabs)/
│  │  │  ├─ index.jsx      # Home Dashboard
│  │  │  ├─ survey.jsx     # Survey Creation Form
│  │  │  └─ profile.jsx    # Stats Dashboard & CSV Export
│  │  ├─ camera.jsx        # Camera capture integrated with survey draft
│  │  ├─ contacts.jsx      # SQLite Contact list management
│  │  ├─ location.jsx      # GPS tagging and MapView
│  │  └─ settings.jsx      # Zustand-powered preferences (Dark Mode)
├─ db/
│  └─ database.js          # SQLite initialization and CRUD operations
├─ store/
│  └─ useStore.js          # Zustand global state (Drafts & Settings)
├─ package.json            # Project dependencies
└─ app.json                # Expo configuration
```

## 📱 Core Workflows

1. **Creating a Survey**: Head to the "Survey" tab. The form is tied to a global Zustand draft. If you leave the tab to capture a photo or location, your form data is preserved.
2. **Taking a Photo**: Navigate to the Camera tab, grant permissions, snap a photo, and hit "Use Photo". The image URI is saved to the draft and you are routed back.
3. **Saving Offline**: When the survey form is complete, hitting "Save Survey Offline" writes the record into the local SQLite database and clears the draft.
4. **Exporting Data**: Head to your Profile tab to view live stats fetched from SQLite. Hit "Export Data to CSV" to generate a spreadsheet of all surveys and share it via your device's native sharing sheet.

## 🎨 UI Enhancements

- Refreshed the entire UI with a premium **Slate & Indigo** design system.
- Added smooth shadows, rounded corners, and active press states across all screens.
- Implemented dark mode support for Camera and Settings screens.
- Updated icons to use `Ionicons` outline/filled variants for a cohesive look.
- Enhanced button styles with platform‑specific elevation/shadow.

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Make your changes, ensuring they follow the existing code style.
4. Submit a pull request with a clear description of the changes.

## 📄 License

This project is licensed under the MIT License – see the `LICENSE` file for details.