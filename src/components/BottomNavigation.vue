<template>
  <div>
    <!-- Bottom Navigation -->
    <v-bottom-navigation
      v-model="currentRoute"
      color="primary"
      fixed
      grow
      height="64"
      class="bottom-nav"
    >
      <v-btn @click="navigateTo('/')" :class="{ 'active-tab': currentRoute === 0 }">
        <v-icon>mdi-home</v-icon>
        <span>Home</span>
      </v-btn>

      <v-btn @click="navigateTo('/favorites')" :class="{ 'active-tab': currentRoute === 1 }">
        <v-icon>mdi-heart</v-icon>
        <span>Liked</span>
      </v-btn>

      <!-- just a placeholder to keep spacing balanced -->
      <div class="nav-center-placeholder"></div>

      <v-btn @click="navigateTo('/store')" :class="{ 'active-tab': currentRoute === 3 }">
        <v-icon>mdi-store</v-icon>
        <span>Store</span>
      </v-btn>

      <v-btn @click="showMoreMenu" :class="{ 'active-tab': currentRoute === 4 }">
        <v-icon>mdi-menu</v-icon>
        <span>More</span>
      </v-btn>
      <div class="nav-center">
      <v-btn class="add-btn-simple" @click="navigateTo('/place-ad')" elevation="0">
        <v-icon size="28" color="white">mdi-plus</v-icon>
      </v-btn>
    </div>
    </v-bottom-navigation>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'BottomNavigation',
  setup() {
    const router = useRouter()
    const route = useRoute()

    const currentRoute = ref(0)

    const navigateTo = (path) => {
      router.push(path)
    }

    // Watch route changes to update active tab
    watch(
      () => route.path,
      (newPath) => {
        if (newPath === '/favorites') {
          currentRoute.value = 0
        }
      },
      { immediate: true }
    )

    return {
      currentRoute,
      navigateTo,
    }
  },
}
</script>
<style scoped>
.bottom-nav {
  border-top: 1px solid #e0e0e0;
  background-color: white;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  height: 64px !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-center {
  position: fixed;
  bottom: 32px; /* sits half inside, half outside the nav */
  left: 50%;
  transform: translateX(-50%);
  z-index: 200; /* above the nav */
}

.add-btn-simple {
  background: #13b3b3 !important;
  color: white !important;
  border-radius: 50% !important;
  width: 64px !important;
  height: 64px !important;
  min-width: 64px !important;
  min-height: 64px !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
  font-size: 28px !important;
  margin: 0 !important;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2) !important; /* optional shadow */
  border: none !important;
  transition: background 0.2s, transform 0.2s;
}

.add-btn-simple:hover {
  background: #0e8e8e !important;
  transform: scale(1.05);
}

/* .v-btn {
  transition: all 0.3s ease;
  flex-direction: column;
  min-width: 0 !important;
  padding: 0 0 !important;
  height: 64px !important;
  font-size: 14px;
  color: #222 !important;
  background: transparent !important;
}

.v-btn.active-tab {
  color: #13b3b3 !important;
}

.v-btn:not(.add-btn-simple) {
  background-color: rgba(38, 166, 154, 0.08) !important;
} */

.v-icon {
  margin-bottom: 2px;
}

.bottom-nav .v-btn span {
  font-size: 13px;
  margin-top: 2px;
  font-weight: 500;
  letter-spacing: 0.01em;
}

@media (max-width: 600px) {
  .add-btn-simple {
    width: 56px !important;
    height: 56px !important;
    min-width: 56px !important;
    min-height: 56px !important;
    font-size: 24px !important;
  }
  .nav-center {
    bottom: 28px; /* adjust for smaller button */
  }
}
</style>