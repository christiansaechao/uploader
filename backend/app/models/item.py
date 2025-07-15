from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class Condition(str, Enum):
    NEW = "New"
    USED = "Used"
    REFURBISHED = "Refurbished"
    OTHER = "Other"

class PlatformStatus(str, Enum):
    PENDING = "pending"
    PUBLISHED = "published"
    FAILED = "failed"

class Dimensions(BaseModel):
    length: float = Field(default=0, ge=0, description="Length in inches")
    width: float = Field(default=0, ge=0, description="Width in inches")
    height: float = Field(default=0, ge=0, description="Height in inches")

class Shipping(BaseModel):
    weight: float = Field(default=0, ge=0, description="Shipping weight in pounds")
    method: str = Field(default="Standard", description="Shipping method")
    cost: float = Field(default=0, ge=0, description="Shipping cost")

class Platforms(BaseModel):
    ebay: bool = Field(default=False, description="Publish to eBay")
    shopify: bool = Field(default=False, description="Publish to Shopify")

class PlatformInfo(BaseModel):
    status: PlatformStatus = Field(default=PlatformStatus.PENDING)
    published_at: Optional[datetime] = None
    external_id: Optional[str] = None
    url: Optional[str] = None
    message: Optional[str] = None

class Item(BaseModel):
    """Item model for both eBay and Shopify"""
    
    # Basic information
    title: str = Field(..., min_length=1, max_length=255, description="Item title")
    description: str = Field(..., min_length=1, description="Item description")
    price: float = Field(..., gt=0, description="Item price")
    quantity: int = Field(..., gt=0, description="Available quantity")
    category: str = Field(default="General", description="Item category")
    condition: Condition = Field(default=Condition.NEW, description="Item condition")
    
    # Media and tags
    images: List[str] = Field(default=[], description="List of image URLs")
    tags: List[str] = Field(default=[], description="List of tags")
    
    # Physical properties
    weight: float = Field(default=0, ge=0, description="Item weight in pounds")
    dimensions: Dimensions = Field(default_factory=Dimensions, description="Item dimensions")
    shipping: Shipping = Field(default_factory=Shipping, description="Shipping information")
    
    # Platform settings
    platforms: Platforms = Field(default_factory=Platforms, description="Platform selection")
    
    # Platform status
    platform_status: Dict[str, PlatformInfo] = Field(
        default_factory=lambda: {
            "ebay": PlatformInfo(),
            "shopify": PlatformInfo()
        },
        description="Platform-specific status information"
    )
    
    # Metadata
    id: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    csv_row: Optional[int] = None
    
    @validator('images')
    def validate_images(cls, v):
        """Validate image URLs"""
        for url in v:
            if not url.startswith(('http://', 'https://')):
                raise ValueError(f"Invalid image URL: {url}")
        return v
    
    @validator('price')
    def validate_price(cls, v):
        """Validate price is reasonable"""
        if v > 1000000:  # $1M limit
            raise ValueError("Price too high")
        return round(v, 2)
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
        schema_extra = {
            "example": {
                "title": "Sample Product",
                "description": "This is a sample product description",
                "price": 29.99,
                "quantity": 10,
                "category": "Electronics",
                "condition": "New",
                "images": ["https://example.com/image1.jpg"],
                "tags": ["electronics", "gadget"],
                "weight": 0.5,
                "dimensions": {
                    "length": 10,
                    "width": 5,
                    "height": 2
                },
                "shipping": {
                    "weight": 0.6,
                    "method": "Standard",
                    "cost": 5.99
                },
                "platforms": {
                    "ebay": True,
                    "shopify": True
                }
            }
        }

class ItemCreate(BaseModel):
    """Model for creating new items"""
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    price: float = Field(..., gt=0)
    quantity: int = Field(..., gt=0)
    category: str = Field(default="General")
    condition: Condition = Field(default=Condition.NEW)
    images: List[str] = Field(default=[])
    tags: List[str] = Field(default=[])
    weight: float = Field(default=0, ge=0)
    dimensions: Dimensions = Field(default_factory=Dimensions)
    shipping: Shipping = Field(default_factory=Shipping)
    platforms: Platforms = Field(default_factory=Platforms)

class ItemUpdate(BaseModel):
    """Model for updating items"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, min_length=1)
    price: Optional[float] = Field(None, gt=0)
    quantity: Optional[int] = Field(None, gt=0)
    category: Optional[str] = None
    condition: Optional[Condition] = None
    images: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    weight: Optional[float] = Field(None, ge=0)
    dimensions: Optional[Dimensions] = None
    shipping: Optional[Shipping] = None
    platforms: Optional[Platforms] = None 