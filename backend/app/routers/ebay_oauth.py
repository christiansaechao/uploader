import base64
import httpx
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse, HTMLResponse
from app.settings.ebay_config import ebay_settings
from typing import List

router = APIRouter()

# --- eBay API Configuration ---
EBAY_OAUTH_AUTH_URL = (
    "https://auth.sandbox.ebay.com/oauth2/authorize"
    if ebay_settings.EBAY_SANDBOX
    else "https://auth.ebay.com/oauth2/authorize"
)
EBAY_OAUTH_TOKEN_URL = (
    "https://api.sandbox.ebay.com/identity/v1/oauth2/token"
    if ebay_settings.EBAY_SANDBOX
    else "https://api.ebay.com/identity/v1/oauth2/token"
)

EBAY_SCOPES = [
    "https://api.ebay.com/oauth/api_scope/sell.inventory",
    "https://api.ebay.com/oauth/api_scope/sell.account",
]

EBAY_SCOPES_STR = " ".join(EBAY_SCOPES)

EBAY_REDIRECT_URI: str = "Christian_Saech-Christia-MultAi-rheygl"


def get_redirect_uri(request: Request):
    return EBAY_REDIRECT_URI


def get_encoded_credentials():
    credentials = f"{ebay_settings.EBAY_APP_ID}:{ebay_settings.EBAY_CLIENT_SECRET}"
    return base64.b64encode(credentials.encode()).decode()


@router.get("/", response_class=HTMLResponse)
async def read_root():
    return """
    <h1>Uploader Hub</h1>
    <p>Welcome to your Uploader Hub! Test eBay integration:</p>
    <p><a href='/api/ebay_oauth/ebay/connect'>Connect to eBay Sandbox</a></p>
    <p><a href='/api/ebay_oauth/privacy'>View Privacy Policy (Placeholder)</a></p>
    """


@router.get("/privacy", response_class=HTMLResponse)
async def privacy_policy():
    return """
    <h1>Privacy Policy (Placeholder for Development)</h1>
    <p>This is a temporary privacy policy for the Uploader Hub development environment.</p>
    <p>In a real application, this page would detail how user data is collected, used, and protected.</p>
    """


@router.get("/ebay/connect")
async def ebay_connect(request: Request):
    redirect_uri = get_redirect_uri(request)
    auth_url = (
        f"{EBAY_OAUTH_AUTH_URL}?"
        f"client_id={ebay_settings.EBAY_APP_ID}&"
        f"response_type=code&"
        f"redirect_uri={redirect_uri}&"
        f"scope={EBAY_SCOPES_STR}"
    )
    return RedirectResponse(url=auth_url)


@router.get("/ebay/oauth_callback")
async def ebay_oauth_callback(request: Request):
    code = request.query_params.get("code")
    error = request.query_params.get("error")
    error_description = request.query_params.get("error_description")
    if error:
        return HTMLResponse(
            f"<h1>eBay Connection Failed!</h1><p>Error: {error}</p><p>Description: {error_description}</p><p><a href='/api/ebay_oauth/'>Go Home</a></p>"
        )
    if not code:
        raise HTTPException(
            status_code=400, detail="Missing authorization code from eBay."
        )
    redirect_uri = get_redirect_uri(request)
    encoded_credentials = get_encoded_credentials()
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": f"Basic {encoded_credentials}",
    }
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirect_uri,
    }
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                EBAY_OAUTH_TOKEN_URL, headers=headers, data=data
            )
            
            print(response)
            response.raise_for_status()
            token_data = response.json()
            access_token = token_data.get("access_token")
            refresh_token = token_data.get("refresh_token")
            expires_in = token_data.get("expires_in")
            refresh_token_expires_in = token_data.get("refresh_token_expires_in")
            return HTMLResponse(
                f"""
                <h1>eBay Connection Successful!</h1>
                <p>You have successfully connected your eBay account.</p>
                <p><strong>Access Token (for API calls):</strong> {access_token[:30]}...</p>
                <p><strong>Refresh Token (to get new access tokens):</strong> {refresh_token[:30]}...</p>
                <p>Access token expires in {expires_in} seconds.</p>
                <p>Refresh token expires in {refresh_token_expires_in} seconds.</p>
                <p><i>(In a real app, these would be stored securely and not displayed.)</i></p>
                <p><a href='/api/ebay_oauth/'>Go Home</a></p>
            """
            )
    except httpx.HTTPStatusError as e:
        return HTMLResponse(
            f"<h1>eBay Token Exchange Failed!</h1><p>Status: {e.response.status_code}</p><p>Detail: {e.response.text}</p><p><a href='/api/ebay_oauth/'>Go Home</a></p>"
        )
    except httpx.RequestError as e:
        return HTMLResponse(
            f"<h1>eBay Token Exchange Failed!</h1><p>Network Error: {e}</p><p><a href='/api/ebay_oauth/'>Go Home</a></p>"
        )
    except Exception as e:
        return HTMLResponse(
            f"<h1>An Unexpected Error Occurred!</h1><p>Error: {e}</p><p><a href='/api/ebay_oauth/'>Go Home</a></p>"
        )
