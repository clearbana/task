<!--
  Root application component
  Provides the main layout structure with responsive navigation
-->
<template>
  <v-app>
    <!-- Desktop Header - Only shown on desktop -->
    <DesktopHeader v-if="!isMobile" />
    
    <!-- Main content area -->
    <v-main>
      <router-view />
    </v-main>
    
    <!-- Mobile Bottom Navigation - Only shown on mobile, hidden on product detail pages -->
    <BottomNavigation v-if="isMobile && !isProductDetailPage" />
    
    <!-- Desktop Cart Drawer -->
    <CartDrawer v-if="!isMobile" />
    
  </v-app>
</template>

<script>
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'
import BottomNavigation from './components/BottomNavigation.vue'
import DesktopHeader from './components/DesktopHeader.vue'
import CartDrawer from './components/CartDrawer.vue'

export default {
  name: 'App',
  components: {
    BottomNavigation,
    DesktopHeader,
    CartDrawer,
  },
  setup() {
    const { mobile } = useDisplay()
    const route = useRoute()
    
    // Determine if we're on mobile or desktop
    const isMobile = computed(() => mobile.value)
    
    // Check if we're on a product detail page
    const isProductDetailPage = computed(() => {
      return route.name === 'ProductDetail'
    })
    
    return {
      isMobile,
      isProductDetailPage,
    }
  },
}
</script>


<style>
/* Global application styles */
body {
  font-family: 'Inter', system-ui, Avenir, Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.v-application {
  background-color: #f5f5f5 !important;
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>