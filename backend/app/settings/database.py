from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.settings.config import app_settings
import json
import os
from typing import List, Dict, Any

# Database setup (for future use)
engine = create_engine(app_settings.DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

async def init_db():
    """Initialize database"""
    # For now, we'll use JSON file storage
    # In the future, this will create database tables
    pass

def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# JSON file storage (temporary solution)
DATA_FILE = "data/items.json"

def ensure_data_dir():
    """Ensure data directory exists"""
    os.makedirs("data", exist_ok=True)

def read_items() -> List[Dict[str, Any]]:
    """Read items from JSON file"""
    ensure_data_dir()
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return []

def write_items(items: List[Dict[str, Any]]):
    """Write items to JSON file"""
    ensure_data_dir()
    with open(DATA_FILE, 'w') as f:
        json.dump(items, f, indent=2, default=str) 