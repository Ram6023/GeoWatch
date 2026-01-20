"""
GeoWatch Data Models
Author: Ram
Description: Pydantic models for request/response validation in GeoWatch API.
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# ============================================================
# User Models
# ============================================================

class UserCreate(BaseModel):
    """Model for user registration"""
    email: str = Field(..., description="User's email address")
    password: str = Field(..., min_length=8, description="User's password (min 8 characters)")
    name: Optional[str] = Field(None, description="User's display name")

class UserLogin(BaseModel):
    """Model for user authentication"""
    email: str
    password: str

class UserResponse(BaseModel):
    """Model for user response data"""
    id: str
    email: str
    name: Optional[str] = None
    subscription: str = "free"
    createdAt: Optional[datetime] = None


# ============================================================
# AOI (Area of Interest) Models
# ============================================================

class AOICreate(BaseModel):
    """Model for creating a new Area of Interest"""
    name: str = Field(..., description="Name of the monitoring zone")
    geojson: dict = Field(..., description="GeoJSON geometry defining the area")
    changeType: str = Field(..., description="Type of change to monitor (deforestation, construction, etc.)")
    monitoringFrequency: str = Field("weekly", description="How often to check for changes")
    confidenceThreshold: int = Field(60, ge=30, le=90, description="Detection confidence threshold (%)")
    emailAlerts: bool = Field(True, description="Enable email notifications")
    inAppNotifications: bool = Field(True, description="Enable in-app notifications")
    description: Optional[str] = Field(None, description="Additional description")
    status: str = Field("active", description="Zone status")

class AOIUpdate(BaseModel):
    """Model for updating an Area of Interest"""
    name: Optional[str] = None
    changeType: Optional[str] = None
    monitoringFrequency: Optional[str] = None
    confidenceThreshold: Optional[int] = Field(None, ge=30, le=90)
    emailAlerts: Optional[bool] = None
    inAppNotifications: Optional[bool] = None
    description: Optional[str] = None
    status: Optional[str] = None


# ============================================================
# Change Detection Models
# ============================================================

class ChangeRecord(BaseModel):
    """Model for change detection records"""
    aoi_id: str
    user_id: str
    detection_date: datetime
    area_of_change: float = Field(..., description="Area changed in square kilometers")
    change_percent: float = Field(..., description="Percentage of AOI that changed")
    before_image_params: Dict[str, Any]
    after_image_params: Dict[str, Any]
    status: str = "unread"
    severity: str = "moderate"  # low, moderate, high, critical


# ============================================================
# Analysis & NDVI Models
# ============================================================

class NDVIDataPoint(BaseModel):
    """Model for a single NDVI measurement"""
    date: str
    ndvi: float = Field(..., ge=-1, le=1, description="NDVI value (-1 to 1)")
    quality: str = Field("good", description="Data quality indicator")

class NDVITimeSeries(BaseModel):
    """Model for NDVI time-series response"""
    aoi_id: str
    aoi_name: str
    data: List[NDVIDataPoint]
    trend: str = Field(..., description="Overall trend: increasing, decreasing, stable")
    trend_description: str
    statistics: Dict[str, Optional[float]]
    generated_at: str
    source: str = "GeoWatch NDVI Analysis"

class AnalysisResult(BaseModel):
    """Model for analysis results stored in database"""
    aoi_id: str
    user_id: str
    analysis_type: str  # ndvi, change_detection, classification
    before_date: datetime
    after_date: datetime
    change_percent: Optional[float] = None
    ndvi_before: Optional[float] = None
    ndvi_after: Optional[float] = None
    ndvi_change: Optional[float] = None
    metadata: Optional[Dict[str, Any]] = None
    created_at: datetime


# ============================================================
# Report Models
# ============================================================

class ReportRequest(BaseModel):
    """Model for requesting a report"""
    aoi_id: str
    include_images: bool = True
    include_ndvi_chart: bool = True
    date_range_days: int = Field(90, description="Number of days to include in report")

class ReportSummary(BaseModel):
    """Model for report metadata"""
    report_id: str
    aoi_id: str
    generated_at: datetime
    format: str = "pdf"
    file_size: Optional[int] = None
    download_url: Optional[str] = None