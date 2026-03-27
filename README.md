# 🛡️ PROJECT RAKSHAK

## Tactical Command Dashboard

---

<div align="center">

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![Dexie.js](https://img.shields.io/badge/Dexie.js-4.0.11-00D68F?style=for-the-badge&logo=dexie&logoColor=white)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Core Features](#-core-features)
- [Hotkeys Reference](#-hotkeys-reference)
- [Tech Stack](#-tech-stack)
- [Local Setup & Installation](#-local-setup--installation)
- [Project Structure](#-project-structure)
- [Usage Guide](#-usage-guide)
- [License](#-license)

---

## 🎯 Overview

**Project Rakshak** is a fully client-side, IndexedDB-powered tactical border and camp management system that simulates real-time military logistics operations. Built for the Indian Armed Forces command centers, this application provides a comprehensive dashboard for monitoring border camps, managing supply chains, and responding to tactical alerts.

The system features an interactive radar map with real-time convoy visualization, dynamic supply management, secure access protocols, and advanced analytics—all running entirely in the browser with no backend required.

---

## 🚀 Core Features

### 🗺️ Interactive Radar Map
- Real-time visualization of military camps across the Indian border
- Custom animated radar scan overlay
- Camp markers with status indicators (Normal, Alert, Critical)
- Line of Control (LoC) and Line of Actual Control (LAC) border visualization
- Click-to-select camp interaction

### 🚚 Dynamic Supply Convoys
- Animated convoy paths between camps
- Real-time progress tracking
- Support for 3 payload types: Ammunition, Food, Medical Supplies
- Visual route visualization on map
- Automatic convoy management system

### 🔐 Secure Access Protocol
- Tactical login screen with typing animation effect
- Hardcoded passcode: `RAKSHAK-007`
- Access Denied flash effect on wrong passcode
- Dark themed, military-style interface

### 📊 Tactical Analytics Dashboard
- Real-time statistics overview
- Status distribution charts (Normal, Alert, Critical)
- Ammo and supply level trends
- Camp-by-camp comparison graphs
- Top critical camps ranking

### 📤 SitRep Data Export
- Export complete situation reports as JSON
- Includes camp data, logs, and summary statistics
- Automatic file download: `rakshak_sitrep_[date].json`
- Command Terminal logging for audit trail

### 🖥️ Command Terminal
- Real-time activity logging
- Color-coded message types (INFO, WARNING, CRITICAL)
- Scrollable log history
- Clear logs functionality

### ⚡ Quick Actions
- Simulate Alert: Randomly trigger critical conditions
- Add New Camp: Interactive map click for location
- Export SitRep: One-click report generation

---

## ⌨️ Hotkeys Reference

| Shortcut | Action |
|----------|--------|
| `Shift + T` | Toggle Command Terminal Panel |
| `Shift + A` | Open Add New Camp Modal |
| `Shift + R` | Open Analytics Dashboard |
| `Escape` | Close All Modals/Panels |

> 💡 Click the **HOTKEYS** button in the top navbar for quick reference.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Component Library |
| **Vite** | Build Tool & Dev Server |
| **Tailwind CSS** | Utility-first CSS Framework |
| **Leaflet** | Interactive Map Rendering |
| **Dexie.js** | IndexedDB Wrapper for Client-Side Storage |
| **Zustand** | State Management |
| **Recharts** | Analytics Charts |
| **Lucide React** | Icon Library |
| **react-hotkeys-hook** | Keyboard Shortcuts |

---

## 💻 Local Setup & Installation

### Prerequisites

- Node.js v20.x or higher
- npm v10.x or higher

### Installation Steps

```bash
# Clone the repository
git clone https://github.com/lostxmusafir/27-03.git

# Navigate to project directory
cd 27-03

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access the Application

1. Open your browser and navigate to `http://localhost:5173`
2. Enter the clearance code: `RAKSHAK-007`
3. Access the tactical dashboard

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
project-rakshak/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── AddCampForm.jsx        # Add new camp modal
│   │   ├── AnalyticsDashboard.jsx # Analytics charts modal
│   │   ├── CampDetailPanel.jsx    # Camp details side panel
│   │   ├── CommandTerminal.jsx    # Activity logs terminal
│   │   ├── LoginScreen.jsx        # Secure login screen
│   │   ├── MapView.jsx            # Interactive radar map
│   │   ├── Navbar.jsx             # Top navigation bar
│   │   ├── Sidebar.jsx            # Camp list & actions
│   │   └── ToastContainer.jsx     # Toast notifications
│   ├── store/
│   │   └── useStore.js            # Zustand state store
│   ├── utils/
│   │   └── logger.js              # Logging utility
│   ├── App.jsx                    # Main application
│   ├── db.js                      # Dexie database setup
│   ├── index.css                  # Global styles
│   └── main.jsx                   # Entry point
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## 📖 Usage Guide

### 1. Login
- Enter the clearance code: `RAKSHAK-007`
- Press Enter or click "AUTHENTICATE"

### 2. View Camps
- All active camps are displayed in the left sidebar
- Click on any camp to view detailed information
- Camp status is color-coded: 🟢 Normal, 🟡 Alert, 🔴 Critical

### 3. Manage Camps
- Click "ADD CAMP" to create a new military camp
- Click on the map to set the camp location
- Fill in camp details and submit

### 4. Monitor Convoys
- Active convoys are displayed as animated paths on the map
- Track progress in real-time
- Three payload types available

### 5. Analytics
- Click "ANALYTICS" in the navbar
- View comprehensive statistics and trends
- Identify critical camps requiring attention

### 6. Export Reports
- Click "EXPORT SITREP" in the sidebar
- Download complete situation report as JSON
- Use for offline analysis or record keeping

### 7. Command Terminal
- Toggle visibility with `Shift + T`
- Monitor real-time system activities
- Clear logs as needed

---

## 🎨 Design Philosophy

Project Rakshak follows a **tactical military aesthetic**:
- Dark slate background for reduced eye strain
- Emerald green accents for active/safe status
- Red accents for alerts and critical conditions
- Cyan/blue for informational elements
- Monospace fonts for data display
- Glass morphism effects for modern appeal

---

## 📝 License

This project is developed for educational and demonstration purposes.

---

<div align="center">

**🛡️ PROJECT RAKSHAK • COMMAND CENTER**

*"Securing Borders, Managing Resources"*

</div>