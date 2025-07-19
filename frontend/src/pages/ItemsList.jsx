import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  ShoppingCart,
  Store,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  Package,
} from 'lucide-react';
import useItemsStore from '../stores/itemsStore';
import { format } from 'date-fns';

export default function ItemsList() {
// add items to const below back in later
  const {
    loading,
    getFilteredItems,
    setFilter,
    filters,
    selectedItems,
    toggleItemSelection,
    selectAllItems,
    clearSelection,
    deleteItem,
    publishToPlatform,
    bulkPublish,
  } = useItemsStore();

  const [isPublishing, setIsPublishing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = getFilteredItems();

  useEffect(() => {
    setFilter('search', searchTerm);
  }, [searchTerm, setFilter]);

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(itemId);
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };


  // eslint-disable-next-line no-unused-vars
  const handlePublishToPlatform = async (itemId, platform) => {
    try {
      setIsPublishing(true);
      await publishToPlatform(itemId, platform);
    } catch (error) {
      console.error(`Failed to publish to ${platform}:`, error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleBulkPublish = async (platforms) => {
    if (selectedItems.size === 0) return;

    try {
      setIsPublishing(true);
      await bulkPublish(Array.from(selectedItems), platforms);
      clearSelection();
    } catch (error) {
      console.error('Failed to bulk publish:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="h-4 w-4 text-success-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-error-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-success-100 text-success-800';
      case 'failed':
        return 'bg-error-100 text-error-800';
      case 'pending':
        return 'bg-warning-100 text-warning-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Title',
      'Description',
      'Price',
      'Quantity',
      'Category',
      'eBay Status',
      'Shopify Status',
      'Created At',
    ];
    const csvContent = [
      headers.join(','),
      ...filteredItems.map((item) =>
        [
          `"${item.title}"`,
          `"${item.description}"`,
          item.price,
          item.quantity,
          item.category,
          item.platforms?.ebay?.status || 'not-published',
          item.platforms?.shopify?.status || 'not-published',
          format(new Date(item.createdAt), 'yyyy-MM-dd HH:mm:ss'),
        ].join(','),
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `items-${format(new Date(), 'yyyy-MM-dd')}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Items</h1>
          <p className="mt-2 text-gray-600">
            Manage and publish your items to eBay and Shopify.
          </p>
        </div>
        <div className="flex space-x-3">
          <button onClick={exportToCSV} className="btn btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
          <Link to="/upload" className="btn btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-secondary"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>

            {selectedItems.size > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedItems.size} selected
                </span>
                <button
                  onClick={clearSelection}
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilter('status', e.target.value)}
                  className="select"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="published">Published</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform
                </label>
                <select
                  value={filters.platform}
                  onChange={(e) => setFilter('platform', e.target.value)}
                  className="select"
                >
                  <option value="all">All Platforms</option>
                  <option value="ebay">eBay</option>
                  <option value="shopify">Shopify</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {selectedItems.length} items selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkPublish(['ebay'])}
                disabled={isPublishing}
                className="btn btn-warning btn-sm"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Publish to eBay
              </button>
              <button
                onClick={() => handleBulkPublish(['shopify'])}
                disabled={isPublishing}
                className="btn btn-success btn-sm"
              >
                <Store className="h-4 w-4 mr-1" />
                Publish to Shopify
              </button>
              <button
                onClick={() => handleBulkPublish(['ebay', 'shopify'])}
                disabled={isPublishing}
                className="btn btn-primary btn-sm"
              >
                Publish to Both
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Items Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No items found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new item.
            </p>
            <div className="mt-6">
              <Link to="/upload" className="btn btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredItems.length}
                      onChange={() => {
                        if (selectedItems.size === filteredItems.length) {
                          clearSelection();
                        } else {
                          selectAllItems();
                        }
                      }}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    eBay Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shopify Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${item.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(
                          item.platforms?.ebay?.status || 'pending',
                        )}
                        <span
                          className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.platforms?.ebay?.status || 'pending')}`}
                        >
                          {item.platforms?.ebay?.status || 'pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(
                          item.platforms?.shopify?.status || 'pending',
                        )}
                        <span
                          className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.platforms?.shopify?.status || 'pending')}`}
                        >
                          {item.platforms?.shopify?.status || 'pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(item.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {item.platforms?.ebay?.url && (
                          <a
                            href={item.platforms.ebay.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-600 hover:text-orange-900"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        {item.platforms?.shopify?.url && (
                          <a
                            href={item.platforms.shopify.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-900"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-error-600 hover:text-error-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
