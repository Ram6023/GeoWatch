# GeoWatch Backend API

> FastAPI-based backend for the GeoWatch satellite imagery change detection platform.

## Author
**Ram (Sriram Vissakoti)** — B.Tech Engineering Student

## Quick Start

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Authenticate with Google Earth Engine
python -c "import ee; ee.Authenticate()"

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

Base URL: `http://localhost:8000/api/geowatch`

### Authentication
- `POST /auth/signup` - Create account
- `POST /auth/login` - Sign in
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Sign out

### Areas of Interest
- `POST /aois/` - Create monitoring zone
- `GET /aois/` - List all zones
- `GET /aois/{id}` - Get zone details
- `PUT /aois/{id}` - Update zone
- `DELETE /aois/{id}` - Delete zone
- `GET /aois/{id}/changes` - Get change alerts

### Analysis
- `GET /analysis/{id}/ndvi` - Get NDVI time-series
- `GET /analysis/{id}/report` - Generate report
- `GET /analysis/{id}/summary` - Get summary

## Environment Variables

Create a `.env` file:

```env
MONGODB_URL=mongodb://localhost:27017/geowatch
JWT_SECRET=geowatch_ram_secret_key_2026_secure
GEE_PROJECT=your-gee-project-id
```

## Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

**© 2026 GeoWatch — Built by Ram**