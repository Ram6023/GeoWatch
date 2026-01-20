# 🌍 GeoWatch

> **Monitor Earth. Detect Change. Act Smart.**

<div align="center">

![GeoWatch Logo](https://img.shields.io/badge/GeoWatch-2.0.0-1e3a8a?style=for-the-badge&logo=satellite&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-22c55e?style=for-the-badge)
![Python](https://img.shields.io/badge/python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/react-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/typescript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

**Author:** Ram (Sriram Vissakoti) — B.Tech Engineering Student

</div>

---

## 📌 Problem Statement

Manual comparison of satellite images to detect land-use and environmental changes is:
- **Time-consuming** — Requires extensive human effort
- **Error-prone** — Visual detection misses subtle changes
- **Inconsistent** — Results vary between analysts
- **Not scalable** — Cannot monitor large areas effectively

## 💡 Solution

**GeoWatch** is a web-based satellite imagery change detection platform that allows users to:

- 🗺️ Define custom Areas of Interest (AOIs) on an interactive map
- 🛰️ Automatically detect changes in satellite imagery using Google Earth Engine
- 📊 Visualize NDVI (Normalized Difference Vegetation Index) trends over time
- 📄 Generate comprehensive PDF reports with before/after analysis
- 🔔 Receive real-time alerts when significant changes are detected

---

## ✨ Features

### Core Functionality
| Feature | Description |
|---------|-------------|
| 🗺️ **AOI Management** | Define, save, and manage multiple monitoring zones |
| 🔄 **Change Detection** | Automated satellite image comparison and analysis |
| 📊 **NDVI Time-Series** | Track vegetation health trends with interactive charts |
| 📄 **PDF Reports** | Export comprehensive analysis reports |
| 🔐 **Secure Auth** | JWT-based authentication with HTTP-only cookies |

### New in Version 2.0
- ✅ **NDVI Time-Series Charts** — Visualize vegetation health trends with Recharts
- ✅ **PDF Report Export** — Download comprehensive GeoWatch analysis reports
- ✅ **Enhanced AOI Management** — Name, save, and manage multiple zones
- ✅ **Premium UI Design** — Glashmorphism, animations, and dark mode
- ✅ **Rebranded API** — All endpoints now under `/api/geowatch/`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Recharts |
| **Backend** | FastAPI (Python 3.8+) |
| **Database** | MongoDB |
| **Satellite Data** | Google Earth Engine Python API |
| **Authentication** | JWT with HTTP-only cookies |
| **Task Queue** | Celery + Redis |
| **Maps** | Leaflet + React-Leaflet |

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** — [Download](https://www.python.org/downloads/)
- **Node.js 16+** — [Download](https://nodejs.org/)
- **MongoDB** — [Installation Guide](https://docs.mongodb.com/manual/installation/)
- **Redis** — [Installation Guide](https://redis.io/docs/getting-started/)
- **Google Earth Engine Account** — [Sign up](https://earthengine.google.com/)

### 1. 📥 Clone the Repository

```bash
git clone https://github.com/Ram6023/geowatch.git
cd geowatch
```

### 2. 🔧 Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Authenticate with Google Earth Engine
python -c "import ee; ee.Authenticate()"

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. 🖥️ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. 🗄️ Start MongoDB

```bash
# Windows
net start MongoDB

# macOS (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 5. 📍 Access GeoWatch

- **Frontend:** http://localhost:5173
- **API Docs:** http://localhost:8000/docs
- **API Health:** http://localhost:8000/health

---

## 📁 Project Structure

```
geowatch/
├── 📂 backend/
│   ├── 📄 main.py              # FastAPI entry point (GeoWatch API)
│   ├── 📄 routes_auth.py       # Authentication endpoints
│   ├── 📄 routes_aoi.py        # AOI management endpoints
│   ├── 📄 routes_analysis.py   # NDVI & report endpoints
│   ├── 📄 database.py          # MongoDB configuration
│   ├── 📄 models.py            # Pydantic models
│   ├── 📄 tasks_gee.py         # Google Earth Engine tasks
│   └── 📄 requirements.txt     # Python dependencies
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/      # Reusable UI components
│   │   ├── 📂 contexts/        # React contexts (Auth, Theme)
│   │   ├── 📂 pages/           # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── AOIList.tsx
│   │   │   ├── CreateAOI.tsx
│   │   │   ├── AnalyticsPage.tsx   # NEW: NDVI charts
│   │   │   ├── ReportsPage.tsx     # NEW: PDF reports
│   │   │   └── Settings.tsx
│   │   ├── 📄 App.tsx
│   │   └── 📄 index.css        # GeoWatch design system
│   ├── 📄 tailwind.config.js   # Brand colors & theme
│   └── 📄 package.json
│
├── 📂 notebooks/               # Analysis notebooks
│   └── 📂 data/                # Sample datasets
│
├── 📂 documentation/           # Project docs
│   └── 📂 images/              # Documentation assets
└── 📄 README.md
```

---

## 🔌 API Reference

### Base URL
```
http://localhost:8000/api/geowatch
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/signup` | Create new account |
| `POST` | `/auth/login` | Sign in |
| `GET` | `/auth/me` | Get current user |
| `POST` | `/aois/` | Create monitoring zone |
| `GET` | `/aois/` | List all zones |
| `GET` | `/aois/{id}` | Get zone details |
| `PUT` | `/aois/{id}` | Update zone |
| `DELETE` | `/aois/{id}` | Delete zone |
| `GET` | `/analysis/{id}/ndvi` | **NEW:** Get NDVI time-series |
| `GET` | `/analysis/{id}/report` | **NEW:** Generate report |

---

## 📊 Data Models

### Users Collection
```json
{
  "_id": "ObjectId",
  "email": "user@example.com",
  "password": "hashed_password",
  "name": "Ram",
  "subscription": "free",
  "createdAt": "2026-01-20T00:00:00Z"
}
```

### AOIs Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "name": "Forest Zone Alpha",
  "geojson": { "type": "Polygon", "coordinates": [...] },
  "changeType": "deforestation",
  "monitoringFrequency": "weekly",
  "confidenceThreshold": 60,
  "status": "active",
  "createdAt": "2026-01-20T00:00:00Z"
}
```

### Analysis Results Collection
```json
{
  "_id": "ObjectId",
  "aoiId": "ObjectId",
  "beforeDate": "2026-01-01",
  "afterDate": "2026-01-15",
  "changePercent": 12.4,
  "ndviSeries": [0.65, 0.62, 0.58, 0.55],
  "createdAt": "2026-01-20T00:00:00Z"
}
```

---

## 🎨 Design System

### Brand Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Deep Blue | `#1e3a8a` | Primary brand color |
| Green Accent | `#22c55e` | Success, NDVI positive |
| Navy | `#0f172a` | Dark backgrounds |
| Ocean | `#1e40af` | Gradients, hover states |

### Typography
- **Font:** Inter (Google Fonts)
- **Headings:** Bold, tracking-tight
- **Body:** Regular, leading-relaxed

---

## 🔒 Environment Variables

### Backend (`backend/.env`)
```env
MONGODB_URL=mongodb://localhost:27017/geowatch
JWT_SECRET=geowatch_ram_secret_key_2026_secure
GEE_PROJECT=your-gee-project-id
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:8000/api/geowatch
```

---

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

---

## 📦 Deployment

### Docker (Recommended)
```bash
docker-compose up -d
```

### Manual Production Build
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Google Earth Engine** — Satellite imagery and analysis
- **FastAPI** — High-performance Python web framework
- **React** — Frontend UI library
- **Tailwind CSS** — Utility-first CSS framework
- **Recharts** — React charting library

---

<div align="center">

### 🌍 GeoWatch

**Monitor Earth. Detect Change. Act Smart.**

Built with ❤️ by **Ram (Sriram Vissakoti)**

© 2026 GeoWatch. All rights reserved.

</div>