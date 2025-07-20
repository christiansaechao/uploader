import { Link } from 'react-router-dom';
import {
  Upload,
  FileSpreadsheet,
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import useItemsStore from '../stores/itemsStore';

export default function Dashboard() {
  const { getStats, loading } = useItemsStore();
  const stats = getStats();

  const quickActions = [
    {
      name: 'Upload Single Item',
      description: 'Add a new item to upload to eBay and Shopify',
      href: '/upload',
      icon: Upload,
      color: 'bg-primary-500 hover:bg-primary-600',
    },
    {
      name: 'Bulk Upload',
      description: 'Upload multiple items using a CSV file',
      href: '/bulk-upload',
      icon: FileSpreadsheet,
      color: 'bg-success-500 hover:bg-success-600',
    },
    {
      name: 'Manage Items',
      description: 'View and manage all your uploaded items',
      href: '/items',
      icon: Package,
      color: 'bg-warning-500 hover:bg-warning-600',
    },
  ];

  const statCards = [
    {
      name: 'Total Items',
      value: stats.total,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      name: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      name: 'Published',
      value: stats.published,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      name: 'Failed',
      value: stats.failed,
      icon: AlertCircle,
      color: 'bg-red-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to Uploader Hub. Manage your items and upload them to eBay and
          Shopify.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon
                    className={`h-6 w-6 text-white ${stat.color} p-1 rounded-md`}
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div>
                <span
                  className={`inline-flex p-3 ${action.color} text-white rounded-lg`}
                >
                  <action.icon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600">
                  {action.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {action.description}
                </p>
              </div>
              <span
                className="absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                aria-hidden="true"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Activity
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Your recent uploads and publishing activity will appear here.</p>
          </div>
          <div className="mt-3 text-sm">
            <a
              href="/items"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              View all items <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
