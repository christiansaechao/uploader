from pydantic_settings import BaseSettings
from typing import Optional


class ShopifySettings(BaseSettings):
    """Shopify API settings"""

    SHOPIFY_SHOP_DOMAIN: str = ""
    SHOPIFY_ACCESS_TOKEN: str = ""
    SHOPIFY_API_VERSION: str = "2024-01"
    SHOPIFY_WEBHOOK_SECRET: Optional[str] = None

    @property
    def SHOPIFY_BASE_URL(self) -> str:
        return (
            f"https://{self.SHOPIFY_SHOP_DOMAIN}/admin/api/{self.SHOPIFY_API_VERSION}"
        )

    def validate_shopify_config(self) -> bool:
        return bool(self.SHOPIFY_SHOP_DOMAIN and self.SHOPIFY_ACCESS_TOKEN)

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"


# Create Shopify settings instance
shopify_settings = ShopifySettings()

# Validation on startup
if not shopify_settings.validate_shopify_config():
    print("⚠️  Warning: Shopify API configuration incomplete")
