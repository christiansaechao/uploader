from pydantic_settings import BaseSettings
from typing import List
import os

class AppSettings(BaseSettings):
    """Main application settings"""
    # Application
    APP_NAME: str = "Uploader Hub"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 3001
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]
    
    # Database
    DATABASE_URL: str = "sqlite:///./uploader_hub.db"
    
    # File uploads
    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE: int = 5 * 1024 * 1024  # 5MB
    
    # Redis (for Celery/background tasks)
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-this-in-production"  # For sessions/JWT

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"

# Create app settings instance
app_settings = AppSettings()

# Ensure upload directory exists
os.makedirs(app_settings.UPLOAD_DIR, exist_ok=True)