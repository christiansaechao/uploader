import type { DashboardStats, Template, Listing, InventoryItem, Marketplace } from '../types';

export const mockStats: DashboardStats = {
  totalListings: 247,
  activeListings: 198,
  totalRevenue: 45750,
  pendingOrders: 12,
  lowStockItems: 8,
  connectedMarketplaces: 4
};

export const mockTemplates: Template[] = [
  {
    id: 'tmpl-1',
    name: 'Electronics Template',
    category: 'Electronics',
    description: 'Standard template for electronic products with specifications',
    fields: [
      { id: 'f1', name: 'Brand', type: 'text', required: true },
      { id: 'f2', name: 'Model', type: 'text', required: true },
      { id: 'f3', name: 'Color', type: 'select', required: false, options: ['Black', 'White', 'Silver'] },
      { id: 'f4', name: 'Price', type: 'number', required: true },
      { id: 'f5', name: 'Description', type: 'textarea', required: true }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    usageCount: 45
  },
  {
    id: 'tmpl-2',
    name: 'Clothing Template',
    category: 'Fashion',
    description: 'Template for clothing items with size and material options',
    fields: [
      { id: 'f1', name: 'Brand', type: 'text', required: true },
      { id: 'f2', name: 'Size', type: 'select', required: true, options: ['XS', 'S', 'M', 'L', 'XL'] },
      { id: 'f3', name: 'Material', type: 'text', required: true },
      { id: 'f4', name: 'Color', type: 'text', required: true },
      { id: 'f5', name: 'Care Instructions', type: 'textarea', required: false }
    ],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    usageCount: 32
  },
  {
    id: 'tmpl-3',
    name: 'Home & Garden',
    category: 'Home',
    description: 'Template for home and garden products',
    fields: [
      { id: 'f1', name: 'Product Name', type: 'text', required: true },
      { id: 'f2', name: 'Dimensions', type: 'text', required: true },
      { id: 'f3', name: 'Material', type: 'text', required: true },
      { id: 'f4', name: 'Indoor/Outdoor', type: 'select', required: true, options: ['Indoor', 'Outdoor', 'Both'] }
    ],
    createdAt: '2024-01-12T11:30:00Z',
    updatedAt: '2024-01-22T10:15:00Z',
    usageCount: 18
  }
];

export const mockListings: Listing[] = [
  {
    id: 'lst-1',
    title: 'Wireless Bluetooth Headphones - Premium Sound Quality',
    price: 79.99,
    currency: '$',
    status: 'active',
    marketplaces: ['eBay', 'Shopify'],
    inventory: 25,
    template: 'tmpl-1',
    createdAt: '2024-01-20T10:00:00Z',
    lastUpdated: '2024-01-22T14:30:00Z',
    images: [],
    views: 342,
    sales: 15
  },
  {
    id: 'lst-2',
    title: 'Vintage Denim Jacket - Classic Blue',
    price: 45.00,
    currency: '$',
    status: 'active',
    marketplaces: ['eBay', 'Shopify', 'Etsy'],
    inventory: 8,
    template: 'tmpl-2',
    createdAt: '2024-01-18T09:15:00Z',
    lastUpdated: '2024-01-21T11:20:00Z',
    images: [],
    views: 186,
    sales: 7
  },
  {
    id: 'lst-3',
    title: 'Smart Watch - Fitness Tracker with Heart Rate Monitor',
    price: 129.99,
    currency: '$',
    status: 'pending',
    marketplaces: ['eBay'],
    inventory: 15,
    template: 'tmpl-1',
    createdAt: '2024-01-22T16:00:00Z',
    lastUpdated: '2024-01-22T16:00:00Z',
    images: [],
    views: 89,
    sales: 3
  },
  {
    id: 'lst-4',
    title: 'Ceramic Plant Pot Set - Modern Design',
    price: 24.99,
    currency: '$',
    status: 'inactive',
    marketplaces: ['Shopify'],
    inventory: 0,
    template: 'tmpl-3',
    createdAt: '2024-01-15T14:20:00Z',
    lastUpdated: '2024-01-20T09:45:00Z',
    images: [],
    views: 145,
    sales: 12
  },
  {
    id: 'lst-5',
    title: 'Gaming Mechanical Keyboard - RGB Backlit',
    price: 89.99,
    currency: '$',
    status: 'sold',
    marketplaces: ['eBay', 'Shopify'],
    inventory: 3,
    template: 'tmpl-1',
    createdAt: '2024-01-10T12:30:00Z',
    lastUpdated: '2024-01-19T15:15:00Z',
    images: [],
    views: 267,
    sales: 22
  }
];

export const mockInventory: InventoryItem[] = [
  {
    id: 'inv-1',
    sku: 'WBH-001',
    name: 'Wireless Bluetooth Headphones',
    quantity: 25,
    lowStockThreshold: 10,
    cost: 35.00,
    price: 79.99,
    category: 'Electronics',
    location: 'Warehouse A',
    lastUpdated: '2024-01-22T10:30:00Z'
  },
  {
    id: 'inv-2',
    sku: 'VDJ-002',
    name: 'Vintage Denim Jacket',
    quantity: 8,
    lowStockThreshold: 5,
    cost: 20.00,
    price: 45.00,
    category: 'Fashion',
    location: 'Warehouse B',
    lastUpdated: '2024-01-21T14:15:00Z'
  },
  {
    id: 'inv-3',
    sku: 'SW-003',
    name: 'Smart Watch Fitness Tracker',
    quantity: 15,
    lowStockThreshold: 8,
    cost: 65.00,
    price: 129.99,
    category: 'Electronics',
    location: 'Warehouse A',
    lastUpdated: '2024-01-22T16:00:00Z'
  },
  {
    id: 'inv-4',
    sku: 'CPP-004',
    name: 'Ceramic Plant Pot Set',
    quantity: 0,
    lowStockThreshold: 12,
    cost: 8.50,
    price: 24.99,
    category: 'Home',
    location: 'Warehouse C',
    lastUpdated: '2024-01-20T09:45:00Z'
  },
  {
    id: 'inv-5',
    sku: 'GMK-005',
    name: 'Gaming Mechanical Keyboard',
    quantity: 3,
    lowStockThreshold: 5,
    cost: 42.00,
    price: 89.99,
    category: 'Electronics',
    location: 'Warehouse A',
    lastUpdated: '2024-01-19T15:15:00Z'
  },
  {
    id: 'inv-6',
    sku: 'USC-006',
    name: 'USB-C Cable 3ft',
    quantity: 2,
    lowStockThreshold: 20,
    cost: 3.50,
    price: 12.99,
    category: 'Electronics',
    location: 'Warehouse A',
    lastUpdated: '2024-01-21T11:30:00Z'
  }
];

export const mockMarketplaces: Marketplace[] = [
  {
    id: 'mp-1',
    name: 'eBay',
    status: 'connected',
    icon: 'E',
    color: '#E53238',
    listingsCount: 89,
    lastSync: '2 hours ago'
  },
  {
    id: 'mp-2',
    name: 'Shopify',
    status: 'connected',
    icon: 'S',
    color: '#7AB55C',
    listingsCount: 67,
    lastSync: '1 hour ago'
  },
  {
    id: 'mp-3',
    name: 'Etsy',
    status: 'pending',
    icon: 'Et',
    color: '#F16521',
    listingsCount: 0
  },
  {
    id: 'mp-4',
    name: 'Amazon',
    status: 'disconnected',
    icon: 'A',
    color: '#FF9900',
    listingsCount: 0
  }
];