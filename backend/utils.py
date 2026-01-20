"""
GeoWatch Utility Functions
Author: Ram
Description: Helper utilities for the GeoWatch API.
"""

from bson import ObjectId
from datetime import datetime
import ee

def serialize_doc(doc):
    """
    Convert MongoDB document to JSON serializable format.
    Handles ObjectId, datetime, and nested structures.
    """
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize_doc(item) for item in doc]
    if isinstance(doc, dict):
        result = {}
        for key, value in doc.items():
            if key == "_id":
                result[key] = str(value)
            elif isinstance(value, ObjectId):
                result[key] = str(value)
            elif isinstance(value, datetime):
                result[key] = value.isoformat()
            elif isinstance(value, dict):
                result[key] = serialize_doc(value)
            elif isinstance(value, list):
                result[key] = serialize_doc(value)
            else:
                result[key] = value
        return result
    return doc


def calculate_ndvi(nir: float, red: float) -> float:
    """
    Calculate NDVI (Normalized Difference Vegetation Index).
    NDVI = (NIR - RED) / (NIR + RED)
    
    Returns value between -1 and 1.
    """
    if (nir + red) == 0:
        return 0
    return (nir - red) / (nir + red)


def format_area(area_sq_meters: float) -> str:
    """
    Format area in appropriate units.
    """
    if area_sq_meters >= 1000000:
        return f"{area_sq_meters / 1000000:.2f} km²"
    elif area_sq_meters >= 10000:
        return f"{area_sq_meters / 10000:.2f} ha"
    else:
        return f"{area_sq_meters:.2f} m²"


def get_change_severity(change_percent: float) -> str:
    """
    Determine severity level based on change percentage.
    """
    if change_percent >= 50:
        return "critical"
    elif change_percent >= 30:
        return "high"
    elif change_percent >= 15:
        return "moderate"
    else:
        return "low"

def generate_thumbnail(params):
    """Generate satellite image thumbnail using Google Earth Engine."""
    try:
        # Initialize if not already (though usually done in main)
        # ee.Initialize(project='isro-bah-2025') 
        pass
    except:
        pass
        
    geometry = ee.Geometry(params["geometry"])
    collection = ee.ImageCollection(params["collection"]).filterBounds(geometry).filterDate(*params["date_range"])
    # Mosaic or Median? Median is better for cloud removal usually, but depends on params
    # Using median as per original implementation logic
    image = collection.median().clip(geometry)
    
    # Use parameters provided or defaults
    vis_params = params.get("vis_params", {'bands': ['B4', 'B3', 'B2'], 'min': 0, 'max': 3000})
    thumb_params = params.get("thumb_params", {'dimensions': '512x512', 'format': 'jpg'})
    
    try:
        url = image.visualize(**vis_params).getThumbURL(thumb_params)
        return url
    except Exception as e:
        print(f"Error generating thumbnail: {e}")
        return "https://via.placeholder.com/512?text=Satellite+Image+Unavailable"