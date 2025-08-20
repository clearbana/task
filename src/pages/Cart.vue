<!--
  Cart Page Component
  Shopping cart with items management and checkout functionality
-->
<template>
  <v-container class="cart-page pa-4">
    <!-- Header -->
    <div class="d-flex align-center mb-6">
      <v-btn icon @click="goBack" class="mr-4">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h1 class="text-h5">My Cart</h1>
      <v-spacer />
      <v-chip v-if="cartStore.totalItems > 0" color="primary" variant="outlined">
        {{ cartStore.totalItems }} items
      </v-chip>
    </div>

    <!-- Empty Cart State -->
    <div v-if="cartStore.isEmpty" class="empty-cart text-center py-12">
      <v-icon size="120" color="grey-lighten-2">mdi-cart-outline</v-icon>
      <h3 class="text-h5 mt-6 mb-3">Your cart is empty</h3>
      <p class="text-body-1 text-grey mb-6">Add some products to get started shopping</p>
      <v-btn 
        color="primary" 
        size="large"
        @click="startShopping"
        prepend-icon="mdi-shopping"
      >
        Start Shopping
      </v-btn>
    </div>

    <!-- Cart Items -->
    <div v-else class="cart-content">
      <!-- Cart Items List -->
      <div class="cart-items mb-6">
        <v-card 
          v-for="item in cartStore.items" 
          :key="item.product.id"
          class="cart-item-card mb-4"
          variant="outlined"
        >
          <v-card-text class="pa-4">
            <v-row align="center">
              <!-- Product Image -->
              <v-col cols="3" sm="2">
                <v-img
                  :src="item.product.image"
                  height="80"
                  contain
                  class="rounded cart-item-image"
                  @click="goToProduct(item.product.id)"
                />
              </v-col>
              
              <!-- Product Info -->
              <v-col cols="6" sm="7">
                <h3 class="cart-item-title mb-2" @click="goToProduct(item.product.id)">
                  {{ truncateTitle(item.product.title) }}
                </h3>
                <div class="d-flex align-center mb-2">
                  <v-avatar size="20" class="mr-2">
                    <v-img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" />
                  </v-avatar>
                  <span class="text-body-2">Khalid S.</span>
                  <v-icon color="green" size="16" class="ml-1">mdi-check-circle</v-icon>
                </div>
                <p class="cart-item-price font-weight-bold mb-0">
                  {{ formatPrice(item.product.price) }}
                </p>
              </v-col>
              
              <!-- Quantity Controls -->
              <v-col cols="3" sm="3" class="text-center">
                <v-btn 
                  icon 
                  size="small" 
                  color="error" 
                  variant="text"
                  @click="removeItem(item.product.id)"
                  class="mb-3"
                >
                  <v-icon size="18">mdi-delete</v-icon>
                </v-btn>
                
                <div class="quantity-controls d-flex align-center justify-center">
                  <v-btn 
                    icon 
                    size="small" 
                    variant="outlined"
                    @click="decreaseQuantity(item.product.id, item.quantity)"
                    :disabled="item.quantity <= 1"
                  >
                    <v-icon size="16">mdi-minus</v-icon>
                  </v-btn>
                  <span class="quantity-display mx-3 font-weight-bold">{{ item.quantity }}</span>
                  <v-btn 
                    icon 
                    size="small" 
                    variant="outlined"
                    @click="increaseQuantity(item.product.id, item.quantity)"
                  >
                    <v-icon size="16">mdi-plus</v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>

      <!-- Order Summary -->
      <v-card class="order-summary-card mb-6" variant="outlined">
        <v-card-title class="pb-2">
          <h3>Order Summary</h3>
        </v-card-title>
        <v-card-text class="pt-2">
          <div class="summary-row d-flex justify-space-between mb-2">
            <span>Subtotal ({{ cartStore.totalItems }} items)</span>
            <span>{{ formatPrice(cartStore.subtotal) }}</span>
          </div>
          <div class="summary-row d-flex justify-space-between mb-2 text-success">
            <span>Discount (10%)</span>
            <span>-{{ formatPrice(cartStore.discount) }}</span>
          </div>
          <div class="summary-row d-flex justify-space-between mb-4">
            <span>Shipping Fee</span>
            <span>{{ cartStore.shippingFee }} IQD</span>
          </div>
          <v-divider class="mb-4" />
          <div class="total-row d-flex justify-space-between text-h6 font-weight-bold">
            <span>Total <span class="text-body-2 font-weight-normal text-grey">(Tax Inclusive)</span></span>
            <span class="text-primary">{{ formatPrice(cartStore.total) }}</span>
          </div>
        </v-card-text>
      </v-card>

      <!-- Delivery Information -->
      <v-card class="delivery-info-card mb-6" variant="outlined">
        <v-card-title class="pb-2">
          <h3>Delivery Information</h3>
        </v-card-title>
        <v-card-text class="pt-2">
          <p class="text-body-2 text-grey mb-3">
            Seller will receive payment after you confirm item delivery
          </p>
          <div class="d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-map-marker</v-icon>
            <div>
              <p class="font-weight-medium mb-0">Villa No. 278 Khalifa City Park</p>
              <p class="text-body-2 text-grey mb-0">Abu Dhabi, UAE</p>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Action Buttons -->
      <div class="cart-actions">
        <v-row>
          <v-col cols="12" sm="6">
            <v-btn
              variant="outlined"
              size="large"
              block
              @click="continueShopping"
              prepend-icon="mdi-arrow-left"
            >
              Continue Shopping
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6">
            <v-btn
              color="primary"
              size="large"
              block
              @click="proceedToCheckout"
              prepend-icon="mdi-credit-card"
              :loading="checkoutLoading"
            >
              Proceed to Checkout
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </div>

    <!-- Clear Cart Dialog -->
    <v-dialog v-model="showClearDialog" max-width="400">
      <v-card>
        <v-card-title>Clear Cart</v-card-title>
        <v-card-text>
          Are you sure you want to remove all items from your cart?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="showClearDialog = false">Cancel</v-btn>
          <v-btn color="error" @click="confirmClearCart">Clear Cart</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'

export default {
  name: 'CartPage',
  setup() {
    const router = useRouter()
    const cartStore = useCartStore()

    const checkoutLoading = ref(false)
    const showClearDialog = ref(false)

    /**
     * Go back to previous page
     */
    const goBack = () => {
      router.back()
    }

    /**
     * Navigate to home page to start shopping
     */
    const startShopping = () => {
      router.push('/')
    }

    /**
     * Continue shopping (go to home)
     */
    const continueShopping = () => {
      router.push('/')
    }

    /**
     * Navigate to product detail page
     * @param {number} productId - Product ID
     */
    const goToProduct = (productId) => {
      router.push(`/product/${productId}`)
    }

    /**
     * Remove item from cart
     * @param {number} productId - Product ID to remove
     */
    const removeItem = (productId) => {
      cartStore.removeFromCart(productId)
    }

    /**
     * Increase item quantity
     * @param {number} productId - Product ID
     * @param {number} currentQuantity - Current quantity
     */
    const increaseQuantity = (productId, currentQuantity) => {
      cartStore.updateQuantity(productId, currentQuantity + 1)
    }

    /**
     * Decrease item quantity
     * @param {number} productId - Product ID
     * @param {number} currentQuantity - Current quantity
     */
    const decreaseQuantity = (productId, currentQuantity) => {
      if (currentQuantity > 1) {
        cartStore.updateQuantity(productId, currentQuantity - 1)
      }
    }

    /**
     * Proceed to checkout
     */
    const proceedToCheckout = async () => {
      checkoutLoading.value = true
      
      // Simulate checkout process
      setTimeout(() => {
        checkoutLoading.value = false
        alert('Checkout functionality would be implemented here. Redirecting to payment gateway...')
        // Here you would integrate with actual payment system
      }, 2000)
    }

    /**
     * Show clear cart confirmation dialog
     */
    const clearCart = () => {
      showClearDialog.value = true
    }

    /**
     * Confirm and clear cart
     */
    const confirmClearCart = () => {
      cartStore.clearCart()
      showClearDialog.value = false
    }

    /**
     * Truncate product title for display
     * @param {string} title - Product title
     * @returns {string} Truncated title
     */
    const truncateTitle = (title) => {
      return title.length > 30 ? title.substring(0, 30) + '...' : title
    }

    /**
     * Format price in IQD currency
     * @param {number} price - Price in USD
     * @returns {string} Formatted price
     */
    const formatPrice = (price) => {
      return `${Math.round(price * 25)} IQD`
    }

    return {
      // Store
      cartStore,
      
      // Reactive data
      checkoutLoading,
      showClearDialog,
      
      // Methods
      goBack,
      startShopping,
      continueShopping,
      goToProduct,
      removeItem,
      increaseQuantity,
      decreaseQuantity,
      proceedToCheckout,
      clearCart,
      confirmClearCart,
      truncateTitle,
      formatPrice,
    }
  },
}
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.empty-cart {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cart-item-card {
  border-radius: 12px;
  transition: all 0.2s ease;
}

.cart-item-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.cart-item-image {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.cart-item-image:hover {
  transform: scale(1.05);
}

.cart-item-title {
  cursor: pointer;
  transition: color 0.2s ease;
  font-size: 1rem;
  line-height: 1.3;
}

.cart-item-title:hover {
  color: #1976d2;
}

.cart-item-price {
  font-size: 1.1rem;
  color: #1976d2;
}

.quantity-controls {
  gap: 8px;
}

.quantity-display {
  min-width: 30px;
  text-align: center;
  font-size: 1rem;
}

.order-summary-card,
.delivery-info-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.summary-row {
  font-size: 0.95rem;
}

.total-row {
  font-size: 1.2rem;
}

.cart-actions {
  margin-bottom: 100px; /* Space for mobile bottom navigation */
}

/* Mobile responsive adjustments */
@media (max-width: 600px) {
  .cart-page {
    padding: 16px 8px;
  }
  
  .cart-item-title {
    font-size: 0.9rem;
  }
  
  .cart-item-price {
    font-size: 1rem;
  }
  
  .quantity-display {
    font-size: 0.9rem;
  }
}

/* Desktop responsive adjustments */
@media (min-width: 960px) {
  .cart-actions {
    margin-bottom: 20px;
  }
}
</style>