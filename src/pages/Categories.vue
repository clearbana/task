<!--
  Categories Page Component
  Displays all available product categories with navigation
-->
<template>
  <v-container class="categories-page pa-4" :class="{ 'desktop-full': !isMobile }">
    <!-- Header -->
    <div class="header-row d-flex flex-column align-center mb-6">
      <div class="d-flex align-center w-100">
        <v-btn icon class="back-btn" @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <div class="flex-grow-1"></div>
      </div>
      <h1 class="categories-title mt-2 mb-0">Categories</h1>
    </div>

    <!-- Categories List -->
    <v-card class="categories-card" variant="flat">
      <v-list lines="one" class="bg-white">
        <v-list-item
          v-for="category in categoryList"
          :key="category.value"
          @click="selectCategory(category)"
          class="category-item"
        >
          <v-list-item-title class="category-label">
            {{ category.label }}
          </v-list-item-title>
          <template v-slot:append>
            <v-icon color="grey-darken-1">mdi-chevron-right</v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-card>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <v-progress-circular indeterminate color="primary" />
      <p class="mt-4">Loading categories...</p>
    </div>
  </v-container>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '../stores/products'
import { useDisplay } from 'vuetify'


export default {
  name: 'CategoriesPage',
  setup() {
    const router = useRouter()
    const productStore = useProductStore()
    const { mobile } = useDisplay()
    const isMobile = computed(() => mobile.value)

    const loading = computed(() => productStore.loading)

    // Category list (labels only, no icons/colors/counts)
    const categoryList = computed(() => [
      { label: 'All categories', value: 'all' },
      { label: 'Electronics', value: 'electronics' },
      { label: 'Home & Garden', value: 'jewelery' },
      { label: 'Fashion', value: "men's clothing" },
      { label: 'Toys', value: 'electronics' },
      { label: 'Sporting Goods', value: "women's clothing" },
      { label: 'Business & Industrial', value: 'electronics' },
      { label: 'Jewelry & Watches', value: 'jewelery' },
      { label: 'Vintage', value: "women's clothing" },
      { label: 'Handmade', value: 'jewelery' },
      { label: 'Office', value: 'electronics' },
      { label: 'Outdoor', value: 'electronics' },
      { label: 'Tools', value: 'electronics' },
    ])

    const goBack = () => {
      router.back()
    }

    const selectCategory = (category) => {
      productStore.setSelectedCategory(category.value)
      router.push('/')
    }

    onMounted(async () => {
      if (productStore.products.length === 0) {
        await productStore.fetchProducts()
      }
      if (productStore.categories.length === 0) {
        await productStore.fetchCategories()
      }
    })

    return {
      loading,
      categoryList,
      goBack,
      selectCategory,
      isMobile,
    }
  },
}
</script>

<style scoped>
.categories-page {
  min-height: 100vh;
  background-color: #fff;
  max-width: 430px;
  margin: 0 auto;
}

.categories-page.desktop-full {
  max-width: 100vw;
  margin: 0;
  border-radius: 0;
  box-shadow: none;
}

.header-row {
  padding-top: 24px;
}

.back-btn {
  background: #f5f5f5 !important;
  border-radius: 12px !important;
  min-width: 44px !important;
  min-height: 44px !important;
  box-shadow: none !important;
}

.categories-title {
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.01em;
  color: #222;
}

.categories-card {
  border-radius: 0;
  box-shadow: none;
  margin-top: 0;
}

.category-item {
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;
  padding: 18px 0 18px 0;
  min-height: 0;
}

.category-item:last-child {
  border-bottom: none;
}

.category-label {
  font-size: 1rem;
  font-weight: 400;
  color: #222;
  letter-spacing: 0.01em;
}

.category-item:hover {
  background-color: #f8f9fa;
}

@media (max-width: 600px) {
  .categories-page {
    padding: 0;
    max-width: 100vw;
  }
  .categories-card {
    border-radius: 0;
  }
  .category-item {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>