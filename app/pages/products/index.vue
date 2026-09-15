<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSeo } from '~/composables/useSeo'
import ProductSidebar from '~/components/product/ProductSidebar.vue'
import ProductCard from '~/components/product/ProductCard.vue'
import TrustBar from '~/components/home/TrustBar.vue'
import { ChevronRight, ChevronLeft, Grid, List, ChevronDown, SlidersHorizontal, X } from 'lucide-vue-next'
import { useProductFilters } from '~/composables/useProductFilters'
import { useProducts } from '~/composables/useProducts'

// View mode state (grid or list)
const viewMode = ref<'grid' | 'list'>('grid')

// Mobile filter drawer
const showMobileFilters = ref(false)

useSeo({
  title: 'Nos produits - Zain Studio',
  description: 'Des pièces sélectionnées avec soin, alliant design contemporain, confort et qualité incomparable.',
})

// Using the default layout so we get header and footer
definePageMeta({ layout: 'default' })

const { products: asyncProducts } = useProducts()
const allProducts = computed(() => asyncProducts.value || [])

const {
  searchQuery,
  selectedCategory,
  selectedMaterials,
  selectedColors,
  inStockOnly,
  priceRange
} = useProductFilters()

const route = useRoute()

// Sync URL query with selectedCategory
watch(() => route.query.category, (newVal) => {
  if (newVal) {
    selectedCategory.value = String(newVal)
  } else {
    selectedCategory.value = 'all'
  }
}, { immediate: true })


const filteredProducts = computed(() => {
  return allProducts.value.filter(p => {
    // Search Query Filter
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      if (!p.name?.toLowerCase().includes(q) && !p.description?.toLowerCase().includes(q)) {
        return false
      }
    }

    // 1. Category Filter (using API category IDs, categoryIds array, and handles)
    if (selectedCategory.value !== 'all') {
      const catVal = selectedCategory.value.toLowerCase()
      const matchesId = p.categoryId === selectedCategory.value || (p.categoryIds && p.categoryIds.includes(selectedCategory.value))
      const matchesHandle = p.categories?.some(c => c.handle?.toLowerCase() === catVal || c.id === selectedCategory.value)
      if (!matchesId && !matchesHandle) {
        return false
      }
    }

    // 2. Material Filter
    if (selectedMaterials.value.length > 0) {
      // normalize e.g. "Bois massif" -> "bois", "Coton bouclette" -> "coton"
      const hasMaterial = selectedMaterials.value.some(selected => {
        const normSelected = selected.toLowerCase().replace(/é/g, 'e').split(' ')[0]!
        return p.materials?.some(mat => mat?.toLowerCase().includes(normSelected)) || 
               p.tags?.some(tag => tag?.toLowerCase().includes(normSelected))
      })
      if (!hasMaterial) return false
    }

    // 3. Color Filter
    if (selectedColors.value.length > 0) {
      // Check if product colors match selected colors
      // We do a loose check because mock colors and sidebar colors might be slightly different hexes
      const hasColor = selectedColors.value.some(selectedCol => {
        return p.colors?.some(productCol => productCol?.toUpperCase() === selectedCol.toUpperCase())
      })
      // If we strictly filter and no colors match, the grid becomes empty.
      // We apply the filter only if hasColor is false to exclude the product
      if (!hasColor) return false
    }

    // 4. Availability Filter
    if (inStockOnly.value && !p.available) {
      return false
    }

    // 5. Price Filter
    if (p.price < priceRange.value[0]! || p.price > priceRange.value[1]!) {
      return false
    }

    return true
  })
})

const sortBy = ref<'default' | 'price-asc' | 'price-desc' | 'newest'>('default')

const sortedAndFilteredProducts = computed(() => {
  const products = [...filteredProducts.value]
  
  if (sortBy.value === 'price-asc') {
    return products.sort((a, b) => a.price - b.price)
  }
  if (sortBy.value === 'price-desc') {
    return products.sort((a, b) => b.price - a.price)
  }
  if (sortBy.value === 'newest') {
    return products.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
  }
  
  return products
})

// ── Pagination ─────────────────────────────────────────
const currentPage = ref(1)
const perPage = ref(24)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(sortedAndFilteredProducts.value.length / perPage.value))
)

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return sortedAndFilteredProducts.value.slice(start, start + perPage.value)
})

/** Visible page numbers with ellipsis gaps (returns numbers and '...' strings) */
const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages: (number | string)[] = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
    return pages
  }

  // Always show first page
  pages.push(1)

  if (current > 3) pages.push('...')

  // Window around current page
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push('...')

  // Always show last page
  pages.push(total)

  return pages
})

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  // Scroll to top of product grid
  const el = document.querySelector('.plp-main')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Reset to page 1 whenever filters change
watch(
  [sortedAndFilteredProducts],
  () => { currentPage.value = 1 }
)
</script>

<template>
  <div class="products-page">
    
    <!-- Hero Banner -->
    <section class="plp-hero">
      <div class="plp-hero-bg">
        <img src="/images/bathrom.jpeg" alt="" class="plp-hero-img" onerror="this.style.display='none'" />
        <div class="plp-hero-gradient"></div>
      </div>
      <div class="container-site plp-hero-inner">
        <div class="plp-hero-content">
          <span class="plp-hero-subtitle">COLLECTIONS</span>
          <h1 class="plp-hero-title">Nos produits</h1>
          <p class="plp-hero-desc">
            Des pièces sélectionnées avec soin, alliant design<br/>
            contemporain, confort et qualité incomparable.
          </p>
        </div>
      </div>
    </section>

    <!-- Toolbar -->
    <div class="plp-toolbar">
      <div class="container-site">
        <div class="plp-toolbar-inner">
          <!-- Breadcrumbs -->
          <nav class="toolbar-left">
            <NuxtLink to="/" class="breadcrumb-link">Accueil</NuxtLink>
            <ChevronRight :size="12" class="breadcrumb-icon" />
            <span class="breadcrumb-current">Produits</span>
          </nav>

          <!-- Sorting & View Toggles -->
          <div class="toolbar-right">
            <!-- Mobile filter toggle -->
            <button class="filter-toggle-btn" @click="showMobileFilters = true">
              <SlidersHorizontal :size="16" />
              <span>Filtres</span>
            </button>

            <div class="toolbar-sort">
              <label for="sort-select" class="sort-label">Trier par :</label>
              <div class="sort-select-wrapper">
                <select id="sort-select" class="sort-select" v-model="sortBy">
                  <option value="default">Popularité</option>
                  <option value="newest">Nouveautés</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                </select>
                <ChevronDown :size="14" class="sort-icon" />
              </div>
            </div>
            <div class="toolbar-views">
              <button 
                class="view-btn" 
                :class="{ active: viewMode === 'grid' }"
                @click="viewMode = 'grid'"
                aria-label="Vue grille"
              >
                <Grid :size="18" />
              </button>
              <button 
                class="view-btn" 
                :class="{ active: viewMode === 'list' }"
                @click="viewMode = 'list'"
                aria-label="Vue liste"
              >
                <List :size="18" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Filter Drawer Overlay -->
    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="showMobileFilters" class="mobile-filter-overlay" @click.self="showMobileFilters = false">
          <div class="mobile-filter-drawer">
            <div class="mobile-filter-header">
              <span class="mobile-filter-title">FILTRES</span>
              <button class="mobile-filter-close" @click="showMobileFilters = false">
                <X :size="20" />
              </button>
            </div>
            <div class="mobile-filter-body">
              <ProductSidebar />
            </div>
            <div class="mobile-filter-footer">
              <button class="mobile-filter-apply" @click="showMobileFilters = false">
                Appliquer les filtres
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Main Layout -->
    <div class="container-site plp-container">
      <div class="plp-layout">
        
        <!-- Left Sidebar (desktop only) -->
        <div class="plp-sidebar-wrapper">
          <ProductSidebar />
        </div>

        <!-- Product Grid -->
        <div class="plp-main">
          
          <!-- Results count -->
          <div class="plp-results-count">
            {{ sortedAndFilteredProducts.length }} produit{{ sortedAndFilteredProducts.length !== 1 ? 's' : '' }}
            <span v-if="totalPages > 1"> — page {{ currentPage }} sur {{ totalPages }}</span>
          </div>

          <div :class="viewMode === 'grid' ? 'product-grid' : 'product-list'">
            <ProductCard
              v-for="product in paginatedProducts"
              :key="product.id"
              :product="product"
              :layout="viewMode"
            />
          </div>

          <!-- Empty state -->
          <div v-if="paginatedProducts.length === 0" class="plp-empty">
            <EmptyState 
              title="Aucun produit trouvé" 
              description="Aucun produit ne correspond à vos critères de recherche. Essayez de modifier vos filtres."
            />
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="plp-pagination">
            <!-- Previous -->
            <button
              class="page-item page-arrow"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >
              <ChevronLeft :size="14" />
            </button>

            <!-- Page numbers -->
            <template v-for="(page, idx) in visiblePages" :key="idx">
              <span v-if="page === '...'" class="page-ellipsis">…</span>
              <button
                v-else
                class="page-item"
                :class="{ active: page === currentPage }"
                @click="goToPage(page as number)"
              >
                {{ page }}
              </button>
            </template>

            <!-- Next -->
            <button
              class="page-item page-arrow"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >
              <ChevronRight :size="14" />
            </button>
          </div>

        </div>

      </div>
    </div>

    <!-- Trust Badges at Bottom -->
    <TrustBar />

  </div>
</template>

<style scoped>
.products-page {
  background-color: var(--dp-white);
}

/* ================================ */
/* Hero                             */
/* ================================ */
.plp-hero {
  position: relative;
  min-height: 260px;
  display: flex;
  align-items: center;
  background-color: #f5f2ed;
}

@media (min-width: 768px) {
  .plp-hero {
    min-height: 400px;
  }
}

.plp-hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  background-color: #f5f2ed;
}

.plp-hero-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 2;
}

.plp-hero-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, #f5f2ed 0%, #f5f2ed 20%, rgba(245, 242, 237, 0) 100%);
  z-index: 3;
}

@media (min-width: 768px) {
  .plp-hero-gradient {
    width: 60%;
  }
}

.plp-hero-inner {
  position: relative;
  z-index: 10;
  width: 100%;
}

.plp-hero-content {
  max-width: 600px;
  padding: 2.5rem 0;
}

@media (min-width: 768px) {
  .plp-hero-content {
    padding: 4rem 0;
  }
}

.plp-hero-subtitle {
  font-size: 0.625rem;
  font-weight: 700;
  color: var(--dp-gold);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
  display: block;
}

.plp-hero-title {
  font-size: 2.25rem;
  font-weight: 400;
  color: var(--dp-charcoal);
  margin: 0 0 0.75rem 0;
  line-height: 1.1;
}

@media (min-width: 768px) {
  .plp-hero-title {
    font-size: 3.5rem;
    margin-bottom: 1rem;
  }
}

.plp-hero-desc {
  font-size: 0.8125rem;
  color: var(--dp-ash);
  line-height: 1.6;
  margin: 0;
}

@media (min-width: 768px) {
  .plp-hero-desc {
    font-size: 0.875rem;
  }
}

/* ================================ */
/* Toolbar                          */
/* ================================ */
.plp-toolbar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.plp-toolbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 0;
}

@media (min-width: 768px) {
  .plp-toolbar-inner {
    padding: 1rem 0;
  }
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--dp-ash);
}

.breadcrumb-link {
  text-decoration: none;
  color: inherit;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--dp-charcoal);
}

.breadcrumb-icon {
  color: var(--dp-ash);
}

.breadcrumb-current {
  color: var(--dp-charcoal);
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .toolbar-right {
    gap: 1.5rem;
  }
}

/* Mobile filter toggle button */
.filter-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0.375rem 0.75rem;
  border-radius: 2px;
  cursor: pointer;
  font-size: 0.75rem;
  color: var(--dp-charcoal);
  transition: border-color 0.2s ease;
}

.filter-toggle-btn:hover {
  border-color: var(--dp-charcoal);
}

@media (min-width: 1024px) {
  .filter-toggle-btn {
    display: none;
  }
}

.toolbar-sort {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--dp-charcoal);
}

.sort-label {
  display: none;
  color: var(--dp-charcoal);
}

@media (min-width: 768px) {
  .sort-label {
    display: inline;
  }
}

.sort-select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.sort-select {
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0.375rem 2rem 0.375rem 0.75rem;
  border-radius: 2px;
  cursor: pointer;
  font-size: 0.75rem;
  font-family: inherit;
  color: var(--dp-charcoal);
  outline: none;
  transition: border-color 0.2s ease;
}

.sort-select:hover {
  border-color: rgba(0, 0, 0, 0.2);
}

.sort-select:focus-visible {
  border-color: var(--dp-gold);
}

.sort-icon {
  position: absolute;
  right: 0.5rem;
  pointer-events: none;
  color: var(--dp-charcoal);
}

.toolbar-views {
  display: none;
  align-items: center;
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .toolbar-views {
    display: flex;
  }
}

.view-btn {
  background: transparent;
  border: none;
  color: var(--dp-ash);
  cursor: pointer;
  padding: 0;
  transition: color 0.2s ease;
}

.view-btn:hover,
.view-btn.active {
  color: var(--dp-charcoal);
}

/* ================================ */
/* Mobile Filter Drawer             */
/* ================================ */
.mobile-filter-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
}

.mobile-filter-drawer {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 360px;
  height: 100%;
  background-color: var(--dp-white);
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.1);
}

.mobile-filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.mobile-filter-title {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--dp-charcoal);
}

.mobile-filter-close {
  background: none;
  border: none;
  color: var(--dp-ash);
  cursor: pointer;
  padding: 0;
  transition: color 0.2s ease;
}

.mobile-filter-close:hover {
  color: var(--dp-charcoal);
}

.mobile-filter-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 1.5rem;
}

.mobile-filter-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.mobile-filter-apply {
  width: 100%;
  padding: 0.875rem;
  background-color: var(--dp-charcoal);
  color: var(--dp-white);
  border: none;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.mobile-filter-apply:hover {
  background-color: var(--dp-gold);
}

/* Drawer transitions */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-enter-active .mobile-filter-drawer,
.drawer-leave-active .mobile-filter-drawer {
  transition: transform 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .mobile-filter-drawer,
.drawer-leave-to .mobile-filter-drawer {
  transform: translateX(100%);
}

/* ================================ */
/* Layout                           */
/* ================================ */
.plp-container {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

@media (min-width: 768px) {
  .plp-container {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
}

.plp-layout {
  display: flex;
  gap: 3rem;
}

/* Desktop sidebar: hidden on mobile, shown on desktop */
.plp-sidebar-wrapper {
  display: none;
  flex: 0 0 260px;
}

@media (min-width: 1024px) {
  .plp-sidebar-wrapper {
    display: block;
  }
}

.plp-main {
  flex: 1;
  min-width: 0;
}

/* ================================ */
/* Grid & List Views                */
/* ================================ */
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  row-gap: 2rem;
}

@media (min-width: 640px) {
  .product-grid {
    gap: 1rem;
    row-gap: 2.5rem;
  }
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    row-gap: 4rem;
  }
}

@media (min-width: 1280px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1536px) {
  .product-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* ================================ */
/* Results count & Empty state      */
/* ================================ */
.plp-results-count {
  font-size: 0.75rem;
  color: var(--dp-ash);
  margin-bottom: 1.5rem;
  letter-spacing: 0.02em;
}

.plp-empty {
  text-align: center;
  padding: 4rem 1rem;
  color: var(--dp-ash);
  font-size: 0.9375rem;
}

/* ================================ */
/* Pagination                       */
/* ================================ */
.plp-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  margin-top: 3rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .plp-pagination {
    margin-top: 5rem;
    gap: 0.5rem;
  }
}

.page-item {
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: var(--dp-ash);
  background: transparent;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-item:hover:not(:disabled) {
  color: var(--dp-charcoal);
  background-color: rgba(0, 0, 0, 0.03);
}

.page-item.active {
  background-color: var(--dp-gold);
  color: var(--dp-white);
  font-weight: 600;
}

.page-item:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-arrow {
  color: var(--dp-charcoal);
}

.page-ellipsis {
  color: var(--dp-ash);
  padding: 0 0.25rem;
  font-size: 0.875rem;
  user-select: none;
}
</style>
