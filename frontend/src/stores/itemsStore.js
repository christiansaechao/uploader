import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { produce } from 'immer'

const initialState = {
  items: [],
  loading: false,
  error: null,
  selectedItems: new Set(),
  filters: {
    status: 'all',
    platform: 'all',
    search: ''
  }
}

export const useItemsStore = create(
  devtools(
    (set, get) => ({
      ...initialState,

      // Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Fetch all items
      fetchItems: async () => {
        set({ loading: true, error: null })
        try {
          const response = await fetch('/api/items')
          if (!response.ok) {
            throw new Error('Failed to fetch items')
          }
          const data = await response.json()
          set({ items: data, loading: false })
        } catch (error) {
          set({ error: error.message, loading: false })
        }
      },

      // Create item
      createItem: async (itemData) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch('/api/items', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(itemData)
          })
          if (!response.ok) {
            throw new Error('Failed to create item')
          }
          const newItem = await response.json()
          set(produce((state) => {
            state.items.push(newItem)
            state.loading = false
          }))
          return newItem
        } catch (error) {
          set({ error: error.message, loading: false })
          throw error
        }
      },

      // Update item
      updateItem: async (itemId, itemData) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch(`/api/items/${itemId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(itemData)
          })
          if (!response.ok) {
            throw new Error('Failed to update item')
          }
          const updatedItem = await response.json()
          set(produce((state) => {
            const index = state.items.findIndex(item => item.id === itemId)
            if (index !== -1) {
              state.items[index] = updatedItem
            }
            state.loading = false
          }))
          return updatedItem
        } catch (error) {
          set({ error: error.message, loading: false })
          throw error
        }
      },

      // Delete item
      deleteItem: async (itemId) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch(`/api/items/${itemId}`, {
            method: 'DELETE'
          })
          if (!response.ok) {
            throw new Error('Failed to delete item')
          }
          set(produce((state) => {
            state.items = state.items.filter(item => item.id !== itemId)
            state.selectedItems.delete(itemId)
            state.loading = false
          }))
        } catch (error) {
          set({ error: error.message, loading: false })
          throw error
        }
      },

      // Publish to platform
      publishToPlatform: async (itemId, platform) => {
        set({ loading: true, error: null })
        try {
          const item = get().items.find(item => item.id === itemId)
          if (!item) {
            throw new Error('Item not found')
          }

          const response = await fetch(`/api/platforms/${platform}/${itemId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(item)
          })
          if (!response.ok) {
            throw new Error(`Failed to publish to ${platform}`)
          }
          const result = await response.json()
          
          // Update item status
          set(produce((state) => {
            const itemIndex = state.items.findIndex(item => item.id === itemId)
            if (itemIndex !== -1) {
              state.items[itemIndex].platforms[platform] = {
                status: 'published',
                publishedAt: new Date().toISOString(),
                externalId: result.externalId
              }
            }
            state.loading = false
          }))
          
          return result
        } catch (error) {
          set({ error: error.message, loading: false })
          throw error
        }
      },

      // Bulk publish
      bulkPublish: async (itemIds, platforms) => {
        set({ loading: true, error: null })
        try {
          const items = get().items.filter(item => itemIds.includes(item.id))
          const response = await fetch('/api/platforms/bulk', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items, platforms })
          })
          if (!response.ok) {
            throw new Error('Failed to bulk publish')
          }
          const results = await response.json()
          
          // Update items status
          set(produce((state) => {
            results.forEach(result => {
              const itemIndex = state.items.findIndex(item => item.id === result.itemId)
              if (itemIndex !== -1) {
                state.items[itemIndex].platforms[result.platform] = {
                  status: 'published',
                  publishedAt: new Date().toISOString(),
                  externalId: result.externalId
                }
              }
            })
            state.loading = false
          }))
          
          return results
        } catch (error) {
          set({ error: error.message, loading: false })
          throw error
        }
      },

      // Selection management
      toggleItemSelection: (itemId) => {
        set(produce((state) => {
          if (state.selectedItems.has(itemId)) {
            state.selectedItems.delete(itemId)
          } else {
            state.selectedItems.add(itemId)
          }
        }))
      },

      selectAllItems: () => {
        set(produce((state) => {
          state.selectedItems = new Set(state.items.map(item => item.id))
        }))
      },

      clearSelection: () => {
        set({ selectedItems: new Set() })
      },

      // Filter management
      setFilter: (filterType, value) => {
        set(produce((state) => {
          state.filters[filterType] = value
        }))
      },

      clearFilters: () => {
        set({ filters: { search: '', status: 'all', platform: 'all' } })
      },

      // Computed values
      getFilteredItems: () => {
        const { items, filters } = get()
        return items.filter(item => {
          const matchesSearch = !filters.search || 
            item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            item.description.toLowerCase().includes(filters.search.toLowerCase())
          
          const matchesStatus = filters.status === 'all' || 
            Object.values(item.platforms).some(p => p.status === filters.status)
          
          const matchesPlatform = filters.platform === 'all' ||
            Object.keys(item.platforms).includes(filters.platform)
          
          return matchesSearch && matchesStatus && matchesPlatform
        })
      },

      getSelectedItems: () => {
        const { items, selectedItems } = get()
        return items.filter(item => selectedItems.has(item.id))
      },

      getStats: () => {
        const { items } = get()
        return {
          total: items.length,
          pending: items.filter(item => 
            item.status.ebay === 'pending' || item.status.shopify === 'pending'
          ).length,
          published: items.filter(item => 
            item.status.ebay === 'published' || item.status.shopify === 'published'
          ).length,
          failed: items.filter(item => 
            item.status.ebay === 'failed' || item.status.shopify === 'failed'
          ).length
        }
      }
    }),
    {
      name: 'items-store'
    }
  )
)

export default useItemsStore