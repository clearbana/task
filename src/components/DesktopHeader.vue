<!--
  Desktop Header Component
  Main navigation header for desktop view with logo, search, and user actions
-->
<template>
  <v-app-bar 
    color="white" 
    elevation="0" 
    border="0"
    height="80"
    class="desktop-header"
  >
    <v-container fluid class="d-flex align-center px-6">
      <!-- Logo and Brand -->
      <div class="d-flex align-center mr-8">
        <v-btn icon class="mr-2" @click="toggleSidebar">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <div class="d-flex align-center">
          <div class="mr-2">
            <img src="/vite.ico" alt="logo">
          </div>
          <div>
            <h2 class="text-h6 font-weight-bold mb-0">
            <span class="text-black">SECOND</span><span class="text-primary">HAND</span>
            </h2>
            <p class="text-caption text-grey mb-0">SHOPHOLIC</p>
          </div>
        </div>
      </div>
      <v-divider vertical class="mx-3"/>

      <!-- Navigation Links -->
      <div class="d-flex align-center mr-8">
        <v-btn text class="mr-3">How It Works?</v-btn>
        <v-btn text>Help & Support</v-btn>
      </div>

      <v-spacer />

      <!-- Right Side Actions -->
      <div class="d-flex align-center">
        <!-- Language Selector -->
        <v-btn variant="text" class="mr-4">
          <v-icon class="mr-1">mdi-web</v-icon>
          EN
        </v-btn>

        <!-- Cart Button -->
        <v-btn 
          icon 
          class="mr-4 square-btn" 
          @click="cartStore.toggleDrawer()"
        >
          <v-badge 
            :content="cartStore.totalItems" 
            color="warning" 
            v-if="cartStore.totalItems > 0"
          >
            <v-icon>mdi-cart-outline</v-icon>
          </v-badge>
          <v-icon v-else>mdi-cart-outline</v-icon>
        </v-btn>

        <!-- User Profile -->
        <div class="d-flex align-center">
          <v-avatar size="40" class="mr-2 square-btn">
            <v-img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" />
          </v-avatar>
          <div>
            <p class="font-weight-medium mb-0">M. Khalid Saied</p>
            <p class="text-caption text-grey mb-0">Show Profile</p>
          </div>
        </div>
      </div>
    </v-container>
  </v-app-bar>

  <!-- Sidebar Navigation -->
  <v-navigation-drawer
    v-model="sidebarOpen"
    permanent                 
    width="100"
    class="desktop-sidebar"
   
  >
    <div class="pa-4">
      <!-- Place Ad Button -->
       <div class="d-flex justify-center ">
      <v-btn
        color="primary"
        size="medium"
        class="mb-3 square-btn "
        rounded="lg"
        prepend-icon="mdi-plus"
      >
      </v-btn>
      </div>
       <div class="text-center">
    <div>Place</div>
    <div>Ad</div>
  </div>

      <!-- Navigation Items -->
      <v-list>
        <v-list-item
          v-for="item in navigationItems"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          @click="handleNavigation(item)"
          class="mb-2"
        />
      </v-list>
    </div>
  </v-navigation-drawer>


</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'

export default {
  name: 'DesktopHeader',
  setup() {
    const router = useRouter()
    const cartStore = useCartStore()
    const sidebarOpen = ref(false)

    // Navigation items for sidebar
    const navigationItems = [
      { icon: 'mdi-view-grid', route: '/categories' },
      {  icon: 'mdi-heart', route: '/favorites' },
      {  icon: 'mdi-package-variant' },
      {  icon: 'mdi-home', route: '/' },
      { icon: 'mdi-message' },
      {  icon: 'mdi-cog' },
    ]

    /**
     * Toggle sidebar visibility
     */
    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value
    }

    /**
     * Handle navigation item clicks
     * @param {Object} item - Navigation item
     */
    const handleNavigation = (item) => {
      if (item.route) {
        router.push(item.route)
      }
      sidebarOpen.value = false
    }

    return {
      cartStore,
      sidebarOpen,
      navigationItems,
      toggleSidebar,
      handleNavigation,
    }
  },
}
</script>

<style scoped>
.desktop-header {
  border-bottom: 1px solid #e0e0e0;
}

.logo-container {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #26a69a 0%, #4db6ac 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.desktop-sidebar {
  border: none !important;
  box-shadow: none !important; /* optional if you don’t want shadow */
  background-color: #fff;       /* or whatever color you want */
}

.desktop-sidebar .v-list-item {
  border-radius: 8px;
  margin-bottom: 4px;
  border: none !important;     
  box-shadow: none !important;
}

.desktop-sidebar .v-list-item:hover {
  background-color:transparent !important;
}
.square-btn {
  width: 43px;   /* same height & width */
  height: 43px;
  box-shadow: 1px 1px 3px rgba(4, 4, 4, 0.2);
  outline: 4px; /* small rounding or 0 for perfect square */
  min-width: 48px; /* override Vuetify default */
  border-radius: 4px; /* small rounding or 0 for perfect square */
  padding: 0;     /* optional: remove extra padding */
  /* display: flex; */
  
}

</style>