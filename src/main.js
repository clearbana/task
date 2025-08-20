/**
 * Main application entry point
 * Sets up Vue app with Pinia state management, Vuetify UI library, and Vue Router
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import { createRouter, createWebHistory } from 'vue-router'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
import Home from './pages/Home.vue'
import Categories from './pages/Categories.vue'
import ProductDetail from './pages/ProductDetail.vue'
import Cart from './pages/Cart.vue'
import Favorites from './pages/Favorites.vue'

// Initialize Pinia for state management
const pinia = createPinia()

// Configure Vuetify with custom theme matching the design
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#26a69a', // Teal color from design
          secondary: '#ff7043', // Orange accent
          accent: '#4caf50',
          error: '#f44336',
          warning: '#ff9800',
          info: '#2196f3',
          success: '#4caf50',
          surface: '#ffffff',
          background: '#f5f5f5',
        },
      },
    },
  },
  display: {
    mobileBreakpoint: 'sm',
    thresholds: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1200,
      xl: 1920,
    },
  },
})

// Define application routes
const routes = [
  { path: '/', component: Home, name: 'Home' },
  { path: '/categories', component: Categories, name: 'Categories' },
  { path: '/product/:id', component: ProductDetail, name: 'ProductDetail' },
  { path: '/cart', component: Cart, name: 'Cart' },
  { path: '/favorites', component: Favorites, name: 'Favorites' },
]

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Create and mount the Vue application
createApp(App)
  .use(pinia)
  .use(vuetify)
  .use(router)
  .mount('#app')