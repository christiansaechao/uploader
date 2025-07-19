from fastapi import APIRouter, HTTPException, UploadFile, File, BackgroundTasks
from fastapi.responses import StreamingResponse
from typing import List, Dict, Any
import pandas as pd
import io
import uuid
from datetime import datetime

from app.models.item import Item, ItemCreate
from app.settings.database import read_items, write_items

router = APIRouter()


@router.post("/csv")
async def upload_csv(file: UploadFile = File(...)):
    """Upload and parse CSV file"""
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    try:
        # Read CSV file
        content = await file.read()
        df = pd.read_csv(io.StringIO(content.decode("utf-8")))

        if df.empty:
            raise HTTPException(status_code=400, detail="CSV file is empty")

        # Transform CSV data to items
        transformed_items = []
        errors = []

        for index, row in df.iterrows():
            try:
                # Convert row to dict and handle missing values
                row_dict = row.to_dict()

                # Create item data
                item_data = {
                    "title": str(row_dict.get("title", "")).strip(),
                    "description": str(row_dict.get("description", "")).strip(),
                    "price": float(row_dict.get("price", 0)),
                    "quantity": int(row_dict.get("quantity", 1)),
                    "category": str(row_dict.get("category", "General")).strip(),
                    "condition": str(row_dict.get("condition", "New")).strip(),
                    "images": (
                        row_dict.get("images", "").split(",")
                        if row_dict.get("images")
                        else []
                    ),
                    "tags": (
                        row_dict.get("tags", "").split(",")
                        if row_dict.get("tags")
                        else []
                    ),
                    "weight": float(row_dict.get("weight", 0)),
                    "dimensions": {
                        "length": float(row_dict.get("length", 0)),
                        "width": float(row_dict.get("width", 0)),
                        "height": float(row_dict.get("height", 0)),
                    },
                    "shipping": {
                        "weight": float(
                            row_dict.get("shipping_weight", row_dict.get("weight", 0))
                        ),
                        "method": str(
                            row_dict.get("shipping_method", "Standard")
                        ).strip(),
                        "cost": float(row_dict.get("shipping_cost", 0)),
                    },
                    "platforms": {
                        "ebay": str(row_dict.get("ebay", "false")).lower()
                        in ["true", "1", "yes"],
                        "shopify": str(row_dict.get("shopify", "false")).lower()
                        in ["true", "1", "yes"],
                    },
                }

                # Clean up images and tags
                item_data["images"] = [
                    img.strip() for img in item_data["images"] if img.strip()
                ]
                item_data["tags"] = [
                    tag.strip() for tag in item_data["tags"] if tag.strip()
                ]

                # Validate item
                item = ItemCreate(**item_data)
                transformed_items.append(item.dict())

            except Exception as e:
                errors.append(
                    {"row": index + 1, "error": str(e), "data": row.to_dict()}
                )

        return {
            "message": f"Parsed {len(transformed_items)} valid items from CSV",
            "items": transformed_items,
            "errors": errors,
            "total_items": len(transformed_items),
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to process CSV file: {str(e)}"
        )


@router.post("/bulk")
async def bulk_create_items(data: Dict[str, Any]):
    """Bulk create items from parsed data"""
    items_data = data.get("items", [])

    if not items_data:
        raise HTTPException(status_code=400, detail="No items provided")

    try:
        existing_items = read_items()
        new_items = []
        errors = []

        for item_data in items_data:
            try:
                # Create new item
                new_item = Item(
                    **item_data,
                    id=str(uuid.uuid4()),
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow(),
                )
                new_items.append(new_item.dict())

            except Exception as e:
                errors.append({"data": item_data, "error": str(e)})

        # Add new items to existing ones
        all_items = existing_items + new_items
        write_items(all_items)

        return {
            "message": f"Created {len(new_items)} items",
            "created_items": new_items,
            "errors": errors,
            "total_items": len(all_items),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create items: {str(e)}")


@router.get("/template")
async def get_csv_template():
    """Get CSV template for download"""
    template_data = {
        "title": "Sample Product",
        "description": "This is a sample product description",
        "price": "29.99",
        "quantity": "10",
        "category": "Electronics",
        "condition": "New",
        "images": "https://example.com/image1.jpg,https://example.com/image2.jpg",
        "tags": "electronics,gadget,tech",
        "weight": "0.5",
        "length": "10",
        "width": "5",
        "height": "2",
        "shipping_weight": "0.6",
        "shipping_method": "Standard",
        "shipping_cost": "5.99",
        "ebay": "true",
        "shopify": "true",
    }

    # Create CSV content
    df = pd.DataFrame([template_data])
    csv_content = df.to_csv(index=False)

    return StreamingResponse(
        io.StringIO(csv_content),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=item-template.csv"},
    )


@router.post("/validate")
async def validate_csv_data(data: Dict[str, Any]):
    """Validate CSV data without creating items"""
    items_data = data.get("items", [])

    if not items_data:
        raise HTTPException(status_code=400, detail="No items provided")

    valid_items = []
    errors = []

    for index, item_data in enumerate(items_data):
        try:
            # Validate item
            item = ItemCreate(**item_data)
            valid_items.append(item.dict())

        except Exception as e:
            errors.append({"row": index + 1, "error": str(e), "data": item_data})

    return {
        "valid_items": valid_items,
        "errors": errors,
        "total_valid": len(valid_items),
        "total_errors": len(errors),
    }
