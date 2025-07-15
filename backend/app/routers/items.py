from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import uuid
from datetime import datetime

from app.models.item import Item, ItemCreate, ItemUpdate
from app.settings.database import read_items, write_items

router = APIRouter()

@router.get("/", response_model=List[Item])
async def get_items(
    search: Optional[str] = Query(None, description="Search in title and description"),
    status: Optional[str] = Query(None, description="Filter by status"),
    platform: Optional[str] = Query(None, description="Filter by platform"),
    limit: int = Query(100, le=1000, description="Number of items to return"),
    offset: int = Query(0, ge=0, description="Number of items to skip")
):
    """Get all items with optional filtering"""
    items = read_items()
    
    # Apply filters
    if search:
        search_lower = search.lower()
        items = [
            item for item in items 
            if search_lower in item.get("title", "").lower() 
            or search_lower in item.get("description", "").lower()
        ]
    
    if status:
        items = [
            item for item in items
            if any(
                platform_info.get("status") == status
                for platform_info in item.get("platform_status", {}).values()
            )
        ]
    
    if platform:
        items = [
            item for item in items
            if item.get("platforms", {}).get(platform, False)
        ]
    
    # Apply pagination
    items = items[offset:offset + limit]
    
    return items

@router.get("/{item_id}", response_model=Item)
async def get_item(item_id: str):
    """Get a specific item by ID"""
    items = read_items()
    item = next((item for item in items if item.get("id") == item_id), None)
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    return item

@router.post("/", response_model=Item, status_code=201)
async def create_item(item_data: ItemCreate):
    """Create a new item"""
    items = read_items()
    
    # Create new item
    new_item = Item(
        **item_data.dict(),
        id=str(uuid.uuid4()),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    items.append(new_item.dict())
    write_items(items)
    
    return new_item

@router.put("/{item_id}", response_model=Item)
async def update_item(item_id: str, item_data: ItemUpdate):
    """Update an existing item"""
    items = read_items()
    item_index = next((i for i, item in enumerate(items) if item.get("id") == item_id), None)
    
    if item_index is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Update item
    current_item = items[item_index]
    update_data = item_data.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        if field == "dimensions" and value:
            current_item["dimensions"] = {**current_item.get("dimensions", {}), **value}
        elif field == "shipping" and value:
            current_item["shipping"] = {**current_item.get("shipping", {}), **value}
        elif field == "platforms" and value:
            current_item["platforms"] = {**current_item.get("platforms", {}), **value}
        else:
            current_item[field] = value
    
    current_item["updated_at"] = datetime.utcnow().isoformat()
    items[item_index] = current_item
    write_items(items)
    
    return current_item

@router.delete("/{item_id}")
async def delete_item(item_id: str):
    """Delete an item"""
    items = read_items()
    item = next((item for item in items if item.get("id") == item_id), None)
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    items = [item for item in items if item.get("id") != item_id]
    write_items(items)
    
    return {"message": "Item deleted successfully"}

@router.get("/stats/summary")
async def get_items_stats():
    """Get items statistics"""
    items = read_items()
    
    total_items = len(items)
    pending_items = sum(
        1 for item in items
        if any(
            platform_info.get("status") == "pending"
            for platform_info in item.get("platform_status", {}).values()
        )
    )
    published_items = sum(
        1 for item in items
        if any(
            platform_info.get("status") == "published"
            for platform_info in item.get("platform_status", {}).values()
        )
    )
    failed_items = sum(
        1 for item in items
        if any(
            platform_info.get("status") == "failed"
            for platform_info in item.get("platform_status", {}).values()
        )
    )
    
    return {
        "total": total_items,
        "pending": pending_items,
        "published": published_items,
        "failed": failed_items
    } 