/**
 * Products Store - Manages product data and filtering
 * Handles API calls to Fake Store API and provides computed properties for filtering
 */
import { defineStore } from 'pinia'
import axios from 'axios'

export const useProductStore = defineStore('products', {
  // State definition
  state: () => ({
    products: [], // All products from API
    categories: [], // Available categories
    loading: false, // Loading state for API calls
    selectedCategory: 'all', // Currently selected category filter
    searchQuery: '', // Search query for filtering products
    sortBy: 'popular', // Sort option (popular, price-low, price-high, newest)
  }),

  // Computed properties
  getters: {
    /**
     * Get filtered products based on category and search query
     * @param {Object} state - Current state
     * @returns {Array} Filtered products array
     */
    filteredProducts: (state) => {
      let filtered = [...state.products]

      // Filter by category if not 'all'
      if (state.selectedCategory !== 'all') {
        filtered = filtered.filter(product => 
          product.category.toLowerCase() === state.selectedCategory.toLowerCase()
        )
      }

      // Filter by search query
      if (state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase().trim()
        filtered = filtered.filter(product =>
          product.title.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
        )
      }

      // Sort products based on selected sort option
      switch (state.sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price)
          break
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price)
          break
        case 'newest':
          filtered.sort((a, b) => b.id - a.id)
          break
        case 'rating':
          filtered.sort((a, b) => b.rating.rate - a.rating.rate)
          break
        default: // popular
          filtered.sort((a, b) => b.rating.count - a.rating.count)
      }

      return filtered
    },

    /**
     * Get featured products for homepage slider
     * @param {Object} state - Current state
     * @returns {Array} First 5 products for featured display
     */
    featuredProducts: (state) => {
      return state.products.slice(0, 5)
    },

    /**
     * Get products count by category
     * @param {Object} state - Current state
     * @returns {Object} Object with category counts
     */
    categoryCount: (state) => {
      const counts = {}
      state.products.forEach(product => {
        counts[product.category] = (counts[product.category] || 0) + 1
      })
      return counts
    },
  },

  // Actions
  actions: {
    /**
     * Fetch all products from API
     * @returns {Promise<void>}
     */
    async fetchProducts() {
      this.loading = true
      try {
        const response = await axios.get('https://fakestoreapi.com/products')
        this.products = response.data
        console.log('Products fetched successfully:', response.data.length)
      } catch (error) {
        console.error('Error fetching products:', error)
        // Set empty array on error to prevent app crashes
        this.products = []
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch available categories from API
     * @returns {Promise<void>}
     */
    async fetchCategories() {
      try {
        const response = await axios.get('https://fakestoreapi.com/products/categories')
        this.categories = response.data
        console.log('Categories fetched successfully:', response.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
        // Set default categories on error
        this.categories = ['electronics', 'jewelery', "men's clothing", "women's clothing"]
      }
    },

    /**
     * Fetch products by specific category
     * @param {string} category - Category to filter by
     * @returns {Promise<void>}
     */
    async fetchProductsByCategory(category) {
      this.loading = true
      try {
        const response = await axios.get(`https://fakestoreapi.com/products/category/${category}`)
        this.products = response.data
        console.log(`Products for category ${category} fetched:`, response.data.length)
      } catch (error) {
        console.error('Error fetching products by category:', error)
        this.products = []
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch single product by ID
     * @param {number} id - Product ID
     * @returns {Promise<Object|null>} Product object or null if error
     */
    async fetchProductById(id) {
      try {
        const response = await axios.get(`https://fakestoreapi.com/products/${id}`)
        console.log('Product fetched by ID:', response.data)
        return response.data
      } catch (error) {
        console.error('Error fetching product by ID:', error)
        return null
      }
    },

    /**
     * Set selected category filter
     * @param {string} category - Category to set as selected
     */
    setSelectedCategory(category) {
      this.selectedCategory = category
      console.log('Selected category changed to:', category)
    },

    /**
     * Set search query for filtering
     * @param {string} query - Search query string
     */
    setSearchQuery(query) {
      this.searchQuery = query
      console.log('Search query changed to:', query)
    },

    /**
     * Set sort option
     * @param {string} sortOption - Sort option (popular, price-low, price-high, newest, rating)
     */
    setSortBy(sortOption) {
      this.sortBy = sortOption
      console.log('Sort option changed to:', sortOption)
    },

    /**
     * Clear all filters and search
     */
    clearFilters() {
      this.selectedCategory = 'all'
      this.searchQuery = ''
      this.sortBy = 'popular'
      console.log('All filters cleared')
    },
  },
})