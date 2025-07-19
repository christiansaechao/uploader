from .config import app_settings
from .ebay_config import ebay_settings
from .shopify_config import shopify_settings

# Export all settings
__all__ = ["app_settings", "ebay_settings", "shopify_settings"]


# Optional: Create a unified settings object
class Settings:
    def __init__(self):
        self.app = app_settings
        self.ebay = ebay_settings
        self.shopify = shopify_settings


# Single instance for convenience
settings = Settings()
