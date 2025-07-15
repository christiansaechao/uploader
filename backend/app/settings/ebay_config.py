from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

class EbaySettings(BaseSettings):
    """eBay API settings"""
    load_dotenv()

    EBAY_APP_ID: str = os.getenv("EBAY_APP_ID")
    EBAY_DEV_ID: str = os.getenv("EBAY_DEV_ID") # Primarily for Traditional APIs, less so for modern REST OAuth
    EBAY_CERT_ID: str = os.getenv("EBAY_CERT_ID")
    EBAY_SANDBOX: bool = True # Set to False for Production

    # Your Redirect URI must be registered in your eBay Developer Account (RuName)
    EBAY_REDIRECT_URI: str = "Christian_Saech-Christia-MultAi-rheygl" 
    
    @property
    def EBAY_CLIENT_SECRET(self):
        """For OAuth, Cert ID acts as the Client Secret."""
        return self.EBAY_CERT_ID

    @property
    def EBAY_API_BASE_URL(self):
        """Base URL for eBay RESTful APIs (e.g., Buy, Sell, Commerce APIs)."""
        return "https://api.sandbox.ebay.com" if self.EBAY_SANDBOX else "https://api.ebay.com"

    @property
    def EBAY_OAUTH_AUTHORIZE_URL(self):
        """URL for redirecting users to grant application access (OAuth authorization code flow)."""
        return "https://auth.sandbox.ebay.com/oauth2/authorize" if self.EBAY_SANDBOX else "https://auth.ebay.com/oauth2/authorize"

    @property
    def EBAY_OAUTH_TOKEN_URL(self):
        """URL for exchanging authorization codes for access tokens, or for client credentials flow."""
        return f"{self.EBAY_API_BASE_URL}/identity/v1/oauth2/token"

    def validate_ebay_config(self):
        required_fields = [self.EBAY_APP_ID, self.EBAY_CERT_ID] # DEV_ID less critical for modern OAuth
        return all((field is not None) and str(field).strip() for field in required_fields)

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"

# Create eBay settings instance
ebay_settings = EbaySettings()

if ebay_settings.validate_ebay_config():
    print("eBay API configuration seems valid.")
    print(f"eBay App ID: {ebay_settings.EBAY_APP_ID}")
    print(f"eBay Sandbox Mode: {ebay_settings.EBAY_SANDBOX}")
    print(f"eBay API Base URL: {ebay_settings.EBAY_API_BASE_URL}")
    print(f"eBay OAuth Authorize URL: {ebay_settings.EBAY_OAUTH_AUTHORIZE_URL}")
    print(f"eBay OAuth Token URL: {ebay_settings.EBAY_OAUTH_TOKEN_URL}")
    print(f"eBay Redirect URI: {ebay_settings.EBAY_REDIRECT_URI}")
else:
    print("⚠️ Warning: eBay API configuration incomplete. Check EBAY_APP_ID and EBAY_CERT_ID in your .env file.")