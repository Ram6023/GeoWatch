"""
GeoWatch Database Configuration
Author: Ram
Description: MongoDB connection and collection configuration for GeoWatch platform.
"""

from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient

# GeoWatch MongoDB Configuration
MONGODB_URL = "mongodb://localhost:27017"
DATABASE_NAME = "geowatch"  # Changed from satellite_monitoring to geowatch

# Synchronous MongoDB Client (for Celery tasks)
sync_client = MongoClient(MONGODB_URL)
sync_database = sync_client[DATABASE_NAME]
sync_aois_collection = sync_database.aois
sync_users_collection = sync_database.users
sync_changes_collection = sync_database.changes
sync_analysis_collection = sync_database.analysis_results
sync_ndvi_collection = sync_database.ndvi_data

# Asynchronous MongoDB Client (for FastAPI endpoints)
client = AsyncIOMotorClient(MONGODB_URL)
database = client[DATABASE_NAME]

# GeoWatch Collections
users_collection = database.users
aois_collection = database.aois
changes_collection = database.changes
analysis_results_collection = database.analysis_results
ndvi_data_collection = database.ndvi_data
