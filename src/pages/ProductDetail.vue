<!--
  Product Detail Page Component
  Displays detailed product information with responsive design
-->
<template>
  <div v-if="product" class="product-detail">
    <!-- Header -->
    <div class="detail-header d-flex align-center justify-space-between pa-4 bg-white">
      <v-btn icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <div class="d-flex">
        <v-btn icon class="mr-2">
          <v-icon>mdi-share-variant</v-icon>
        </v-btn>
        <v-btn 
          icon 
          @click="toggleFavorite"
          :color="isFavorited ? 'error' : 'default'"
        >
          <v-icon>{{ isFavorited ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Product Image Section -->
    <v-container class="image-section pa-0">
      <v-img
        :src="product.image"
        :height="isMobile ? 300 : 400"
        contain
        class="bg-white"
      />
      
      <!-- Image Dots Indicator -->
      <div class="text-center py-2">
        <span v-for="i in 5" :key="i" class="dot" :class="{ active: i === 1 }"></span>
      </div>
    </v-container>

    <!-- Product Information -->
    <v-container class="product-info bg-white rounded-t-xl mt-n4" style="position: relative; z-index: 1;">
      <div class="pt-6">
        <h1 class="product-title mb-2">{{ product.title }}</h1>
        <h2 class="product-price font-weight-bold mb-4">{{ formatPrice(product.price) }}</h2>
        
        <!-- Storage/Size Options -->
        <div class="mb-4">
          <h4 class="text-subtitle-1 mb-2">Available Options:</h4>
          <v-chip-group v-model="selectedOption" mandatory>
            <v-chip value="1TB" variant="outlined">1 TB</v-chip>
            <v-chip value="256MB" variant="outlined">256 MB</v-chip>
            <v-chip value="512MB" variant="outlined">512 MB</v-chip>
          </v-chip-group>
        </div>

        <!-- Seller Information -->
        <v-card variant="outlined" class="seller-card mb-4">
          <v-card-text class="pa-4">
            <div class="d-flex align-center">
              <v-avatar size="50" class="mr-3">
                <v-img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" />
              </v-avatar>
              <div class="flex-grow-1">
                <p class="font-weight-medium mb-1">Khalid S.</p>
                <div class="d-flex align-center">
                  <v-icon color="orange" size="16" class="mr-1">mdi-star</v-icon>
                  <span class="text-body-2">{{ product.rating.rate }} | {{ product.rating.count }} Reviews</span>
                </div>
              </div>
              <v-icon color="green" size="24">mdi-check-circle</v-icon>
            </div>
          </v-card-text>
        </v-card>

        <!-- Product Description -->
        <div class="description-section mb-6">
          <h3 class="text-h6 mb-3">Description</h3>
          <p class="text-body-1 description-text">
            {{ product.description }}
          </p>
        </div>

        <!-- Product Specifications -->
        <div class="specifications-section mb-6">
          <h3 class="text-h6 mb-3">Specifications</h3>
          <v-card variant="outlined">
            <v-card-text>
              <v-row>
                <v-col cols="6">
                  <p class="text-body-2 mb-1"><strong>Category:</strong></p>
                  <p class="text-capitalize">{{ product.category }}</p>
                </v-col>
                <v-col cols="6">
                  <p class="text-body-2 mb-1"><strong>Rating:</strong></p>
                  <p>{{ product.rating.rate }}/5 ({{ product.rating.count }} reviews)</p>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>

        <!-- Delivery Options -->
        <div class="delivery-section mb-6">
          <h3 class="text-h6 mb-3">Delivery Options</h3>
          <v-card variant="outlined" class="delivery-card">
            <v-card-text class="pa-3">
              <div class="d-flex align-center">
                <v-icon color="primary" class="mr-3">mdi-map-marker</v-icon>
                <div class="flex-grow-1">
                  <p class="font-weight-medium mb-1">Villa No. 278 Khalifa City Park</p>
                  <p class="text-body-2 text-grey mb-0">Abu Dhabi</p>
                </div>
                <v-btn icon size="small">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <!-- Comments Section -->
        <div class="comments-section mb-6">
          <h3 class="text-h6 mb-3">Comments</h3>
          
          <!-- Add Comment Input -->
          <div class="add-comment mb-4">
            <v-text-field
              v-model="newComment"
              label="Add a Comment"
              variant="outlined"
              placeholder="Share your thoughts..."
              append-inner-icon="mdi-emoticon-outline"
              hide-details
              class="mb-2"
            />
            <div class="d-flex justify-end">
              <v-btn
                color="primary"
                variant="outlined"
                size="small"
                @click="addComment"
                :disabled="!newComment.trim()"
              >
                Post Comment
              </v-btn>
            </div>
          </div>

          <!-- Comments List -->
          <div class="comments-list">
            <div 
              v-for="comment in comments" 
              :key="comment.id" 
              class="comment-item mb-4"
            >
              <div class="d-flex">
                <v-avatar size="40" class="mr-3">
                  <v-img :src="comment.avatar" />
                </v-avatar>
                <div class="flex-grow-1">
                  <div class="d-flex align-center mb-1">
                    <span class="font-weight-medium">{{ comment.name }}</span>
                    <span class="text-caption text-grey ml-2">{{ comment.timeAgo }}</span>
                  </div>
                  <p class="text-body-2 mb-2">{{ comment.text }}</p>
                  <div class="d-flex align-center">
                    <v-btn
                      icon
                      size="small"
                      variant="text"
                      @click="likeComment(comment.id)"
                      :color="comment.isLiked ? 'primary' : 'default'"
                    >
                      <v-icon size="16">mdi-thumb-up</v-icon>
                    </v-btn>
                    <span class="text-caption ml-1">{{ comment.likes }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

                                     <!-- Show More Comments Button -->
         <div class="text-center">
           <v-btn
             variant="outlined"
             color="grey"
             @click="showMoreComments"
             v-if="comments.length > 2"
           >
             Show More Comments
           </v-btn>
         </div>

         <!-- Action Buttons Section -->
         <div class="action-buttons-section mb-6">
           <v-row>
             <v-col cols="6">
               <v-btn
                 size="large"
                 block
                 @click="addToCart"
                 class="add-to-cart-btn"
                 elevation="2"
               >
                 Add to Cart
               </v-btn>
             </v-col>
             <v-col cols="6">
               <v-btn
                 size="large"
                 block
                 @click="buyNow"
                 class="buy-now-btn"
                 elevation="2"
               >
                 Buy Now
               </v-btn>
             </v-col>
           </v-row>
         </div>

       </div>

      <!-- Similar Products -->
        <div v-if="!isMobile" class="similar-products mb-6">
          <h3 class="text-h6 mb-3">Similar Products</h3>
          <v-row>
            <v-col 
              v-for="similarProduct in similarProducts" 
              :key="similarProduct.id"
              cols="6"
              md="3"
            >
              <ProductCard :product="similarProduct" :is-desktop="!isMobile" />
            </v-col>
          </v-row>
        </div>
      </div>
    </v-container>


  </div>

  <!-- Loading State -->
  <div v-else class="loading-container text-center pa-8">
    <v-progress-circular indeterminate color="primary" size="64" />
    <p class="mt-4">Loading product details...</p>
  </div>

  <!-- Success Snackbar -->
  <v-snackbar
    v-model="showSuccessMessage"
    color="success"
    timeout="3000"
  >
    Product added to cart successfully!
    <template v-slot:actions>
      <v-btn variant="text" @click="showSuccessMessage = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useProductStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import { useFavoritesStore } from '../stores/favorites.js'
import ProductCard from '../components/ProductCard.vue'

export default {
  name: 'ProductDetailPage',
  components: {
    ProductCard,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { mobile } = useDisplay()
    const productStore = useProductStore()
    const cartStore = useCartStore()
    const favoritesStore = useFavoritesStore()

    const product = ref(null)
    const loading = ref(false)
    const selectedOption = ref('1TB')
    const showSuccessMessage = ref(false)
    const newComment = ref('')
    const comments = ref([
      {
        id: 1,
        name: 'Ahmed Khalid',
        timeAgo: '1 month ago',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        likes: 942,
        isLiked: false
      },
      {
        id: 2,
        name: 'Ahmed Khalid',
        timeAgo: '1 month ago',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        likes: 942,
        isLiked: false
      }
    ])

    // Responsive detection
    const isMobile = computed(() => mobile.value)

    // Check if product is favorited
    const isFavorited = computed(() => {
      if (!product.value) return false
      return favoritesStore.isFavorite(product.value.id)
    })

    // Get similar products (same category, different products)
    const similarProducts = computed(() => {
      if (!product.value) return []
      return productStore.products
        .filter(p => p.category === product.value.category && p.id !== product.value.id)
        .slice(0, 4)
    })

    /**
     * Go back to previous page
     */
    const goBack = () => {
      router.back()
    }

    /**
     * Toggle favorite status
     */
    const toggleFavorite = () => {
      if (product.value) {
        favoritesStore.toggleFavorite(product.value)
      }
    }

    /**
     * Add product to cart
     */
    const addToCart = () => {
      if (product.value) {
        cartStore.addToCart(product.value)
        showSuccessMessage.value = true
        
        // Open cart drawer on desktop
        if (!isMobile.value) {
          cartStore.openDrawer()
        }
      }
    }

    /**
     * Handle buy now action
     */
    const buyNow = () => {
      if (product.value) {
        cartStore.addToCart(product.value)
        router.push('/cart')
      }
    }

    /**
     * Contact seller action
     */
    const contactSeller = () => {
      alert('Contact seller feature - This would open a messaging interface')
    }

    /**
     * Add a new comment
     */
    const addComment = () => {
      if (newComment.value.trim()) {
        const comment = {
          id: Date.now(),
          name: 'You',
          timeAgo: 'Just now',
          text: newComment.value,
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
          likes: 0,
          isLiked: false
        }
        comments.value.unshift(comment)
        newComment.value = ''
      }
    }

    /**
     * Like/unlike a comment
     */
    const likeComment = (commentId) => {
      const comment = comments.value.find(c => c.id === commentId)
      if (comment) {
        comment.isLiked = !comment.isLiked
        comment.likes += comment.isLiked ? 1 : -1
      }
    }

    /**
     * Show more comments
     */
    const showMoreComments = () => {
      // This would typically load more comments from an API
      alert('Loading more comments...')
    }

    /**
     * Add product to cart page
     */
    const addToCartPage = () => {
      if (product.value) {
        cartStore.addToCart(product.value)
        showSuccessMessage.value = true
        
        // Navigate to cart page
        router.push('/cart')
      }
    }

    /**
     * Format price in IQD currency
     * @param {number} price - Price in USD
     * @returns {string} Formatted price
     */
    const formatPrice = (price) => {
      return `${Math.round(price * 25)} IQD`
    }

    // Load product data on component mount
    onMounted(async () => {
      const productId = parseInt(route.params.id)
      loading.value = true
      
      try {
        product.value = await productStore.fetchProductById(productId)
        
        // Load all products if not already loaded (for similar products)
        if (productStore.products.length === 0) {
          await productStore.fetchProducts()
        }
      } catch (error) {
        console.error('Error loading product:', error)
        // Handle error - maybe redirect to 404 page
      } finally {
        loading.value = false
      }
    })

    return {
      // Reactive data
      product,
      loading,
      selectedOption,
      showSuccessMessage,
      newComment,
      comments,
      
      // Computed
      isMobile,
      isFavorited,
      similarProducts,
      
      // Methods
      goBack,
      toggleFavorite,
      addToCart,
      buyNow,
      contactSeller,
      addComment,
      likeComment,
      showMoreComments,
      addToCartPage,
      formatPrice,
    }
  },
}
</script>

<style scoped>
.product-detail {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.detail-header {
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid #e0e0e0;
}

.image-section {
  background: white;
}

.dot {
  height: 8px;
  width: 8px;
  margin: 0 2px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  transition: background-color 0.3s;
}

.dot.active {
  background-color: #26a69a;
}

.product-info {
  border-radius: 24px 24px 0 0;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
}

.product-title {
  font-size: 1.5rem;
  line-height: 1.3;
  color: #1a1a1a;
}

.product-price {
  font-size: 2rem;
  color: #1976d2;
}

.seller-card {
  border-radius: 12px;
  transition: all 0.2s ease;
}

.seller-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.description-text {
  line-height: 1.6;
  color: #555;
}

.delivery-card {
  border-radius: 12px;
}

.comments-section {
  background: white;
}

.comment-item {
  padding: 16px;
  border-radius: 12px;
  background: #f8f9fa;
  transition: all 0.2s ease;
}

.comment-item:hover {
  background: #e9ecef;
}

.add-comment {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 12px;
}

.action-buttons-section {
  margin-top: 24px;
}

.add-to-cart-btn {
  background-color: #4A4A4A !important;
  color: white !important;
  font-weight: 600;
  text-transform: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  height: 48px;
}

.add-to-cart-btn:hover {
  background-color: #3A3A3A !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.buy-now-btn {
  background-color: #00A896 !important;
  color: white !important;
  font-weight: 600;
  text-transform: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  height: 48px;
}

.buy-now-btn:hover {
  background-color: #009688 !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}





.loading-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Mobile specific adjustments */
@media (max-width: 600px) {
  .product-title {
    font-size: 1.25rem;
  }
  
  .product-price {
    font-size: 1.75rem;
  }
  
  .fixed-bottom-actions {
    padding: 12px 16px;
  }
}

/* Desktop specific adjustments */
@media (min-width: 960px) {
  .product-info {
    max-width: 1200px;
    margin: 0 auto;
    border-radius: 16px;
  }
  
  .fixed-bottom-actions {
    max-width: 1200px;
    margin: 0 auto;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 16px 16px 0 0;
  }
}
</style>