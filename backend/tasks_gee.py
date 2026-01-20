"""
GeoWatch Google Earth Engine Tasks
Author: Ram
Description: Background tasks for satellite imagery processing and change detection.

This module contains Celery tasks that:
- Process AOIs for change detection
- Calculate NDVI time-series
- Generate satellite image thumbnails
- Send notifications on detected changes
"""

import ee
from celery_config import celery_app
from notifications import send_change_alert_email
from database import sync_aois_collection, sync_users_collection, sync_changes_collection, sync_ndvi_collection
from bson import ObjectId
from utils import serialize_doc, get_change_severity
from datetime import datetime

# Initialize Google Earth Engine
try:
    ee.Initialize(project='isro-bah-2025')
    print("🛰️ GeoWatch: Google Earth Engine initialized")
except Exception:
    ee.Authenticate()
    ee.Initialize(project='isro-bah-2025')


# ============================================================
# GeoWatch Change Detection Task
# ============================================================

@celery_app.task(bind=True, max_retries=3)
def process_aoi_for_changes(self, aoi_id: str):
    """
    GeoWatch change detection task.
    
    Fetches a single AOI by its ID and runs the GEE change detection logic.
    Stores results and triggers notifications if significant changes detected.
    """
    print(f"🌍 GeoWatch: Starting change detection for AOI {aoi_id}")
    
    try:
        # Fetch the AOI document from MongoDB
        aoi_document = sync_aois_collection.find_one({"_id": ObjectId(aoi_id)})
        if not aoi_document:
            print(f"❌ GeoWatch Error: AOI with ID {aoi_id} not found.")
            return {"error": "AOI not found"}

        results = get_change_for_aoi(serialize_doc(aoi_document))
        
        if results and results.get("significant_change_detected"):
            print(f"⚠️ GeoWatch: Significant change detected for AOI: {aoi_document['name']}")
            
            # Get user for notification
            user = sync_users_collection.find_one({"_id": aoi_document['userId']})
            
            # Calculate severity
            change_percent = (results["area_sq_meters"] / 10000) * 100  # Approximate
            severity = get_change_severity(change_percent)
            
            # Save to GeoWatch changes collection
            change_doc = {
                "aoi_id": str(aoi_document["_id"]),
                "user_id": str(aoi_document["userId"]),
                "aoi_name": aoi_document["name"],
                "detection_date": datetime.utcnow(),
                "area_of_change": results["area_sq_meters"],
                "change_percent": change_percent,
                "severity": severity,
                "before_image_params": {
                    "collection": "COPERNICUS/S2_SR_HARMONIZED",
                    "date_range": ["2019-01-08", "2023-03-14"],
                    "geometry": aoi_document["geojson"]["geometry"],
                    "bands": ["B4", "B3", "B2"],
                    "vis_params": {"bands": ["B4", "B3", "B2"], "min": 0.0, "max": 0.3},
                    "thumb_params": {"dimensions": "512x512", "format": "jpg"}
                },
                "after_image_params": {
                    "collection": "COPERNICUS/S2_SR_HARMONIZED",
                    "date_range": ["2024-11-01", "2025-04-30"],
                    "geometry": aoi_document["geojson"]["geometry"],
                    "bands": ["B4", "B3", "B2"],
                    "vis_params": {"bands": ["B4", "B3", "B2"], "min": 0.0, "max": 0.3},
                    "thumb_params": {"dimensions": "512x512", "format": "jpg"}
                },
                "status": "unread",
                "source": "geowatch"
            }
            sync_changes_collection.insert_one(change_doc)

            # Send notification
            if user and aoi_document.get('emailAlerts', True):
                send_change_alert_email(
                    user_email=user['email'],
                    aoi_name=aoi_document['name'],
                    change_details=change_doc
                )

            # Update AOI last monitored timestamp
            sync_aois_collection.update_one(
                {"_id": ObjectId(aoi_id)},
                {"$set": {"lastMonitored": datetime.utcnow()}}
            )

            return {"status": "change_detected", "aoi_id": aoi_id, "severity": severity}

        else:
            print(f"✅ GeoWatch: No significant change for AOI: {aoi_document['name']}")
            
            # Update last monitored
            sync_aois_collection.update_one(
                {"_id": ObjectId(aoi_id)},
                {"$set": {"lastMonitored": datetime.utcnow()}}
            )
            
            return {"status": "no_change", "aoi_id": aoi_id}

    except Exception as e:
        print(f"❌ GeoWatch Error processing AOI {aoi_id}: {str(e)}")
        raise self.retry(exc=e, countdown=60)


# ============================================================
# GeoWatch NDVI Processing Task
# ============================================================

@celery_app.task
def calculate_ndvi_timeseries(aoi_id: str):
    """
    Calculate and store NDVI time-series data for an AOI.
    """
    print(f"📊 GeoWatch: Calculating NDVI for AOI {aoi_id}")
    
    aoi_document = sync_aois_collection.find_one({"_id": ObjectId(aoi_id)})
    if not aoi_document:
        return {"error": "AOI not found"}
    
    try:
        geometry = ee.Geometry(aoi_document["geojson"]["geometry"])
        
        # Get monthly NDVI for last 12 months
        from datetime import timedelta
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=365)
        
        collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
            .filterBounds(geometry) \
            .filterDate(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d'))
        
        # Process monthly composites
        ndvi_data = []
        current_date = start_date
        
        while current_date < end_date:
            next_date = current_date + timedelta(days=30)
            
            monthly = collection.filterDate(
                current_date.strftime('%Y-%m-%d'),
                next_date.strftime('%Y-%m-%d')
            ).median().clip(geometry)
            
            ndvi = monthly.normalizedDifference(['B8', 'B4']).rename('NDVI')
            
            try:
                mean_ndvi = ndvi.reduceRegion(
                    reducer=ee.Reducer.mean(),
                    geometry=geometry,
                    scale=10,
                    maxPixels=1e9
                ).getInfo()
                
                if mean_ndvi and mean_ndvi.get('NDVI') is not None:
                    ndvi_data.append({
                        "aoi_id": aoi_id,
                        "date": current_date,
                        "ndvi": mean_ndvi['NDVI'],
                        "quality": "good"
                    })
            except:
                pass
            
            current_date = next_date
        
        # Store in database
        if ndvi_data:
            sync_ndvi_collection.delete_many({"aoi_id": aoi_id})
            sync_ndvi_collection.insert_many(ndvi_data)
        
        return {"status": "success", "data_points": len(ndvi_data)}
        
    except Exception as e:
        print(f"❌ GeoWatch NDVI Error: {str(e)}")
        return {"error": str(e)}


# ============================================================
# GeoWatch Scheduler Task
# ============================================================

@celery_app.task
def schedule_all_aoi_checks():
    """
    GeoWatch scheduled task: Check all AOIs for changes.
    This task is run by Celery Beat according to the schedule in celery_config.py
    """
    print("🌍 GeoWatch Scheduler: Initiating daily AOI checks...")
    
    # Get all active AOIs
    all_aois = sync_aois_collection.find({"status": "active"})
    
    count = 0
    for aoi in all_aois:
        aoi_id = str(aoi["_id"])
        print(f"📡 GeoWatch: Dispatching check for AOI: {aoi['name']} ({aoi_id})")
        
        # Queue the processing task
        process_aoi_for_changes.delay(aoi_id)
        count += 1
        
    print(f"✅ GeoWatch: Scheduled {count} AOI checks")
    return {"status": "scheduled", "aoi_count": count}


# ============================================================
# GeoWatch Core Change Detection Logic
# ============================================================

def get_change_for_aoi(aoi_document: dict):
    """
    Core GEE change detection logic for GeoWatch.
    
    Uses NDVI differencing to detect significant vegetation changes.
    """
    print(f"🛰️ GeoWatch GEE: Processing {aoi_document.get('name', 'Unknown')}")
    
    # Extract geometry
    aoi_geometry = ee.Geometry(aoi_document["geojson"]["geometry"])

    # Time ranges for comparison
    t1_range = ('2019-01-08', '2023-03-14')
    t2_range = ('2024-11-01', '2025-04-30')

    # Cloud masking function for Sentinel-2
    def mask_s2_clouds(image):
        qa = image.select('QA60')
        cloudBitMask = 1 << 10
        cirrusBitMask = 1 << 11
        mask = qa.bitwiseAnd(cloudBitMask).eq(0).And(
            qa.bitwiseAnd(cirrusBitMask).eq(0)
        )
        return image.updateMask(mask)

    # Get image collections
    image_collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED').filterBounds(aoi_geometry)
    t1_collection = image_collection.filterDate(*t1_range)
    t2_collection = image_collection.filterDate(*t2_range)

    t1_count = t1_collection.size().getInfo()
    t2_count = t2_collection.size().getInfo()
    print(f"📸 GeoWatch: Found {t1_count} images for T1, {t2_count} images for T2")

    # Median composite and NDVI calculation
    image_t1 = t1_collection.map(mask_s2_clouds).median().clip(aoi_geometry)
    image_t2 = t2_collection.map(mask_s2_clouds).median().clip(aoi_geometry)

    ndvi_t1 = image_t1.normalizedDifference(['B8', 'B4']).rename('NDVI')
    ndvi_t2 = image_t2.normalizedDifference(['B8', 'B4']).rename('NDVI')

    # Generate thumbnail URLs
    vis_params = {'bands': ['B4', 'B3', 'B2'], 'min': 0.0, 'max': 3000}
    t1_thumb_url = image_t1.visualize(**vis_params).getThumbURL({'dimensions': '512x512', 'format': 'jpg'})
    t2_thumb_url = image_t2.visualize(**vis_params).getThumbURL({'dimensions': '512x512', 'format': 'jpg'})

    # Change detection
    ndvi_delta = ndvi_t2.subtract(ndvi_t1)
    significant_change_map = ndvi_delta.lt(-0.25)  # Threshold for loss
    final_change = significant_change_map.updateMask(significant_change_map)

    # Area calculation
    area_of_change = final_change.multiply(ee.Image.pixelArea()).reduceRegion(
        reducer=ee.Reducer.sum(),
        geometry=aoi_geometry,
        scale=10,
        maxPixels=1e9
    )

    change_area_sq_meters = area_of_change.getInfo().get('NDVI', 0)
    print(f"📏 GeoWatch: Change area = {change_area_sq_meters} sq meters")

    # Threshold for significant change (500 sq meters)
    if change_area_sq_meters and change_area_sq_meters > 500:
        print(f"⚠️ GeoWatch: SIGNIFICANT CHANGE DETECTED ({change_area_sq_meters} m²)")
        return {
            "significant_change_detected": True,
            "area_sq_meters": change_area_sq_meters,
            "t1_image_url": t1_thumb_url,
            "t2_image_url": t2_thumb_url,
        }
    else:
        print(f"✅ GeoWatch: No significant change ({change_area_sq_meters or 0} m²)")
        return {"significant_change_detected": False}