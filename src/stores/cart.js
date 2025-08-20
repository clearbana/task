/**
 * Cart Store - Manages shopping cart functionality
 * Handles adding, removing, and updating cart items with calculations
 */
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  // State definition
  state: () => ({
    items: [], // Array of cart items {product, quantity}
    isDrawerOpen: false, // Desktop cart drawer state
  }),

  // Computed properties
  getters: {
    /**
     * Get total number of items in cart
     * @param {Object} state - Current state
     * @returns {number} Total quantity of all items
     */
    totalItems: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },

    /**
     * Calculate subtotal before discounts and fees
     * @param {Object} state - Current state
     * @returns {number} Subtotal amount
     */
    subtotal: (state) => {
      return state.items.reduce((total, item) => {
        return total + (item.product.price * item.quantity)
      }, 0)
    },

    /**
     * Calculate discount amount (10% of subtotal)
     * @param {Object} state - Current state
     * @returns {number} Discount amount
     */
    discount: (state) => {
      const subtotal = state.items.reduce((total, item) => {
        return total + (item.product.price * item.quantity)
      }, 0)
      return subtotal * 0.1 // 10% discount
    },

    /**
     * Get shipping fee (fixed amount)
     * @returns {number} Shipping fee amount
     */
    shippingFee: () => {
      return 41.0 // Fixed shipping fee
    },

    /**
     * Calculate final total with discount and shipping
     * @param {Object} state - Current state
     * @returns {number} Final total amount
     */
    total: (state) => {
      const subtotal = state.items.reduce((total, item) => {
        return total + (item.product.price * item.quantity)
      }, 0)
      const discount = subtotal * 0.1
      const shipping = 41.0
      return subtotal - discount + shipping
    },

    /**
     * Check if cart is empty
     * @param {Object} state - Current state
     * @returns {boolean} True if cart is empty
     */
    isEmpty: (state) => {
      return state.items.length === 0
    },

    /**
     * Get cart item by product ID
     * @param {Object} state - Current state
     * @returns {Function} Function that takes productId and returns cart item
     */
    getItemById: (state) => (productId) => {
      return state.items.find(item => item.product.id === productId)
    },
  },

  // Actions
  actions: {
    /**
     * Add product to cart or increase quantity if already exists
     * @param {Object} product - Product object to add
     */
    addToCart(product) {
      const existingItem = this.items.find(item => item.product.id === product.id)
      
      if (existingItem) {
        existingItem.quantity++
        console.log(`Increased quantity for ${product.title} to ${existingItem.quantity}`)
      } else {
        this.items.push({ 
          product: { ...product }, // Create copy to avoid mutations
          quantity: 1 
        })
        console.log(`Added ${product.title} to cart`)
      }
    },

    /**
     * Remove product completely from cart
     * @param {number} productId - ID of product to remove
     */
    removeFromCart(productId) {
      const index = this.items.findIndex(item => item.product.id === productId)
      if (index !== -1) {
        const removedItem = this.items[index]
        this.items.splice(index, 1)
        console.log(`Removed ${removedItem.product.title} from cart`)
      }
    },

    /**
     * Update quantity of specific cart item
     * @param {number} productId - ID of product to update
     * @param {number} quantity - New quantity (removes item if 0 or less)
     */
    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.product.id === productId)
      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(productId)
        } else {
          item.quantity = quantity
          console.log(`Updated quantity for ${item.product.title} to ${quantity}`)
        }
      }
    },

    /**
     * Clear all items from cart
     */
    clearCart() {
      const itemCount = this.items.length
      this.items = []
      console.log(`Cleared cart with ${itemCount} items`)
    },

    /**
     * Toggle desktop cart drawer
     */
    toggleDrawer() {
      this.isDrawerOpen = !this.isDrawerOpen
      console.log('Cart drawer toggled:', this.isDrawerOpen)
    },

    /**
     * Open desktop cart drawer
     */
    openDrawer() {
      this.isDrawerOpen = true
    },

    /**
     * Close desktop cart drawer
     */
    closeDrawer() {
      this.isDrawerOpen = false
    },

    /**
     * Get formatted price in IQD currency
     * @param {number} price - Price in USD
     * @returns {string} Formatted price in IQD
     */
    formatPrice(price) {
      const iqdPrice = Math.round(price * 25) // Convert USD to IQD (approximate rate)
      return `${iqdPrice} IQD`
    },
  },
})