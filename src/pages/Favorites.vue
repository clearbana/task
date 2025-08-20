<!--
  Favorites Page Component
  Displays user's favorite products with management options
-->
<template>
  <v-container class="favorites-page pa-4">
   <div class="d-flex align-center justify-space-between w-100">
  <!-- Left -->
  <div v-if="isMobile" class="favorites-back-btn">
    <v-btn icon class="back-btn" @click="goBack">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
  </div>

  <!-- Center -->
  <div class="text-center flex-grow-1">
    <h2>Liked</h2>
  </div>

</div>

    <!-- Empty Favorites State -->
    <div v-if="favoritesStore.favoritesCount === 0" class="empty-favorites text-center py-12">
      <v-icon size="120" color="grey-lighten-2">mdi-heart-outline</v-icon>
      <h3 class="text-h5 mt-6 mb-3">No favorites yet</h3>
      <p class="text-body-1 text-grey mb-6">Heart your favorite products to see them here</p>
      <v-btn 
        color="primary" 
        size="large"
        @click="browsProducts"
        prepend-icon="mdi-heart"
      >
        Browse Products
      </v-btn>
    </div>

    <!-- Favorites Grid -->
    <div v-else class="favorites-content">
      <v-row>
        <v-col
          v-for="product in filteredFavorites"
          :key="product.id"
          :cols="isMobile ? 6 : 3"
          :sm="isMobile ? 6 : 4"
          :md="isMobile ? 4 : 3"
          :lg="isMobile ? 3 : 3"
        >
          <ProductCard :product="product" :is-desktop="!isMobile" />
        </v-col>
      </v-row>

      <!-- No results for filter -->
      <div v-if="filteredFavorites.length === 0" class="no-results text-center py-8">
        <v-icon size="80" color="grey-lighten-2">mdi-filter-remove</v-icon>
        <h4 class="text-h6 mt-4 mb-2">No favorites in this category</h4>
        <p class="text-body-2 text-grey">Try selecting a different category</p>
      </div>

      
    </div>


    <!-- Clear Favorites Dialog -->
    <v-dialog v-model="showClearDialog" max-width="400">
      <v-card>
        <v-card-title>Clear All Favorites</v-card-title>
        <v-card-text>
          Are you sure you want to remove all {{ favoritesStore.favoritesCount }} items from your favorites?
          This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="showClearDialog = false">Cancel</v-btn>
          <v-btn color="error" @click="confirmClearFavorites">Clear All</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    
    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSuccessMessage"
      color="success"
      timeout="3000"
    >
      {{ successMessage }}
      <template v-slot:actions>
        <v-btn variant="text" @click="showSuccessMessage = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useFavoritesStore } from '../stores/favorites.js'
import { useCartStore } from '../stores/cart'
import ProductCard from '../components/ProductCard.vue'

export default {
  name: 'FavoritesPage',
  components: {
    ProductCard,
  },
  setup() {
    const router = useRouter()
    const { mobile } = useDisplay()
    const favoritesStore = useFavoritesStore()
    const cartStore = useCartStore()

    const selectedFilter = ref('all')
    const showClearDialog = ref(false)
    const showSuccessMessage = ref(false)
    const successMessage = ref('')

    // Responsive detection
    const isMobile = computed(() => mobile.value)

    // Get available categories from favorites
    const availableCategories = computed(() => {
      const categories = {}
      
      favoritesStore.favorites.forEach(product => {
        const category = product.category
        if (!categories[category]) {
          categories[category] = {
            value: category,
            label: category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' & '),
            count: 0
          }
        }
        categories[category].count++
      })
      
      return Object.values(categories)
    })

    // Filter favorites based on selected category
    const filteredFavorites = computed(() => {
      if (selectedFilter.value === 'all') {
        return favoritesStore.favorites
      }
      return favoritesStore.getFavoritesByCategory(selectedFilter.value)
    })

    /**
     * Go back to previous page
     */
    const goBack = () => {
      router.back()
    }

    /**
     * Navigate to home page to browse products
     */
    const browsProducts = () => {
      router.push('/')
    }

    /**
     * Add all filtered favorites to cart
     */
    const addAllToCart = () => {
      let addedCount = 0
      
      filteredFavorites.value.forEach(product => {
        cartStore.addToCart(product)
        addedCount++
      })
      
      if (addedCount > 0) {
        successMessage.value = `Added ${addedCount} items to cart`
        showSuccessMessage.value = true
        
        // Open cart drawer on desktop
        if (!isMobile.value) {
          cartStore.openDrawer()
        }
      }
    }

    /**
     * Show clear favorites confirmation dialog
     */
    const clearAllFavorites = () => {
      showClearDialog.value = true
    }

    /**
     * Confirm and clear all favorites
     */
    const confirmClearFavorites = () => {
      const count = favoritesStore.favoritesCount
      favoritesStore.clearFavorites()
      showClearDialog.value = false
      
      successMessage.value = `Removed ${count} items from favorites`
      showSuccessMessage.value = true
    }

    // Initialize favorites on component mount
    onMounted(() => {
      favoritesStore.initialize()
    })

    return {
      // Stores
      favoritesStore,
      cartStore,
      
      // Reactive data
      selectedFilter,
      showClearDialog,
      showSuccessMessage,
      successMessage,
      
      // Computed
      isMobile,
      availableCategories,
      filteredFavorites,
      
      // Methods
      goBack,
      browsProducts,
      addAllToCart,
      clearAllFavorites,
      confirmClearFavorites,
    }
  },
}
</script>

<style scoped>
.favorites-page {
  min-height: 100vh;
  background-color: #ffffff;
}

.favorites-back-btn {
  margin-bottom: 12px;
}
.back-btn {
  background: #f5f5f5 !important;
  border-radius: 12px !important;
  min-width: 44px !important;
  min-height: 44px !important;
  box-shadow: none !important;
} 

.empty-favorites {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.no-results {
  min-height: 40vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.bulk-actions {
  margin-bottom: 100px; /* Space for mobile bottom navigation */
}

.floating-add-btn {
  margin-bottom: 80px; /* Above bottom navigation */
  box-shadow: 0 4px 12px rgba(38, 166, 154, 0.4);
}

.floating-add-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(38, 166, 154, 0.5);
}

/* Mobile responsive adjustments */
@media (max-width: 600px) {
  .favorites-page {
    padding: 16px 8px;
  }
  
  .bulk-actions .d-flex {
    flex-direction: column;
    gap: 12px;
  }
  
  .bulk-actions .d-flex > div:last-child {
    display: flex;
    gap: 8px;
  }
}

/* Desktop responsive adjustments */
@media (min-width: 960px) {
  .bulk-actions {
    margin-bottom: 20px;
  }
}

/* Animation for favorites grid */
.favorites-content .v-col {
  animation: fadeInUp 0.3s ease forwards;
}

.favorites-content .v-col:nth-child(1) { animation-delay: 0.1s; }
.favorites-content .v-col:nth-child(2) { animation-delay: 0.2s; }
.favorites-content .v-col:nth-child(3) { animation-delay: 0.3s; }
.favorites-content .v-col:nth-child(4) { animation-delay: 0.4s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>