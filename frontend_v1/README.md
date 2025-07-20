# Uploader Hub Frontend

A modern React application for bulk uploading items to eBay and Shopify platforms.

## Features

- **Dashboard**: Overview with statistics and quick actions
- **Single Item Upload**: Comprehensive form for individual item creation
- **Bulk Upload**: CSV file upload with preview and validation
- **Item Management**: Table view with filtering, selection, and bulk actions
- **Platform Publishing**: Publish items to eBay and Shopify with status tracking
- **Real-time Validation**: Form validation using Zod schemas
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client
- **Date-fns** - Date utilities

## Getting Started

### Prerequisites

- Node.js 16+
- npm or Yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── Layout.jsx          # Main layout with navigation
│   └── ui/                 # Reusable UI components
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── Select.jsx
│       ├── Textarea.jsx
│       └── Card.jsx
├── pages/
│   ├── Dashboard.jsx       # Overview page
│   ├── ItemForm.jsx        # Single item upload
│   ├── BulkUpload.jsx      # CSV bulk upload
│   └── ItemsList.jsx       # Item management table
├── stores/
│   └── itemsStore.js       # Zustand store for items
├── schemas/
│   └── itemSchema.js       # Zod validation schemas
├── App.jsx                 # Main app component
├── main.jsx               # Entry point
└── index.css              # Global styles
```

## State Management

The application uses Zustand for state management with the following store:

### Items Store (`stores/itemsStore.js`)

- **State**: Items array, loading states, filters, selections
- **Actions**: CRUD operations, publishing, bulk actions
- **Computed**: Filtered items, statistics

### Key Features

- **Real-time Updates**: Automatic UI updates when state changes
- **Optimistic Updates**: Immediate UI feedback for better UX
- **Error Handling**: Centralized error management
- **Loading States**: Loading indicators for async operations

## Form Validation

All forms use Zod schemas for validation:

### Item Schema (`schemas/itemSchema.js`)

- **Required Fields**: title, description, price, quantity
- **Optional Fields**: category, condition, images, tags, dimensions, shipping
- **Platform Selection**: eBay and/or Shopify
- **Data Transformation**: String inputs converted to appropriate types

### Validation Features

- **Real-time Validation**: Instant feedback as user types
- **Custom Error Messages**: User-friendly error descriptions
- **Type Safety**: Runtime type checking and transformation

## API Integration

The frontend communicates with the backend API:

### Endpoints

- `GET /api/items` - Fetch all items
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `POST /api/upload/csv` - Upload CSV file
- `POST /api/upload/bulk` - Bulk create items
- `POST /api/platforms/:platform/:itemId` - Publish to platform
- `POST /api/platforms/bulk` - Bulk publish

### Error Handling

- **Network Errors**: Automatic retry and user feedback
- **Validation Errors**: Display field-specific error messages
- **Server Errors**: User-friendly error messages with retry options

## Styling

The application uses Tailwind CSS with custom design tokens:

### Color Palette

- **Primary**: Blue shades for main actions
- **Success**: Green shades for successful operations
- **Warning**: Yellow/Orange shades for warnings
- **Error**: Red shades for errors

### Components

- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels, keyboard navigation
- **Dark Mode Ready**: CSS variables for easy theming

## Development

### Code Style

- **ESLint**: Code linting with React-specific rules
- **Prettier**: Code formatting (configured in editor)
- **Component Structure**: Functional components with hooks

### Best Practices

- **Performance**: React.memo for expensive components
- **Accessibility**: Semantic HTML and ARIA attributes
- **Error Boundaries**: Graceful error handling
- **Loading States**: Skeleton screens and spinners

## Deployment

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=Uploader Hub
```

### Build Optimization

- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Image and font optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
