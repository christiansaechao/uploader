export interface Marketplace {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'pending';
  icon: string;
  color: string;
  listingsCount: number;
  lastSync?: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  fields: TemplateField[];
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

export interface TemplateField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'boolean';
  required: boolean;
  defaultValue?: string;
  options?: string[];
}

export interface Listing {
  id: string;
  title: string;
  price: number;
  currency: string;
  status: 'active' | 'inactive' | 'pending' | 'sold';
  marketplaces: string[];
  inventory: number;
  template?: string;
  createdAt: string;
  lastUpdated: string;
  images: string[];
  views: number;
  sales: number;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  lowStockThreshold: number;
  cost: number;
  price: number;
  category: string;
  location?: string;
  lastUpdated: string;
}

export interface DashboardStats {
  totalListings: number;
  activeListings: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockItems: number;
  connectedMarketplaces: number;
}