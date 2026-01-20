"""
GeoWatch AOI (Area of Interest) Routes
Author: Ram
Description: CRUD operations for managing monitoring zones in GeoWatch platform.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
import requests
from models import AOICreate, AOIUpdate
from database import aois_collection, sync_changes_collection
from utils import serialize_doc
from datetime import datetime
from bson import ObjectId
from routes_auth import get_current_user
import ee

router = APIRouter(prefix="/aois", tags=["Areas of Interest"])

@router.post("/", summary="Create a new monitoring zone")
async def create_aoi(aoi_data: AOICreate, current_user: dict = Depends(get_current_user)):
    """
    Create a new Area of Interest for GeoWatch monitoring.
    
    The AOI defines the geographic region and parameters for satellite imagery analysis.
    """
    aoi_doc = {
        "userId": ObjectId(current_user["_id"]),
        "name": aoi_data.name,
        "geojson": aoi_data.geojson,
        "changeType": aoi_data.changeType,
        "monitoringFrequency": aoi_data.monitoringFrequency,
        "confidenceThreshold": aoi_data.confidenceThreshold,
        "emailAlerts": aoi_data.emailAlerts,
        "inAppNotifications": aoi_data.inAppNotifications,
        "description": aoi_data.description,
        "status": aoi_data.status,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
        "lastMonitored": None,
        "totalChangesDetected": 0
    }
    result = await aois_collection.insert_one(aoi_doc)
    aoi_doc["_id"] = result.inserted_id
    return serialize_doc(aoi_doc)

@router.get("/", summary="List all monitoring zones")
async def get_aois(current_user: dict = Depends(get_current_user)):
    """Get all Areas of Interest for the current user."""
    cursor = aois_collection.find({"userId": ObjectId(current_user["_id"])})
    aois = await cursor.to_list(length=100)
    return serialize_doc(aois)

@router.get("/{aoi_id}", summary="Get monitoring zone details")
async def get_aoi(aoi_id: str, current_user: dict = Depends(get_current_user)):
    """Get details of a specific Area of Interest."""
    try:
        aoi = await aois_collection.find_one({
            "_id": ObjectId(aoi_id),
            "userId": ObjectId(current_user["_id"])
        })
        if not aoi:
            raise HTTPException(status_code=404, detail="Monitoring zone not found")
        return serialize_doc(aoi)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid zone ID")

@router.put("/{aoi_id}", summary="Update monitoring zone")
async def update_aoi(aoi_id: str, aoi_data: AOIUpdate, current_user: dict = Depends(get_current_user)):
    """Update an existing Area of Interest."""
    try:
        update_data = {k: v for k, v in aoi_data.dict().items() if v is not None}
        update_data["updatedAt"] = datetime.utcnow()
        result = await aois_collection.update_one(
            {"_id": ObjectId(aoi_id), "userId": ObjectId(current_user["_id"])},
            {"$set": update_data}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Monitoring zone not found")
        updated_aoi = await aois_collection.find_one({
            "_id": ObjectId(aoi_id),
            "userId": ObjectId(current_user["_id"])
        })
        return serialize_doc(updated_aoi)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid zone ID")

@router.delete("/{aoi_id}", summary="Delete monitoring zone")
async def delete_aoi(aoi_id: str, current_user: dict = Depends(get_current_user)):
    """Delete an Area of Interest and all associated data."""
    try:
        result = await aois_collection.delete_one({
            "_id": ObjectId(aoi_id),
            "userId": ObjectId(current_user["_id"])
        })
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Monitoring zone not found")
        return {"message": "Monitoring zone deleted successfully", "deleted_id": aoi_id}
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid zone ID")
    
@router.get("/{aoi_id}/changes", summary="Get change detection alerts")
async def get_aoi_alerts(aoi_id: str, current_user: dict = Depends(get_current_user)):
    """Get all change detection alerts for a specific AOI."""
    try:
        alerts = list(sync_changes_collection.find({
            "aoi_id": aoi_id,
            "user_id": str(current_user["_id"])
        }).sort("detection_date", -1))
        
        for alert in alerts:
            if "_id" in alert:
                alert["_id"] = str(alert["_id"])
        return alerts
    except Exception as e:
        print(f"GeoWatch Error in get_aoi_alerts: {e}")
        return []

# GeoWatch Thumbnail Generation
def generate_thumbnail(params):
    """Generate satellite image thumbnail using Google Earth Engine."""
    geometry = ee.Geometry(params["geometry"])
    collection = ee.ImageCollection(params["collection"]).filterBounds(geometry).filterDate(*params["date_range"])
    image = collection.median().clip(geometry)
    vis_params = {'bands': ['B4', 'B3', 'B2'], 'min': 0, 'max': 3000}
    thumb_params = params["thumb_params"]
    url = image.visualize(**vis_params).getThumbURL(thumb_params)
    return url

@router.get("/{change_id}/thumbnail", summary="Get change thumbnail URL")
async def get_change_thumbnail(
    change_id: str,
    type: str = Query(..., regex="^(before|after)$"),
    current_user: dict = Depends(get_current_user)
):
    """Get the thumbnail URL for before/after satellite images."""
    change = sync_changes_collection.find_one({"_id": ObjectId(change_id)})
    if not change:
        raise HTTPException(status_code=404, detail="Change record not found")
    if change["user_id"] != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="Not authorized")
    params = change[f"{type}_image_params"]
    url = generate_thumbnail(params)
    return {"url": url, "type": type}

@router.get("/change/{change_id}/thumbnail-proxy", summary="Proxy satellite thumbnail")
async def get_change_thumbnail_proxy(
    change_id: str,
    type: str = Query(..., regex="^(before|after)$"),
    current_user: dict = Depends(get_current_user)
):
    """Stream satellite image thumbnail directly through GeoWatch API."""
    change = sync_changes_collection.find_one({"_id": ObjectId(change_id)})
    if not change:
        raise HTTPException(status_code=404, detail="Change record not found")
    
    params = change[f"{type}_image_params"]
    url = generate_thumbnail(params)
    resp = requests.get(url, stream=True)
    return StreamingResponse(resp.raw, media_type="image/jpeg")