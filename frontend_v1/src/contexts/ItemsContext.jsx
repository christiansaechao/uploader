import { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const ItemsContext = createContext();

const initialState = {
  items: [],
  loading: false,
  error: null,
  selectedItems: [],
  filters: {
    status: 'all',
    platform: 'all',
    search: '',
  },
};

const itemsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'SET_ITEMS':
      return { ...state, items: action.payload, loading: false, error: null };

    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };

    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        ),
      };

    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case 'SET_SELECTED_ITEMS':
      return { ...state, selectedItems: action.payload };

    case 'TOGGLE_ITEM_SELECTION': {
      const { itemId } = action.payload;
      const isSelected = state.selectedItems.includes(itemId);
      return {
        ...state,
        selectedItems: isSelected
          ? state.selectedItems.filter((id) => id !== itemId)
          : [...state.selectedItems, itemId],
      };
    }
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case 'CLEAR_FILTERS':
      return { ...state, filters: initialState.filters };

    default:
      return state;
  }
};

export const ItemsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(itemsReducer, initialState);

  // Fetch items on mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.get('/api/items');
      dispatch({ type: 'SET_ITEMS', payload: response.data });
    } catch (error) {
      console.error('Error fetching items:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.error || 'Failed to fetch items',
      });
    }
  };

  const createItem = async (itemData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.post('/api/items', itemData);
      dispatch({ type: 'ADD_ITEM', payload: response.data });
      return response.data;
    } catch (error) {
      console.error('Error creating item:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.error || 'Failed to create item',
      });
      throw error;
    }
  };

  const updateItem = async (itemId, itemData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.put(`/api/items/${itemId}`, itemData);
      dispatch({ type: 'UPDATE_ITEM', payload: response.data });
      return response.data;
    } catch (error) {
      console.error('Error updating item:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.error || 'Failed to update item',
      });
      throw error;
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await axios.delete(`/api/items/${itemId}`);
      dispatch({ type: 'DELETE_ITEM', payload: itemId });
    } catch (error) {
      console.error('Error deleting item:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.error || 'Failed to delete item',
      });
      throw error;
    }
  };

  const publishToPlatform = async (itemId, platform) => {
    try {
      const item = state.items.find((item) => item.id === itemId);
      if (!item) throw new Error('Item not found');

      const response = await axios.post(
        `/api/platforms/${platform}/${itemId}`,
        item,
      );

      // Update the item with new status
      const updatedItem = {
        ...item,
        ...response.data.item,
      };

      dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });
      return response.data;
    } catch (error) {
      console.error(`Error publishing to ${platform}:`, error);
      dispatch({
        type: 'SET_ERROR',
        payload:
          error.response?.data?.error || `Failed to publish to ${platform}`,
      });
      throw error;
    }
  };

  const bulkPublish = async (itemIds, platforms) => {
    try {
      const items = state.items.filter((item) => itemIds.includes(item.id));
      const response = await axios.post('/api/platforms/bulk', {
        items,
        platforms,
      });

      // Update items with new statuses
      response.data.results.forEach((result) => {
        const item = state.items.find((item) => item.id === result.itemId);
        if (item) {
          const updatedItem = { ...item };

          if (result.platforms.ebay && !result.platforms.ebay.error) {
            updatedItem.ebayListingId = result.platforms.ebay.listingId;
            updatedItem.ebayUrl = result.platforms.ebay.url;
            updatedItem.status.ebay = 'published';
            updatedItem.status.ebayMessage = result.platforms.ebay.message;
          } else if (result.platforms.ebay?.error) {
            updatedItem.status.ebay = 'failed';
            updatedItem.status.ebayMessage = result.platforms.ebay.error;
          }

          if (result.platforms.shopify && !result.platforms.shopify.error) {
            updatedItem.shopifyProductId = result.platforms.shopify.productId;
            updatedItem.shopifyUrl = result.platforms.shopify.url;
            updatedItem.status.shopify = 'published';
            updatedItem.status.shopifyMessage =
              result.platforms.shopify.message;
          } else if (result.platforms.shopify?.error) {
            updatedItem.status.shopify = 'failed';
            updatedItem.status.shopifyMessage = result.platforms.shopify.error;
          }

          dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error bulk publishing:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.error || 'Failed to bulk publish items',
      });
      throw error;
    }
  };

  const toggleItemSelection = (itemId) => {
    dispatch({ type: 'TOGGLE_ITEM_SELECTION', payload: { itemId } });
  };

  const setSelectedItems = (itemIds) => {
    dispatch({ type: 'SET_SELECTED_ITEMS', payload: itemIds });
  };

  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  // Filter items based on current filters
  const filteredItems = state.items.filter((item) => {
    const matchesStatus =
      state.filters.status === 'all' ||
      item.status.ebay === state.filters.status ||
      item.status.shopify === state.filters.status;

    const matchesPlatform =
      state.filters.platform === 'all' ||
      (state.filters.platform === 'ebay' && item.platforms?.ebay) ||
      (state.filters.platform === 'shopify' && item.platforms?.shopify);

    const matchesSearch =
      !state.filters.search ||
      item.title.toLowerCase().includes(state.filters.search.toLowerCase()) ||
      item.description
        .toLowerCase()
        .includes(state.filters.search.toLowerCase());

    return matchesStatus && matchesPlatform && matchesSearch;
  });

  const value = {
    ...state,
    filteredItems,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    publishToPlatform,
    bulkPublish,
    toggleItemSelection,
    setSelectedItems,
    setFilters,
    clearFilters,
    clearError,
  };

  return (
    <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>
  );
};

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
};
