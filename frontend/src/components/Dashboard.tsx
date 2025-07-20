import React from 'react';
import { TrendingUp, TrendingDown, Package, ShoppingBag, AlertTriangle, Store } from 'lucide-react';
import type { DashboardStats } from '../types';

interface DashboardProps {
  stats: DashboardStats;
}

export default function Dashboard({ stats }: DashboardProps) {
  const statCards = [
    {
      title: 'Total Listings',
      value: stats.totalListings.toLocaleString(),
      change: '+12%',
      trend: 'up',
      icon: Package,
      color: 'blue'
    },
    {
      title: 'Active Listings',
      value: stats.activeListings.toLocaleString(),
      change: '+5%',
      trend: 'up',
      icon: ShoppingBag,
      color: 'green'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: '+18%',
      trend: 'up',
      icon: TrendingUp,
      color: 'emerald'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders.toString(),
      change: '-3%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'orange'
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems.toString(),
      change: '+2',
      trend: 'up',
      icon: Package,
      color: 'red'
    },
    {
      title: 'Connected Platforms',
      value: stats.connectedMarketplaces.toString(),
      change: '+1',
      trend: 'up',
      icon: Store,
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      emerald: 'bg-emerald-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's an overview of your marketplace performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
                  <div className="flex items-center mt-2">
                    {card.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {card.change}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${getColorClasses(card.color)}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'New listing created', item: 'Wireless Headphones', time: '2 hours ago', status: 'success' },
              { action: 'Inventory updated', item: 'Gaming Mouse', time: '4 hours ago', status: 'info' },
              { action: 'Order received', item: 'USB Cable', time: '6 hours ago', status: 'success' },
              { action: 'Low stock alert', item: 'Phone Case', time: '1 day ago', status: 'warning' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.item}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Listings</h3>
          <div className="space-y-4">
            {[
              { name: 'Wireless Bluetooth Earbuds', sales: 45, revenue: 2250, growth: '+15%' },
              { name: 'Gaming Mechanical Keyboard', sales: 32, revenue: 3200, growth: '+8%' },
              { name: 'USB-C Hub', sales: 28, revenue: 1400, growth: '+22%' },
              { name: 'Phone Screen Protector', sales: 67, revenue: 670, growth: '+5%' }
            ].map((listing, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{listing.name}</p>
                  <p className="text-xs text-gray-600">{listing.sales} sales • ${listing.revenue}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-green-600">{listing.growth}</span>
                  <TrendingUp className="h-3 w-3 text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}