<!--
  Product Card Component
  Reusable card component for displaying products with responsive design
-->
<template>
  <v-card 
    class="product-card" 
    @click="goToProduct"
    :class="{ 'desktop-card': isDesktop }"
  >
    <div class="position-relative">
      <v-img
        :src="product.image"
        :height="isDesktop ? 200 : 160"
        contain
        class="bg-white product-image"
      />
      
      <!-- Favorite Button -->
      <v-btn
        icon
        size="small"
        class="favorite-btn"
        :color="isFavorited ? 'error' : 'default'"
        @click.stop="toggleFavorite"
      >
        <v-icon size="16">{{ isFavorited ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
      </v-btn>
      
      <!-- Brand Chip -->
      <v-chip
        size="small"
        class="brand-chip"
        color="white"
      >
        {{ getBrandName(product.category) }}
      </v-chip>

      <!-- Desktop specific badges -->
    <div v-if="isDesktop" class="desktop-badges flex">
  <div>
    <v-chip size="small" color="primary" class="new-badge">New</v-chip>
  </div>
  <div>
    <v-chip size="small" color="warning" class="express-badge">
      <v-icon size="16" class="mr-1">mdi-truck-fast</v-icon>
    </v-chip>
  </div>
</div>
    </div>

    <v-card-text class="pa-2">
      <h3 class="product-title  mb-2">{{ product.title }}</h3>
      

      <!-- Price and Details -->
      <div class="d-flex justify-space-between align-center mb-2">
        <p class="price-text font-weight-bold mb-0">
          IQD {{ Math.round(product.price * 25) }}
        </p>
        <span v-if="!isDesktop" class="text-body-2">Size M</span>
        <span v-else class="text-body-2">Size M L XL</span>
      </div> 


      <!-- Desktop specific info -->
      <div v-if="isDesktop" class="desktop-info pa-2 ">
        <div class="d-flex align-center justify-space-between">
        
          <div class="auction-info">
              <v-avatar size="20" class="mr-2">
              <v-img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" />
              </v-avatar>
              <span class="text-body-2">Khalid S.</span>
                  <v-icon v-if="isDesktop" color="green" size="16" class="ml-1">mdi-check-circle</v-icon>
          </div>
          <div class="d-flex align-center">
            <v-icon color="orange" size="16" class="mr-1">mdi-star</v-icon>
            <span class="text-body-2">{{ product.rating.rate }} ({{ product.rating.count }})</span>
          </div>
        </div>
      </div>



    </v-card-text>
  </v-card>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFavoritesStore } from '../stores/favorites.js'

export default {
  name: 'ProductCard',
  props: {
    /**
     * Product object to display
     */
    product: {
      type: Object,
      required: true,
    },
    /**
     * Whether this is desktop view
     */
    isDesktop: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const router = useRouter()
    const favoritesStore = useFavoritesStore()

    // Check if product is favorited
    const isFavorited = computed(() => favoritesStore.isFavorite(props.product.id))

    /**
     * Toggle favorite status
     */
    const toggleFavorite = () => {
      favoritesStore.toggleFavorite(props.product)
    }

    /**
     * Navigate to product detail page
     */
    const goToProduct = () => {
      router.push(`/product/${props.product.id}`)
    }

    /**
     * Get brand name based on category
     * @param {string} category - Product category
     * @returns {string} Brand name
     */
    const getBrandName = (category) => {
      const brands = {
        electronics: 'Zara',
        jewelery: 'Pandora',
        "men's clothing": 'H&M',
        "women's clothing": 'Zara',
      }
      return brands[category] || 'Zara'
    }

    return {
      isFavorited,
      toggleFavorite,
      goToProduct,
      getBrandName,
    }
  },
}
</script>

<style scoped>
.product-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 15px;
  overflow: hidden;
  height: 100%;
   background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.product-card:hover {
  transform: translateY(1px);
  box-shadow: 0 ;
}

.desktop-card {
  border-radius: 16px;
}

.desktop-card:hover {
  transform: translateY(-6px);
  box-shadow: 0;
}

.product-image {
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.favorite-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(255, 255, 255, 0.9) !important;
  z-index: 2;
}

.brand-chip {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
}

.desktop-badges {
  position: absolute;
  display: flex;
  top: 8px;
  left: 8px;
  gap: 4px;
  z-index: 2;
  gap: 8px; /* space between badges */
  align-items: center; 
}

.new-badge {
  background-color: #ffffff !important;
  color: black !important;
}

.express-badge {
  background-color: #ffffff !important;
  color: rgb(189, 199, 51) !important;
}

.product-title {
  display: -webkit-box;
  /* -webkit-line-clamp: 2; */
  -webkit-box-orient: vertical;
  box-shadow: none;
  overflow: hidden;
  height: 2.5rem;
  font-size: 0.9rem;
  line-height: 1.25;
  
}

.desktop-card .product-title {
  font-size: 0.88rem;
  height: 3rem;
  /* -webkit-line-clamp: 3; */
  
}

.price-text {
  font-size: 1.1rem;
}

.desktop-card .price-text {
  font-size: 1.25rem;
  
}

.desktop-info {
  background-color: #e1e6e7;
  border-radius: 9px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e0e0e0;
  
}

.auction-info {
  display: flex;
  align-items: center;
  color: #1d0a0a;
}

/* Mobile specific adjustments */
@media (max-width: 600px) {
  .product-card {
    border-radius: 8px;
  }
  
  .product-title {
    font-size: 0.55rem;
    height: 2.2rem;
  }
  
  .price-text {
    font-size: 1rem;
  }
}
</style>