import uuid
import asyncio
from typing import Dict, Any
from app.settings.shopify_config import shopify_settings


class ShopifyService:
    """Shopify API integration service"""

    def __init__(self):
        self.connected = bool(
            shopify_settings.SHOPIFY_SHOP_DOMAIN
            and shopify_settings.SHOPIFY_ACCESS_TOKEN
        )

    def is_connected(self) -> bool:
        """Check if Shopify API is configured"""
        return self.connected

    async def create_product(self, item: Dict[str, Any]) -> Dict[str, Any]:
        """Create a product on Shopify"""
        if not self.connected:
            # Mock implementation
            return await self._mock_create_product(item)

        # Real Shopify API implementation would go here
        # For now, return mock response
        return await self._mock_create_product(item)

    async def _mock_create_product(self, item: Dict[str, Any]) -> Dict[str, Any]:
        """Mock Shopify product creation"""
        # Simulate API delay
        await asyncio.sleep(1 + (uuid.uuid4().int % 2000) / 1000)

        # Generate mock response
        product_id = f"shopify_{uuid.uuid4().hex[:8]}"
        handle = item.get("title", "").lower().replace(" ", "-")[:50]

        return {
            "success": True,
            "external_id": product_id,
            "url": f"https://{shopify_settings.SHOPIFY_SHOP_DOMAIN or 'your-store.myshopify.com'}/products/{handle}",
            "message": "Product successfully created on Shopify",
        }

    async def update_product(
        self, item: Dict[str, Any], product_id: str
    ) -> Dict[str, Any]:
        """Update an existing Shopify product"""
        if not self.connected:
            return await self._mock_update_product(item, product_id)

        # Real implementation would go here
        return await self._mock_update_product(item, product_id)

    async def _mock_update_product(
        self, item: Dict[str, Any], product_id: str
    ) -> Dict[str, Any]:
        """Mock Shopify product update"""
        await asyncio.sleep(0.5)

        handle = item.get("title", "").lower().replace(" ", "-")[:50]

        return {
            "success": True,
            "external_id": product_id,
            "url": f"https://{shopify_settings.SHOPIFY_SHOP_DOMAIN or 'your-store.myshopify.com'}/products/{handle}",
            "message": "Product successfully updated on Shopify",
        }

    async def delete_product(self, product_id: str) -> Dict[str, Any]:
        """Delete a Shopify product"""
        if not self.connected:
            return await self._mock_delete_product(product_id)

        # Real implementation would go here
        return await self._mock_delete_product(product_id)

    async def _mock_delete_product(self, product_id: str) -> Dict[str, Any]:
        """Mock Shopify product deletion"""
        await asyncio.sleep(0.5)

        return {"success": True, "message": "Product successfully removed from Shopify"}

    def _prepare_shopify_data(self, item: Dict[str, Any]) -> Dict[str, Any]:
        """Prepare item data for Shopify API"""
        return {
            "title": item.get("title", ""),
            "body_html": item.get("description", ""),
            "vendor": "Your Store",
            "product_type": item.get("category", "General"),
            "tags": ",".join(item.get("tags", [])),
            "variants": [
                {
                    "price": str(item.get("price", 0)),
                    "inventory_quantity": item.get("quantity", 1),
                    "weight": item.get("weight", 0),
                    "weight_unit": "lb",
                }
            ],
            "images": [{"src": img} for img in item.get("images", [])],
        }
