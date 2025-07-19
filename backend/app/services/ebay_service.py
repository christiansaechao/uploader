import uuid
import asyncio
import base64
import time
from typing import Dict, Any, Optional
from app.settings.ebay_config import ebay_settings
import httpx
from urllib.parse import urlencode


class EbayService:
    """eBay API integration service"""

    def __init__(self):
        self.connected = bool(
            ebay_settings.EBAY_APP_ID
            and ebay_settings.EBAY_CERT_ID
            and ebay_settings.EBAY_CLIENT_SECRET
            and ebay_settings.EBAY_REDIRECT_URI
        )
        self.access_token: Optional[str] = None  # In-memory token storage
        self.token_expiry: Optional[float] = None  # Unix timestamp

    def is_connected(self) -> bool:
        """Check if eBay API is configured"""
        return self.connected

    def _is_token_valid(self) -> bool:
        """Check if current token is valid and not expired"""
        if not self.access_token or not self.token_expiry:
            return False
        return time.time() < self.token_expiry

    async def create_listing(self, item: Dict[str, Any]) -> Dict[str, Any]:
        """Create a listing on eBay"""
        if not self.connected:
            # Mock implementation
            return await self._mock_create_listing(item)

        if not self._is_token_valid():
            return {
                "success": False,
                "error": "eBay authentication required. Please authorize the application first.",
            }

        # Real eBay API implementation would go here
        # For now, return mock response
        return await self._mock_create_listing(item)

    async def _mock_create_listing(self, item: Dict[str, Any]) -> Dict[str, Any]:
        """Mock eBay listing creation"""
        try:
            # Simulate API delay (1-3 seconds)
            await asyncio.sleep(1 + (uuid.uuid4().int % 2000) / 1000)

            # Generate mock response
            listing_id = f"ebay_{uuid.uuid4().hex[:8]}"

            return {
                "success": True,
                "external_id": listing_id,
                "url": f"https://www.ebay.com/itm/{listing_id}",
                "message": "Item successfully listed on eBay",
            }
        except Exception as e:
            return {"success": False, "error": f"Failed to create listing: {str(e)}"}

    async def update_listing(
        self, item: Dict[str, Any], listing_id: str
    ) -> Dict[str, Any]:
        """Update an existing eBay listing"""
        if not self.connected:
            return await self._mock_update_listing(item, listing_id)

        if not self._is_token_valid():
            return {
                "success": False,
                "error": "eBay authentication required. Please authorize the application first.",
            }

        # Real implementation would go here
        return await self._mock_update_listing(item, listing_id)

    async def _mock_update_listing(
        self, item: Dict[str, Any], listing_id: str
    ) -> Dict[str, Any]:
        """Mock eBay listing update"""
        try:
            await asyncio.sleep(0.5)

            return {
                "success": True,
                "external_id": listing_id,
                "url": f"https://www.ebay.com/itm/{listing_id}",
                "message": "Item successfully updated on eBay",
            }
        except Exception as e:
            return {"success": False, "error": f"Failed to update listing: {str(e)}"}

    async def delete_listing(self, listing_id: str) -> Dict[str, Any]:
        """Delete an eBay listing"""
        if not self.connected:
            return await self._mock_delete_listing(listing_id)

        if not self._is_token_valid():
            return {
                "success": False,
                "error": "eBay authentication required. Please authorize the application first.",
            }

        # Real implementation would go here
        return await self._mock_delete_listing(listing_id)

    async def _mock_delete_listing(self, listing_id: str) -> Dict[str, Any]:
        """Mock eBay listing deletion"""
        try:
            await asyncio.sleep(0.5)

            return {"success": True, "message": "Item successfully removed from eBay"}
        except Exception as e:
            return {"success": False, "error": f"Failed to delete listing: {str(e)}"}

    def _prepare_ebay_data(self, item: Dict[str, Any]) -> Dict[str, Any]:
        """Prepare item data for eBay API"""
        return {
            "title": item.get("title", ""),
            "description": item.get("description", ""),
            "price": item.get("price", 0),
            "quantity": item.get("quantity", 1),
            "category": item.get("category", "General"),
            "condition": item.get("condition", "New"),
            "images": item.get("images", []),
            "weight": item.get("weight", 0),
            "dimensions": item.get("dimensions", {}),
            "shipping": item.get("shipping", {}),
        }

    def get_authorization_url(self) -> str:
        """Generate eBay OAuth2 authorization URL"""
        if not self.connected:
            raise ValueError("eBay service not properly configured")

        params = {
            "client_id": ebay_settings.EBAY_APP_ID,
            "redirect_uri": ebay_settings.EBAY_REDIRECT_URI,
            "response_type": "code",
            "scope": "https://api.ebay.com/oauth/api_scope",
        }
        base_url = "https://auth.ebay.com/oauth2/authorize"
        return f"{base_url}?{urlencode(params)}"

    async def exchange_code_for_token(self, code: str) -> dict:
        """Exchange authorization code for access token and store it in memory"""
        if not self.connected:
            return {"success": False, "error": "eBay service not properly configured"}

        if not code:
            return {"success": False, "error": "Authorization code is required"}

        token_url = "https://api.ebay.com/identity/v1/oauth2/token"
        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": f"Basic {self._get_basic_auth()}",
        }
        data = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": ebay_settings.EBAY_REDIRECT_URI,
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(token_url, data=data, headers=headers)
                if response.status_code == 200:
                    token_data = response.json()
                    self.access_token = token_data.get("access_token")
                    # Store actual expiration time (current time + expires_in seconds)
                    expires_in = token_data.get("expires_in", 7200)  # Default 2 hours
                    self.token_expiry = time.time() + expires_in
                    return {"success": True, "token": self.access_token}
                else:
                    return {
                        "success": False,
                        "error": f"Token exchange failed: {response.status_code} - {response.text}",
                    }
        except Exception as e:
            return {"success": False, "error": f"Token exchange error: {str(e)}"}

    def _get_basic_auth(self) -> str:
        """Generate basic auth header for eBay OAuth"""
        # Use CLIENT_SECRET instead of CERT_ID for basic auth
        creds = f"{ebay_settings.EBAY_APP_ID}:{ebay_settings.EBAY_CLIENT_SECRET}"
        return base64.b64encode(creds.encode()).decode()

    def clear_token(self) -> None:
        """Clear stored authentication token"""
        self.access_token = None
        self.token_expiry = None
