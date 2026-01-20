"""
GeoWatch Authentication Routes
Author: Ram
Description: JWT-based authentication endpoints for GeoWatch platform.
"""

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from models import UserCreate, UserLogin
from database import users_collection
from utils import serialize_doc
from datetime import datetime, timedelta
import bcrypt
from jose import jwt
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["Authentication"])

# GeoWatch JWT Configuration
SECRET_KEY = "geowatch_ram_secret_key_2026_secure"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days
security = HTTPBearer()

def create_access_token(data: dict):
    """Create a JWT access token for GeoWatch authentication"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "iss": "geowatch"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

async def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False))
):
    """Get current authenticated user from JWT token"""
    token = None
    # Try Authorization header first
    if credentials:
        token = credentials.credentials
    # Fallback to cookie
    elif "geowatch_access_token" in request.cookies:
        token = request.cookies["geowatch_access_token"]
    
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

@router.post("/signup", summary="Create a new GeoWatch account")
async def signup(user_data: UserCreate):
    """
    Register a new user on GeoWatch platform.
    
    - **email**: User's email address (unique)
    - **password**: User's password (will be hashed)
    - **name**: User's display name (optional)
    """
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(user_data.password)
    user_doc = {
        "email": user_data.email,
        "password": hashed_password,
        "name": user_data.name,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
        "subscription": "free",
        "aoi_limit": 5
    }
    
    result = await users_collection.insert_one(user_doc)
    user_id = str(result.inserted_id)
    access_token = create_access_token(data={"sub": user_id})
    
    user_response = {
        "id": user_id,
        "email": user_data.email,
        "name": user_data.name
    }
    
    response = JSONResponse({
        "token": access_token, 
        "user": user_response,
        "message": "Welcome to GeoWatch! Start monitoring the Earth."
    })
    response.set_cookie(
        key="geowatch_access_token",
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=False  # Set to True in production with HTTPS
    )
    return response

@router.post("/login", summary="Sign in to GeoWatch")
async def login(user_data: UserLogin):
    """
    Authenticate a user and return a JWT token.
    
    - **email**: User's registered email
    - **password**: User's password
    """
    user = await users_collection.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_id = str(user["_id"])
    access_token = create_access_token(data={"sub": user_id})
    
    user_response = {
        "id": user_id,
        "email": user["email"],
        "name": user.get("name")
    }
    
    response = JSONResponse({
        "token": access_token, 
        "user": user_response,
        "message": "Welcome back to GeoWatch!"
    })
    response.set_cookie(
        key="geowatch_access_token",
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=False  # Set to True in production with HTTPS
    )
    return response

@router.get("/me", summary="Get current user profile")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get the currently authenticated user's profile."""
    user_response = {
        "id": str(current_user["_id"]),
        "email": current_user["email"],
        "name": current_user.get("name"),
        "subscription": current_user.get("subscription", "free"),
        "createdAt": current_user.get("createdAt")
    }
    return {"user": user_response}

@router.post("/logout", summary="Sign out of GeoWatch")
async def logout():
    """Sign out and clear authentication cookie."""
    response = JSONResponse({"message": "Successfully signed out of GeoWatch"})
    response.delete_cookie("geowatch_access_token")
    return response