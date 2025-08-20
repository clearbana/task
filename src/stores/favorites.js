/**
 * Favorites Store - Manages user's favorite products
 * Handles adding/removing favorites with persistence
 */
import { defineStore } from 'pinia'

export const useFavoritesStore = defineStore('favorites', {
  // State definition
  state: () => ({
    favorites: [], // Array of favorite products
  }),

  // Computed properties
  getters: {
    /**
     * Check if a product is in favorites
     * @param {Object} state - Current state
     * @returns {Function} Function that takes productId and returns boolean
     */
    isFavorite: (state) => (productId) => {
      return state.favorites.some(product => product.id === productId)
    },

    /**
     * Get total number of favorite products
     * @param {Object} state - Current state
     * @returns {number} Total favorites count
     */
    favoritesCount: (state) => {
      return state.favorites.length
    },

    /**
     * Get favorites by category
     * @param {Object} state - Current state
     * @returns {Function} Function that takes category and returns filtered favorites
     */
    getFavoritesByCategory: (state) => (category) => {
      if (category === 'all') return state.favorites
      return state.favorites.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      )
    },
  },

  // Actions
  actions: {
    /**
     * Toggle product in favorites (add if not present, remove if present)
     * @param {Object} product - Product object to toggle
     */
    toggleFavorite(product) {
      const index = this.favorites.findIndex(fav => fav.id === product.id)
      
      if (index !== -1) {
        // Remove from favorites
        this.favorites.splice(index, 1)
        console.log(`Removed ${product.title} from favorites`)
      } else {
        // Add to favorites (create copy to avoid mutations)
        this.favorites.push({ ...product })
        console.log(`Added ${product.title} to favorites`)
      }
      
      // Save to localStorage for persistence
      this.saveFavorites()
    },

    /**
     * Add product to favorites if not already present
     * @param {Object} product - Product object to add
     */
    addToFavorites(product) {
      if (!this.isFavorite(product.id)) {
        this.favorites.push({ ...product })
        console.log(`Added ${product.title} to favorites`)
        this.saveFavorites()
      }
    },

    /**
     * Remove product from favorites
     * @param {number} productId - ID of product to remove
     */
    removeFromFavorites(productId) {
      const index = this.favorites.findIndex(fav => fav.id === productId)
      if (index !== -1) {
        const removedProduct = this.favorites[index]
        this.favorites.splice(index, 1)
        console.log(`Removed ${removedProduct.title} from favorites`)
        this.saveFavorites()
      }
    },

    /**
     * Clear all favorites
     */
    clearFavorites() {
      const count = this.favorites.length
      this.favorites = []
      console.log(`Cleared ${count} favorites`)
      this.saveFavorites()
    },

    /**
     * Save favorites to localStorage for persistence
     */
    saveFavorites() {
      try {
        localStorage.setItem('favorites', JSON.stringify(this.favorites))
      } catch (error) {
        console.error('Error saving favorites to localStorage:', error)
      }
    },

    /**
     * Load favorites from localStorage
     */
    loadFavorites() {
      try {
        const saved = localStorage.getItem('favorites')
        if (saved) {
          this.favorites = JSON.parse(saved)
          console.log(`Loaded ${this.favorites.length} favorites from localStorage`)
        }
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error)
        this.favorites = []
      }
    },

    /**
     * Initialize favorites store (call on app startup)
     */
    initialize() {
      this.loadFavorites()
    },
  },
})