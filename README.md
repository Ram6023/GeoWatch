# 🌍 GeoWatch - Satellite Earth Monitoring Platform

<div align="center">

![GeoWatch Logo](https://img.shields.io/badge/GeoWatch-Earth%20Monitoring-00ff88?style=for-the-badge&logo=satellite&logoColor=white)

**Monitor Earth. Detect Change. Act Smart.**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## 🛰️ Overview

GeoWatch is a **premium satellite imagery change detection platform** that enables real-time Earth observation and environmental monitoring. Built with a stunning space-themed UI, it provides NDVI analysis, automated alerts, and comprehensive reporting capabilities.

### ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🗺️ **AOI Management** | Define and manage Areas of Interest with interactive satellite map tiles |
| 📊 **NDVI Analytics** | Real-time vegetation health monitoring with trend analysis charts |
| 🔔 **Smart Alerts** | Automated change detection with email and in-app notifications |
| 📄 **PDF Reports** | Generate and export comprehensive analysis reports |
| 🌙 **Space Theme** | Premium dark mode with animated stars, orbital effects, and glassmorphism |
| 📱 **Responsive** | Fully responsive design optimized for all devices |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Ram/GeoWatch.git
cd GeoWatch

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Demo Credentials

```
Email: test@geowatch.com
Password: password123
```

---

## 🎨 Premium UI Features

GeoWatch features a **cutting-edge space-themed design** with:

### 🌌 Visual Effects
- **Animated Earth Globe** - Realistic 3D Earth visualization on login
- **Twinkling Stars** - Dynamic starfield backgrounds
- **Orbital Animations** - Satellite orbit rings and pulse effects
- **Neon Glow Effects** - Cyan and emerald accent glows
- **Glassmorphism Cards** - Frosted glass UI components

### 🎯 Design System
- **Space Color Palette** - Deep blues, cosmic purples, aurora greens
- **Orbitron Font** - Futuristic display typography
- **Gradient Buttons** - Multi-color gradient CTAs with shadows
- **Smooth Animations** - Slide-up, fade-in, pulse transitions

---

## 📂 Project Structure

```
GeoWatch/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Layout.tsx
│   │   │   └── AOIAlertsModal.tsx
│   │   ├── contexts/       # React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── pages/          # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   ├── AOIList.tsx
│   │   │   ├── CreateAOI.tsx
│   │   │   ├── AnalyticsPage.tsx
│   │   │   ├── ReportsPage.tsx
│   │   │   └── Settings.tsx
│   │   ├── services/       # Data services
│   │   │   └── mockData.ts # Mock API with localStorage
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css       # Space theme styles
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
└── README.md
```

---

## 🔧 Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI Library with Hooks |
| **TypeScript** | Type-safe JavaScript |
| **TailwindCSS** | Utility-first CSS framework |
| **Vite** | Fast build tool and dev server |
| **React Router** | Client-side routing |
| **Recharts** | Data visualization charts |
| **React Leaflet** | Interactive satellite maps |
| **Lucide React** | Modern icon library |
| **React Hot Toast** | Toast notifications |

### Map Tiles
| Provider | Usage |
|----------|-------|
| **ESRI World Imagery** | Real satellite imagery tiles |
| **NASA Earth Observatory** | Sample satellite images |

---

## 🗺️ Features in Detail

### 1. Dashboard
- Welcome hero with animated Earth
- Real-time statistics cards
- Recent monitoring zones list
- Quick action shortcuts

### 2. AOI Management
- Interactive satellite map for drawing zones
- Polygon and rectangle drawing tools
- Monitoring frequency configuration
- Change type classification
- Alert threshold settings

### 3. NDVI Analytics
- 12-month time-series charts
- Trend analysis (increasing/decreasing/stable)
- Min/Max/Average statistics
- Interactive tooltips

### 4. Reports
- Generate comprehensive reports
- Preview before download
- Export as JSON or PDF
- Zone configuration summary
- NDVI analysis included

### 5. Settings
- Dark/Light theme toggle
- Notification preferences
- Security settings
- About information

---

## 🌐 Mock Data Service

GeoWatch runs **fully offline** with a comprehensive mock data service:

- **Authentication** - Login/Signup with localStorage persistence
- **AOI CRUD** - Create, read, update, delete operations
- **Demo Data** - 4 pre-configured monitoring zones
- **NDVI Generation** - Realistic seasonal data with variations
- **Change Alerts** - Simulated detection events

---

## 📸 Screenshots

### Login Page
Premium space-themed login with animated Earth globe and orbiting satellites.

### Dashboard
Mission control center with real-time stats and monitoring zone overview.

### AOI Definition
Interactive satellite map for drawing monitoring areas.

### Analytics
NDVI time-series charts with trend analysis.

---

## 🛠️ Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npm run lint
```

### Building for Production

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Ram (Sriram Vissakoti)**

- Built with ❤️ for Earth observation and environmental monitoring
- Premium UI design inspired by space exploration themes

---

<div align="center">

**🌍 GeoWatch - Monitor Earth. Detect Change. Act Smart. 🛰️**

© 2026 GeoWatch. All rights reserved.

</div>