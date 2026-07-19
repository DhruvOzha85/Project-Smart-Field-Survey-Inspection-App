# Project-Smart-Field-Survey-Inspection-App

## Overview

A **React Native** mobile application for conducting smart field surveys and inspections. The app provides a robust and user‑friendly interface for collecting, managing, and syncing survey data in real time. It includes modules for camera capture, geolocation, contact management, settings, and a profile dashboard.

## Features

- **Drawer Navigation** with tabs for home, camera, contacts, location, and settings.
- **Camera Integration** for capturing photos directly within surveys.
- **Geolocation** to tag each survey entry with precise GPS coordinates.
- **Contact Management** allowing field agents to store and select contacts on the fly.
- **Offline‑First Design** – data is stored locally and synced when network connectivity is restored.
- **Profile Dashboard** displaying user information and survey statistics.
- **Theming** with dark mode support for low‑light field conditions.

## Prerequisites

- Node.js (>=18) and npm/yarn.
- React Native CLI.
- Android Studio (for Android) or Xcode (for iOS) with corresponding device emulators.
- A physical device or simulator with camera and location permissions enabled.

## Getting Started

```bash
# Clone the repository (if applicable)
git clone <repo-url>
cd Project-Smart-Field-Survey-Inspection-App/smart-field-survey

# Install dependencies
npm install
# or using yarn
# yarn install

# Run the Metro bundler
npm start
```

### Running on Android

```bash
# Make sure an Android emulator is running or a device is connected
npm run android
```

### Running on iOS

```bash
# Requires a Mac with Xcode installed
npm run ios
```

## Project Structure

```
smart-field-survey/
├─ app/
│  ├─ (drawer)/
│  │  ├─ camera.jsx      # Camera screen implementation
│  │  ├─ contacts.jsx    # Contact list management
│  │  ├─ location.jsx    # GPS handling and map view
│  │  ├─ profile.jsx     # User profile and stats
│  │  └─ settings.jsx    # App settings and preferences
│  └─ ...                # Additional shared components
├─ index.js               # Entry point
├─ package.json           # Project metadata and scripts
└─ ...                    # Other config files (babel, metro, etc.)
```

## Scripts

- `npm start` – Starts the Metro bundler.
- `npm run android` – Builds and launches the Android app.
- `npm run ios` – Builds and launches the iOS app.
- `npm run lint` – Runs ESLint for code quality checks.
- `npm test` – Executes any Jest tests (if present).

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Make your changes, ensuring they follow the existing code style.
4. Submit a pull request with a clear description of the changes.

## License

This project is licensed under the MIT License – see the `LICENSE` file for details.

## Contact

For questions or support, please open an issue or contact the maintainer at `support@example.com`.