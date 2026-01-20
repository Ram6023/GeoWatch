"""
GeoWatch Celery Configuration
Author: Ram
Description: Celery task queue configuration for background satellite imagery processing.
"""

from celery import Celery
from celery.schedules import crontab
import os

# Redis broker configuration
BROKER_URL = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379/0")
RESULT_BACKEND = os.environ.get("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")

# Create GeoWatch Celery application
celery_app = Celery(
    "geowatch_tasks",
    broker=BROKER_URL,
    backend=RESULT_BACKEND,
    include=["tasks_gee"]  # GeoWatch GEE task module
)

# GeoWatch scheduled tasks
celery_app.conf.beat_schedule = {
    'geowatch-aoi-monitoring': {
        'task': 'tasks_gee.schedule_all_aoi_checks',
        'schedule': crontab(minute='0', hour='*/6'),  # Every 6 hours
        'options': {'queue': 'geowatch'}
    },
}

# Celery configuration
celery_app.conf.update(
    timezone='UTC',
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    task_track_started=True,
    task_time_limit=600,  # 10 minute timeout
    task_soft_time_limit=540,
    worker_prefetch_multiplier=1,
    task_acks_late=True,
)

# GeoWatch task queues
celery_app.conf.task_routes = {
    'tasks_gee.*': {'queue': 'geowatch'},
}

print("🌍 GeoWatch Celery worker configured")