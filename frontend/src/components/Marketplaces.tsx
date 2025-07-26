import React from 'react';
import { Plus, Settings, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { Marketplace } from '../types';

interface MarketplacesProps {
  marketplaces: Marketplace[];
}

export default function Marketplaces({ 
  marketplaces
}: MarketplacesProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'disconnected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <XCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'disconnected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const connectedMarketplaces = marketplaces.filter(m => m.status === 'connected');
  const totalListings = marketplaces.reduce((total, m) => total + m.listingsCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplaces</h1>
          <p className="text-gray-600 mt-2">Connect and manage your marketplace integrations.</p>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Connect Marketplace</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Connected</p>
              <p className="text-2xl font-bold text-gray-900">{connectedMarketplaces.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Settings className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Listings</p>
              <p className="text-2xl font-bold text-gray-900">{totalListings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <RefreshCw className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Last Sync</p>
              <p className="text-2xl font-bold text-gray-900">2h ago</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketplaces.map((marketplace) => (
          <div key={marketplace.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: marketplace.color }}
                >
                  {marketplace.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{marketplace.name}</h3>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(marketplace.status)}
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(marketplace.status)}`}>
                      {marketplace.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Active Listings</span>
                <span className="font-medium text-gray-900">{marketplace.listingsCount}</span>
              </div>
              {marketplace.lastSync && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last Sync</span>
                  <span className="text-gray-500">{marketplace.lastSync}</span>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              {marketplace.status === 'connected' && (
                <button
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                >
                  <RefreshCw size={16} />
                  <span>Sync</span>
                </button>
              )}
              <button
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
              >
                <Settings size={16} />
                <span>Configure</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Marketplaces</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Amazon', color: '#FF9900', icon: 'A' },
            { name: 'Etsy', color: '#F16521', icon: 'E' },
            { name: 'Facebook Marketplace', color: '#1877F2', icon: 'F' },
            { name: 'Mercari', color: '#FF6384', icon: 'M' }
          ].map((marketplace, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: marketplace.color }}
                >
                  {marketplace.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{marketplace.name}</h4>
                  <p className="text-sm text-gray-500">Available to connect</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}