"""
GeoWatch API
Author: Ram (Sriram Vissakoti)
Description: Satellite imagery change detection backend for the GeoWatch platform.
             Monitor Earth. Detect Change. Act Smart.

Copyright © 2026 GeoWatch. All rights reserved.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes_auth import router as auth_router
from routes_aoi import router as aoi_router
from routes_analysis import router as analysis_router

import ee 
try:
    ee.Initialize(project='isro-bah-2025')
except Exception as e:
    print(f"Warning: Earth Engine failed to initialize: {e}")
    # Continue running app, but GEE features will fail

# GeoWatch API Application
app = FastAPI(
    title="GeoWatch API",
    description="""
    🌍 **GeoWatch API** - Satellite Imagery Change Detection Platform
    
    Monitor Earth. Detect Change. Act Smart.
    
    GeoWatch is a web-based satellite imagery change detection platform that helps users 
    monitor environmental and land-use changes using AI and Google Earth Engine.
    
    ## Features
    - 🗺️ Area of Interest (AOI) Management
    - 📊 NDVI Time-Series Analysis
    - 🔔 Real-time Change Detection Alerts
    - 📄 PDF Report Generation
    - 🔐 Secure JWT Authentication
    
    ## Author
    Built by **Ram (Sriram Vissakoti)** - B.Tech Engineering Student
    """,
    version="2.0.0",
    contact={
        "name": "Ram (Sriram Vissakoti)",
        "email": "geowatch@example.com"
    },
    license_info={
        "name": "MIT License"
    }
)

# CORS Configuration for GeoWatch Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include GeoWatch API Routers with /api/geowatch prefix
app.include_router(auth_router, prefix="/api/geowatch")
app.include_router(aoi_router, prefix="/api/geowatch")
app.include_router(analysis_router, prefix="/api/geowatch")

@app.get("/")
async def root():
    """GeoWatch API Root Endpoint"""
    return {
        "name": "GeoWatch API",
        "version": "2.0.0",
        "tagline": "Monitor Earth. Detect Change. Act Smart.",
        "author": "Ram (Sriram Vissakoti)",
        "status": "operational",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "service": "geowatch-api"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)