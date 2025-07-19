import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Save,
  Package,
  DollarSign,
  Hash,
  Tag,
  Image,
  Weight,
  Ruler,
  Truck,
  ShoppingCart,
  Store,
} from 'lucide-react';
import useItemsStore from '../stores/itemsStore';
import { itemFormSchema } from '../schemas/itemSchema';

export default function ItemForm() {
  const navigate = useNavigate();
  const { createItem, loading } = useItemsStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      title: '',
      description: '',
      price: '',
      quantity: '1',
      category: 'General',
      condition: 'New',
      images: '',
      tags: '',
      weight: '0',
      length: '0',
      width: '0',
      height: '0',
      shippingWeight: '0',
      shippingMethod: 'Standard',
      shippingCost: '0',
      ebay: false,
      shopify: false,
    },
  });

  const watchedPlatforms = watch(['ebay', 'shopify']);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Transform form data to match backend schema
      const itemData = {
        title: data.title,
        description: data.description,
        price: data.price,
        quantity: data.quantity,
        category: data.category,
        condition: data.condition,
        images: data.images,
        tags: data.tags,
        weight: data.weight,
        dimensions: {
          length: data.length,
          width: data.width,
          height: data.height,
        },
        shipping: {
          weight: data.shippingWeight,
          method: data.shippingMethod,
          cost: data.shippingCost,
        },
        platforms: {
          ebay: data.ebay,
          shopify: data.shopify,
        },
      };

      await createItem(itemData);
      navigate('/items');
    } catch (error) {
      console.error('Failed to create item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upload New Item</h1>
        <p className="mt-2 text-gray-600">
          Add a new item to upload to eBay and Shopify platforms.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-6">
            <Package className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              Basic Information
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                {...register('title')}
                className="input mt-1"
                placeholder="Enter item title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-error-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="textarea mt-1"
                placeholder="Enter item description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-error-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  {...register('price')}
                  className="input pl-10"
                  placeholder="0.00"
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-error-600">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  {...register('quantity')}
                  className="input pl-10"
                  placeholder="1"
                />
              </div>
              {errors.quantity && (
                <p className="mt-1 text-sm text-error-600">
                  {errors.quantity.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select {...register('category')} className="select mt-1">
                <option value="General">General</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Sports">Sports</option>
                <option value="Books">Books</option>
                <option value="Toys">Toys</option>
                <option value="Automotive">Automotive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Condition
              </label>
              <select {...register('condition')} className="select mt-1">
                <option value="New">New</option>
                <option value="Used">Used</option>
                <option value="Refurbished">Refurbished</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Images and Tags */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-6">
            <Image className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              Images & Tags
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Image URLs
              </label>
              <input
                type="text"
                {...register('images')}
                className="input mt-1"
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              />
              <p className="mt-1 text-sm text-gray-500">
                Separate multiple URLs with commas
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Tags
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  {...register('tags')}
                  className="input pl-10"
                  placeholder="electronics, gadget, tech"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Separate tags with commas
              </p>
            </div>
          </div>
        </div>

        {/* Dimensions and Weight */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-6">
            <Ruler className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              Dimensions & Weight
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Weight (lbs)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Weight className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  {...register('weight')}
                  className="input pl-10"
                  placeholder="0.0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Length (in)
              </label>
              <input
                type="number"
                step="0.01"
                {...register('length')}
                className="input mt-1"
                placeholder="0.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Width (in)
              </label>
              <input
                type="number"
                step="0.01"
                {...register('width')}
                className="input mt-1"
                placeholder="0.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Height (in)
              </label>
              <input
                type="number"
                step="0.01"
                {...register('height')}
                className="input mt-1"
                placeholder="0.0"
              />
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-6">
            <Truck className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              Shipping Information
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Shipping Weight (lbs)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Weight className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  {...register('shippingWeight')}
                  className="input pl-10"
                  placeholder="0.0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Shipping Method
              </label>
              <select {...register('shippingMethod')} className="select mt-1">
                <option value="Standard">Standard</option>
                <option value="Express">Express</option>
                <option value="Overnight">Overnight</option>
                <option value="Free">Free Shipping</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Shipping Cost
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  {...register('shippingCost')}
                  className="input pl-10"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Platforms */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-6">
            <Store className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              Publishing Platforms
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('ebay')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-3 flex items-center">
                <ShoppingCart className="h-5 w-5 text-orange-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">eBay</span>
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('shopify')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-3 flex items-center">
                <Store className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  Shopify
                </span>
              </label>
            </div>

            {!watchedPlatforms[0] && !watchedPlatforms[1] && (
              <p className="text-sm text-warning-600">
                Please select at least one platform to publish to.
              </p>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/items')}
            className="btn btn-secondary btn-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              isSubmitting ||
              loading ||
              (!watchedPlatforms[0] && !watchedPlatforms[1])
            }
            className="btn btn-primary btn-lg"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Item
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
