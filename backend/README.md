# Uploader Hub - Python Backend

A modern FastAPI backend for bulk uploading items to eBay and Shopify platforms.

## Features

- **FastAPI Framework**: Modern, fast web framework with automatic API documentation
- **Pydantic Validation**: Robust data validation and serialization
- **Pandas Integration**: Powerful CSV processing and data manipulation
- **Platform Integrations**: eBay and Shopify API support (with mock fallbacks)
- **Background Tasks**: Async processing for bulk operations
- **File Upload**: CSV file processing with validation
- **JSON Storage**: Simple file-based storage (easily upgradable to database)

## Tech Stack

- **Framework**: FastAPI
- **Validation**: Pydantic
- **Data Processing**: Pandas
- **E-commerce APIs**: eBay SDK, Shopify API
- **Async Processing**: Background tasks
- **Documentation**: Auto-generated OpenAPI/Swagger docs

## Quick Start

### Prerequisites

- Python 3.8+
- pip

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd uploader
   ```

2. **Run the setup script**
   ```bash
   python setup_python.py
   ```

3. **Start the backend server**
   ```bash
   cd backend
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 3001
   ```

4. **Access the API**
   - API: http://localhost:3001
   - Documentation: http://localhost:3001/docs
   - Health Check: http://localhost:3001/api/health

## API Endpoints

### Items Management
- `GET /api/items` - Get all items with filtering
- `GET /api/items/{item_id}` - Get specific item
- `POST /api/items` - Create new item
- `PUT /api/items/{item_id}` - Update item
- `DELETE /api/items/{item_id}` - Delete item
- `GET /api/items/stats/summary` - Get items statistics

### Platform Publishing
- `POST /api/platforms/{platform}/{item_id}` - Publish item to platform
- `POST /api/platforms/bulk` - Bulk publish items
- `GET /api/platforms/status` - Get platform connection status

### File Upload
- `POST /api/upload/csv` - Upload and parse CSV file
- `POST /api/upload/bulk` - Bulk create items from parsed data
- `GET /api/upload/template` - Download CSV template
- `POST /api/upload/validate` - Validate CSV data

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Application
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173

# eBay API (optional)
EBAY_APP_ID=your_ebay_app_id
EBAY_CERT_ID=your_ebay_cert_id
EBAY_CLIENT_SECRET=your_ebay_client_secret
EBAY_SANDBOX=true

# Shopify API (optional)
SHOPIFY_SHOP_DOMAIN=your_shop.myshopify.com
SHOPIFY_ACCESS_TOKEN=your_shopify_access_token
SHOPIFY_API_VERSION=2023-10

# Database (for future use)
DATABASE_URL=sqlite:///./uploader_hub.db

# Redis (for background tasks)
REDIS_URL=redis://localhost:6379/0
```

### API Keys Setup

#### eBay API
1. Go to [eBay Developer Portal](https://developer.ebay.com/)
2. Create a new application
3. Get your App ID, Cert ID, and Client Secret
4. Add them to your `.env` file

#### Shopify API
1. Go to your Shopify Admin
2. Navigate to Apps > Develop apps
3. Create a new app
4. Configure Admin API access
5. Get your Access Token and add it to `.env`

## Data Models

### Item Model
```python
class Item(BaseModel):
    title: str
    description: str
    price: float
    quantity: int
    category: str
    condition: Condition
    images: List[str]
    tags: List[str]
    weight: float
    dimensions: Dimensions
    shipping: Shipping
    platforms: Platforms
    platform_status: Dict[str, PlatformInfo]
```

### CSV Template
Download the CSV template to see the expected format:
```bash
curl http://localhost:3001/api/upload/template -o template.csv
```

## Development

### Project Structure
```
backend/
├── app/
│   ├── core/
│   │   ├── config.py      # Configuration settings
│   │   └── database.py    # Database operations
│   ├── models/
│   │   └── item.py        # Data models
│   ├── routers/
│   │   ├── items.py       # Items CRUD
│   │   ├── platforms.py   # Platform publishing
│   │   └── upload.py      # File upload
│   └── services/
│       ├── ebay_service.py    # eBay integration
│       └── shopify_service.py # Shopify integration
├── data/                  # JSON data storage
├── uploads/               # File uploads
├── main.py               # FastAPI application
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

### Running Tests
```bash
cd backend
pytest
```

### Code Formatting
```bash
cd backend
black .
isort .
```

### Adding New Features

1. **New Endpoints**: Add to appropriate router in `app/routers/`
2. **New Models**: Create in `app/models/`
3. **New Services**: Add to `app/services/`
4. **Configuration**: Update `app/core/config.py`

## Production Deployment

### Using Docker
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 3001

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3001"]
```

### Using Gunicorn
```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:3001
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3001/docs
- **ReDoc**: http://localhost:3001/redoc

The documentation is automatically generated from your FastAPI code and includes:
- All endpoints with parameters
- Request/response schemas
- Interactive testing interface
- Authentication requirements

## Troubleshooting

### Common Issues

1. **Import Errors**: Make sure all dependencies are installed
   ```bash
   pip install -r requirements.txt
   ```

2. **Port Already in Use**: Change the port in `.env` or kill the process
   ```bash
   lsof -ti:3001 | xargs kill -9
   ```

3. **CSV Upload Issues**: Check file format and encoding
   - Use UTF-8 encoding
   - Follow the template format
   - Ensure required fields are present

4. **API Connection Issues**: Verify API keys and network connectivity

### Logs
Check the console output for detailed error messages and stack traces.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details 