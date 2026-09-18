<script setup lang="ts">
import { 
  Search, ShoppingCart, Heart, Menu, Shuffle, User,
  LayoutGrid
} from 'lucide-vue-next'
import MobileNavigation from './MobileNavigation.vue'
import Topbar from './Topbar.vue'
import { useNavigation } from '~/composables/useNavigation'
import { useCart } from '~/composables/useCart'
import { useWishlist } from '~/composables/useWishlist'
import { formatPrice } from '~/utils/formatPrice'
import { useCategories } from '~/composables/useCategories'
import CartDrawer from './CartDrawer.vue'

import { useProductFilters } from '~/composables/useProductFilters'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'

const { toggleMobileMenu } = useNavigation()
const { count: cartCount, cartTotal, isOpen: isCartOpen } = useCart()
const { count: wishlistCount } = useWishlist()
const { categories: apiCategories } = useCategories()

// Compare count (mock for now)
const compareCount = 0

const { searchQuery } = useProductFilters()
const router = useRouter()
const localSearch = ref('')

function handleSearch() {
  if (localSearch.value.trim() !== '') {
    searchQuery.value = localSearch.value.trim()
    router.push('/products')
  }
}

// Bottom bar categories from API API
const dynamicCategories = computed(() => {
  const cats = [{ name: 'Tous les produits', icon: LayoutGrid, link: '/products' }]
  if (apiCategories.value) {
    cats.push(...apiCategories.value.map(cat => ({
      name: cat.name,
      icon: LayoutGrid,
      link: `/products?category=${cat.id}`
    })))
  }
  return cats
})
</script>

<template>
  <header class="header">
    <Topbar />
    <!-- Top Row -->
    <div class="header-top container-site">
      
      <!-- Mobile Menu Toggle (Left on mobile) -->
      <button class="header-menu-btn desktop-hide" aria-label="Menu" @click="toggleMobileMenu">
        <Menu :size="24" :stroke-width="1.5" />
      </button>

      <!-- Logo -->
      <NuxtLink to="/" class="header-logo">
        <span class="header-logo-title">DESACT</span>
        <span class="header-logo-subtitle">Plus</span>
      </NuxtLink>

      <!-- Search Bar (Centered on desktop) -->
      <div class="header-search">
        <Search :size="18" :stroke-width="1.5" class="search-icon" />
        <input 
          v-model="localSearch" 
          type="text" 
          placeholder="Search for products" 
          class="search-input"
          @keyup.enter="handleSearch"
        >
      </div>

      <!-- Right Actions -->
      <div class="header-actions">
      

        <!-- Wishlist -->
        <NuxtLink to="/wishlist" class="action-circle">
          <Heart :size="18" :stroke-width="1.5" />
          <span v-if="wishlistCount > 0" class="action-badge">{{ wishlistCount }}</span>
          <span v-else class="action-badge">0</span>
        </NuxtLink>

        <!-- Login / Register -->
        <NuxtLink to="/login" class="action-pill action-pill-light desktop-only">
          <User :size="18" :stroke-width="1.5" />
          <span>Login / Register</span>
        </NuxtLink>

        <!-- Cart -->
        <button class="action-pill action-pill-dark" @click="isCartOpen = true">
          <ShoppingCart :size="18" :stroke-width="1.5" />
          <span>{{ formatPrice(cartTotal) }}</span>
          <span v-if="cartCount > 0" class="action-badge-cart">{{ cartCount }}</span>
          <span v-else class="action-badge-cart">0</span>
        </button>
      </div>
    </div>

    <!-- Bottom Row (Categories) -->
    <div class="header-bottom container-site">
      <div class="categories-list">
        <NuxtLink v-for="cat in dynamicCategories" :key="cat.name" :to="cat.link" class="category-link">
          <component :is="cat.icon" :size="16" :stroke-width="1.5" class="category-icon" />
          <span>{{ cat.name }}</span>
        </NuxtLink>
      </div>

      <div class="promo-pill desktop-only">
        Free shipping for all orders of $1300
      </div>
    </div>

    <!-- Mobile Navigation Drawer -->
    <MobileNavigation />
    
    <!-- Cart Drawer -->
    <CartDrawer />
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  background-color: var(--dp-white);
  border-bottom: 1px solid var(--dp-sand);
  display: flex;
  flex-direction: column;
}

/* --- Top Row --- */
.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  padding-bottom: 1rem;
  gap: 2rem;
}

.header-logo {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  color: var(--dp-charcoal);
  text-decoration: none;
}

.header-logo-title {
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  line-height: 1;
}

.header-logo-subtitle {
  font-size: 0.5625rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--dp-taupe);
  margin-top: 0.125rem;
}

.header-search {
  flex: 1;
  max-width: 600px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: #888;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border-radius: var(--radius-full);
  border: 1px solid #e0e0e0;
  background-color: var(--dp-white);
  font-size: 0.875rem;
  color: var(--dp-charcoal);
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: var(--dp-charcoal);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Action Styles */
.action-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #f3f3f3;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dp-charcoal);
  text-decoration: none;
  position: relative;
  transition: background-color 0.3s;
}

.action-circle:hover {
  background-color: #e8e8e8;
}

.action-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  position: relative;
  transition: transform 0.3s, background-color 0.3s;
}

.action-pill:active {
  transform: scale(0.98);
}

.action-pill-light {
  background-color: #f3f3f3;
  color: var(--dp-charcoal);
}

.action-pill-light:hover {
  background-color: #e8e8e8;
}

.action-pill-dark {
  background-color: #111;
  color: var(--dp-white);
}

.action-pill-dark:hover {
  background-color: #000;
}

/* Badges */
.action-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: #fca5a5;
  color: var(--dp-white);
  font-size: 0.65rem;
  font-weight: 600;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid var(--dp-white);
}

.action-badge-cart {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: #fca5a5;
  color: var(--dp-white);
  font-size: 0.65rem;
  font-weight: 600;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid #111;
}

/* --- Bottom Row --- */
.header-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.75rem;
  overflow-x: auto; /* For mobile swipe */
  scrollbar-width: none; /* Hide scrollbar */
}
.header-bottom::-webkit-scrollbar {
  display: none;
}

.categories-list {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.category-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--dp-charcoal);
  text-decoration: none;
  font-size: 0.8125rem;
  font-weight: 500;
  white-space: nowrap;
  transition: color 0.3s;
}

.category-link:hover {
  color: var(--dp-gold);
}

.category-icon {
  color: #666;
}

.promo-pill {
  background-color: #eef2f6;
  color: #3b5a7a;
  padding: 0.4rem 0.8rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

/* --- Mobile Specifics --- */
.header-menu-btn {
  background: none;
  border: none;
  color: var(--dp-charcoal);
  cursor: pointer;
  padding: 0;
  display: flex;
}

.desktop-hide {
  display: none;
}

@media (max-width: 1024px) {
  .desktop-only {
    display: none !important;
  }
  
  .desktop-hide {
    display: flex;
  }

  .header-top {
    gap: 1rem;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }

  .header-search {
    display: none; /* Might want to hide search on mobile header top row, or put it elsewhere */
  }

  .header-actions {
    gap: 0.5rem;
  }
  
  .action-circle,
  .action-pill {
    width: 38px;
    height: 38px;
    padding: 0;
    justify-content: center;
  }
  
  .action-pill span {
    display: none; /* Hide text on mobile */
  }
}
</style>
