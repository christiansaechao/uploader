from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
import uvicorn
import os
from dotenv import load_dotenv

from app.routers import items, platforms, upload
from app.routers import ebay_oauth
from app.settings.config import app_settings
from app.settings.database import init_db

# Load environment variables
load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print("🚀 Starting Uploader Hub Backend...")
    await init_db()
    print("✅ Database initialized")

    yield

    # Shutdown
    print("🛑 Shutting down Uploader Hub Backend...")


# Create FastAPI app
app = FastAPI(
    title="Uploader Hub API",
    description="Backend API for bulk uploading items to eBay and Shopify",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Security middleware
app.add_middleware(
    TrustedHostMiddleware, allowed_hosts=["*"]  # Configure appropriately for production
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=app_settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(items.router, prefix="/api/items", tags=["items"])
app.include_router(platforms.router, prefix="/api/platforms", tags=["platforms"])
app.include_router(upload.router, prefix="/api/upload", tags=["upload"])
app.include_router(ebay_oauth.router, prefix="/api/ebay_oauth", tags=["ebay_oauth"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Uploader Hub API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health",
    }


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": "2023-12-19T10:00:00Z",
        "version": "1.0.0",
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app", host="0.0.0.0", port=int(os.getenv("PORT", 3001)), reload=True
    )
