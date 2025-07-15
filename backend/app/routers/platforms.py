from fastapi import APIRouter, HTTPException, BackgroundTasks, Request
from typing import List, Dict, Any
import uuid
from datetime import datetime
from fastapi.responses import RedirectResponse, JSONResponse

from app.models.item import Item, PlatformStatus
from app.settings.database import read_items, write_items
from app.services.ebay_service import EbayService
from app.services.shopify_service import ShopifyService

router = APIRouter()

# Initialize services
ebay_service = EbayService()
shopify_service = ShopifyService()

@router.post("/{platform}/{item_id}")
async def publish_to_platform(platform: str, item_id: str, background_tasks: BackgroundTasks):
    """Publish a single item to a specific platform"""
    items = read_items()
    item = next((item for item in items if item.get("id") == item_id), None)
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    if not item.get("platforms", {}).get(platform, False):
        raise HTTPException(status_code=400, detail=f"Item not configured for {platform}")
    
    try:
        if platform.lower() == "ebay":
            result = await ebay_service.create_listing(item)
        elif platform.lower() == "shopify":
            result = await shopify_service.create_product(item)
        else:
            raise HTTPException(status_code=400, detail="Unsupported platform")
        
        if result["success"]:
            # Update item status
            item_index = next((i for i, item in enumerate(items) if item.get("id") == item_id), None)
            if item_index is not None:
                items[item_index]["platform_status"][platform] = {
                    "status": PlatformStatus.PUBLISHED,
                    "published_at": datetime.utcnow().isoformat(),
                    "external_id": result.get("external_id"),
                    "url": result.get("url"),
                    "message": result.get("message")
                }
                write_items(items)
        
        return result
        
    except Exception as e:
        # Update item status to failed
        item_index = next((i for i, item in enumerate(items) if item.get("id") == item_id), None)
        if item_index is not None:
            items[item_index]["platform_status"][platform] = {
                "status": PlatformStatus.FAILED,
                "message": str(e)
            }
            write_items(items)
        
        raise HTTPException(status_code=500, detail=f"Failed to publish to {platform}: {str(e)}")

@router.post("/bulk")
async def bulk_publish(background_tasks: BackgroundTasks, data: Dict[str, Any]):
    """Bulk publish items to multiple platforms"""
    items_data = data.get("items", [])
    platforms = data.get("platforms", [])
    
    if not items_data or not platforms:
        raise HTTPException(status_code=400, detail="Items and platforms are required")
    
    # Get full item data
    all_items = read_items()
    items_to_publish = []
    
    for item_data in items_data:
        item_id = item_data.get("id")
        item = next((item for item in all_items if item.get("id") == item_id), None)
        if item:
            items_to_publish.append(item)
    
    if not items_to_publish:
        raise HTTPException(status_code=404, detail="No valid items found")
    
    # Start background task for bulk publishing
    background_tasks.add_task(
        process_bulk_publish,
        items_to_publish,
        platforms
    )
    
    return {
        "message": f"Bulk publish started for {len(items_to_publish)} items to {len(platforms)} platforms",
        "task_id": str(uuid.uuid4())
    }

async def process_bulk_publish(items: List[Dict], platforms: List[str]):
    """Background task to process bulk publishing"""
    results = []
    
    for item in items:
        item_results = []
        
        for platform in platforms:
            try:
                if platform.lower() == "ebay":
                    result = await ebay_service.create_listing(item)
                elif platform.lower() == "shopify":
                    result = await shopify_service.create_product(item)
                else:
                    result = {"success": False, "message": "Unsupported platform"}
                
                item_results.append({
                    "platform": platform,
                    "success": result["success"],
                    "external_id": result.get("external_id"),
                    "url": result.get("url"),
                    "message": result.get("message")
                })
                
                # Update item status
                all_items = read_items()
                item_index = next((i for i, item in enumerate(all_items) if item.get("id") == item["id"]), None)
                
                if item_index is not None:
                    if result["success"]:
                        all_items[item_index]["platform_status"][platform] = {
                            "status": PlatformStatus.PUBLISHED,
                            "published_at": datetime.utcnow().isoformat(),
                            "external_id": result.get("external_id"),
                            "url": result.get("url"),
                            "message": result.get("message")
                        }
                    else:
                        all_items[item_index]["platform_status"][platform] = {
                            "status": PlatformStatus.FAILED,
                            "message": result.get("message")
                        }
                    write_items(all_items)
                
            except Exception as e:
                item_results.append({
                    "platform": platform,
                    "success": False,
                    "message": str(e)
                })
                
                # Update item status to failed
                all_items = read_items()
                item_index = next((i for i, item in enumerate(all_items) if item.get("id") == item["id"]), None)
                if item_index is not None:
                    all_items[item_index]["platform_status"][platform] = {
                        "status": PlatformStatus.FAILED,
                        "message": str(e)
                    }
                    write_items(all_items)
        
        results.append({
            "item_id": item["id"],
            "platforms": item_results
        })
    
    return results

@router.get("/status")
async def get_platform_status():
    """Get platform connection status"""
    return {
        "ebay": {
            "connected": ebay_service.is_connected(),
            "status": "active" if ebay_service.is_connected() else "disconnected",
            "last_sync": datetime.utcnow().isoformat()
        },
        "shopify": {
            "connected": shopify_service.is_connected(),
            "status": "active" if shopify_service.is_connected() else "disconnected",
            "last_sync": datetime.utcnow().isoformat()
        }
    }

@router.get("/ebay/auth/start")
async def ebay_auth_start():
    """Redirect user to eBay OAuth2 consent page"""
    url = ebay_service.get_authorization_url()
    return RedirectResponse(url)

@router.get("/ebay/auth/callback")
async def ebay_auth_callback(request: Request):
    """Handle eBay OAuth2 callback and exchange code for token"""
    code = request.query_params.get("code")
    if not code:
        return JSONResponse({"success": False, "error": "Missing code parameter"}, status_code=400)
    result = await ebay_service.exchange_code_for_token(code)
    if result.get("success"):
        return JSONResponse({"success": True, "message": "eBay authentication successful"})
    else:
        return JSONResponse({"success": False, "error": result.get("error", "Unknown error")}, status_code=400) 