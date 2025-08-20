<!--
  Desktop Cart Drawer Component
  Side drawer for cart functionality on desktop
-->
<template>
  <v-navigation-drawer
    v-model="cartStore.isDrawerOpen"
    location="right"
    temporary
    width="400"
    class="cart-drawer"
  >
    <!-- Header -->
    <div class="d-flex align-center justify-space-between pa-4 ">
      <h2 class="text-h6">My Cart</h2>
      <v-btn 
        icon 
        variant="text" 
        @click="cartStore.closeDrawer()"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <!-- Cart Content -->
    <div class="cart-content" >
      <!-- Empty Cart State -->
      <div v-if="cartStore.isEmpty" class="empty-cart pa-6 text-center "  >
        <v-icon size="80" color="grey-lighten-2">mdi-cart-outline</v-icon>
        <h3 class="text-h6 mt-4 mb-2">Your cart is empty</h3>
        <p class="text-body-2 text-grey mb-4">Add some products to get started</p>
        <v-btn 
          color="primary" 
          @click="goToHome"
        >
          Start Shopping
        </v-btn>
      </div>

      <!-- Cart Items -->
      <div v-else class="cart-items" >
        <div class="pa-4">
          <div 
            v-for="item in cartStore.items" 
            :key="item.product.id"
            class="cart-item mb-4"
          >
            <v-card  flat elevation="0" class="cart-item-card pa-3">
              <div class="d-flex align-center">
                <!-- Product Image -->
                <div class="item-image mr-3">
                  <v-img
                    :src="item.product.image"
                    width="60"
                    height="60"
                    contain
                    class="rounded"
                  />
                </div>

                <!-- Product Info -->
                <div class="flex-grow-1">
                  <h4 class="text-subtitle-2 mb-1">
                    {{ truncateTitle(item.product.title) }}
                  </h4>
                  <div class="d-flex align-center mb-2">
                    <v-avatar size="16" class="mr-1">
                      <v-img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" />
                    </v-avatar>
                    <span class="text-caption">Khalid S.</span>
                  </div>
                  <p class="text-h6 font-weight-bold mb-0">
                    {{ formatPrice(item.product.price) }}
                  </p>
                </div>

                <!-- Actions -->
                <div class="item-actions">
                  <v-btn 
                    size="small" 
                    color="error" 
                    variant="text"
                    @click="cartStore.removeFromCart(item.product.id)"
                    class="mb-2"
                  >
                    <v-icon size="16">mdi-delete</v-icon>
                  </v-btn>
                  
                  <div class="d-flex align-center">
                    <v-btn 
                       
                      size="small" 
                      @click="cartStore.updateQuantity(item.product.id, item.quantity - 1)"
                    >
                      <v-icon size="16">mdi-minus</v-icon>
                    </v-btn>
                    <span class="mx-2 font-weight-medium">{{ item.quantity }}</span>
                    <v-btn 
                       
                      size="small" 
                      
                      @click="cartStore.updateQuantity(item.product.id, item.quantity + 1)"
                    >
                      <v-icon size="16">mdi-plus</v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
              <br>
              <v-divider v-if="index !== cartStore.items.length - 1" />
            </v-card>
          </div>
        </div>

       
        <!-- Cart Summary -->
        <div class="cart-summary pa-4">

          <v-card color="gray" flat elevation="0" border="0" rounded="lg" 
          class="pa-4 cart-card">
          <div>
            <p class="text-body-2 text-grey ">
              Seller will receive his payment after you assign item as delivered
            </p>
          </div>
          </v-card>
          <br>

          <div class ="background-grey pa-4">
          <div class="summary-details mb-4">
            <div class="d-flex justify-space-between mb-2">
              <span>Subtotal</span>
              <span>{{ formatPrice(cartStore.subtotal) }}</span>
            </div>
            <div class="d-flex justify-space-between mb-2 ">
              <span>Discount</span>
              <span>{{ formatPrice(cartStore.discount) }}</span>
            </div>
            <div class="d-flex justify-space-between mb-3">
              <span>Shipping Fee</span>
              <span>{{ cartStore.shippingFee }} IQD</span>
            </div>
            <v-divider class="mb-3" />
            <div class="d-flex justify-space-between text-h6 font-weight-bold">
              <span>Total <span class="text-body-2 font-weight-normal text-grey">
                Tax Inclusive</span></span>

              <span>{{ formatPrice(cartStore.total) }}</span>
            </div>
          </div>
          </div>


          <!-- Checkout Button -->
        <div class="d-flex justify-space-between align-center mt-4">
        <v-btn 
        icon 
        variant="text" 
        @click="cartStore.closeDrawer()"
      >
        close
      </v-btn>
          <v-btn
            color="primary"
            size="large"
            
            @click="checkout"
            rounded="lg">
            Proceed to Checkout
          </v-btn>
          </div>


        </div>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'

export default {
  name: 'CartDrawer',
  setup() {
    const router = useRouter()
    const cartStore = useCartStore()

    /**
     * Navigate to home page
     */
    const goToHome = () => {
      router.push('/')
      cartStore.closeDrawer()
    }

    /**
     * Handle checkout process
     */
    const checkout = () => {
      alert('Proceeding to checkout...')
      // Here you would implement actual checkout logic
    }

    /**
     * Truncate product title for display
     * @param {string} title - Product title
     * @returns {string} Truncated title
     */
    const truncateTitle = (title) => {
      return title.length > 25 ? title.substring(0, 25) + '...' : title
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
      cartStore,
      goToHome,
      checkout,
      truncateTitle,
      formatPrice,
    }
  },
}
</script>

<style scoped>

.cart-drawer {
  z-index: 2000;
}

.border-b {
  border-bottom: 1px solid #e0e0e0;
}

.border-t {
  border-top: 1px solid #e0e0e0;
}

.cart-content {
  height: calc(100vh - 80px);
  overflow-y: auto;
}

.cart-items {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.cart-summary {
  margin-top: auto;
  background: white;
}

.item-image {
  flex-shrink: 0;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cart-card {
  background-color: #e4dcd1; /* light beige */
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.background-grey {
  background-color: #f5f5f5; 
  /* border-radius: 8px;        */
}
</style>