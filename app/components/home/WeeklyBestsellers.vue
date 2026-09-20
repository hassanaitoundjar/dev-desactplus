<script setup lang="ts">
import { ref, computed } from 'vue'
import Container from '../ui/Container.vue'
import ProductCard from '../product/ProductCard.vue'
import { useProducts } from '~/composables/useProducts'
import { useCategories } from '~/composables/useCategories'

const { products: allProducts } = useProducts()
const { categories: apiCategories } = useCategories()

const categories = computed(() => {
  const list = [{ id: 'all', label: 'Tous' }]
  if (apiCategories.value) {
    list.push(...apiCategories.value.map(cat => ({
      id: cat.id,
      label: cat.name
    })))
  }
  return list
})

const showAllCategories = ref(false)

const visibleCategories = computed(() => {
  if (showAllCategories.value) {
    return categories.value
  }
  return categories.value.slice(0, 6)
})

const activeCategory = ref('all')

const filteredProducts = computed(() => {
  let list = allProducts.value || []
  if (activeCategory.value !== 'all') {
    list = list.filter(p => p.categoryId === activeCategory.value || p.categoryIds?.includes(activeCategory.value))
  }
  // Let's just limit to 10 for the grid display (5 columns x 2 rows)
  return list.slice(0, 10)
})

function setCategory(id: string) {
  activeCategory.value = id
}
</script>

<template>
  <section class="weekly-bestsellers">
    <Container>
      <div class="header-row">
        <h2 class="title">Weekly bestsellers</h2>
        <div class="filters">
          <button 
            v-for="cat in visibleCategories" 
            :key="cat.id" 
            :class="['filter-btn', 'font-body', { active: activeCategory === cat.id }]"
            @click="setCategory(cat.id)"
          >
            {{ cat.label }}
          </button>
          
          <button 
            v-if="categories.length > 6"
            @click="showAllCategories = !showAllCategories" 
            class="filter-btn font-body see-more-link" 
            style="display: inline-flex; align-items: center; gap: 4px;"
          >
            {{ showAllCategories ? 'Voir moins' : 'Voir plus' }}
            <svg v-if="!showAllCategories" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <div class="products-grid">
        <ProductCard 
          v-for="product in filteredProducts" 
          :key="product.id" 
          :product="product"
        />
      </div>
    </Container>
  </section>
</template>

<style scoped>
.weekly-bestsellers {
  padding: var(--space-20) 0;
  /* background-color: var(--dp-ivory); */
}

.header-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-6);
  margin-bottom: var(--space-10);
}

@media (min-width: 768px) {
  .header-row {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.title {
  font-size: 2rem;
  font-weight: 500;
  color: var(--dp-charcoal);
  margin: 0;
}

@media (max-width: 768.98px) {
    .title {
        font-size: 22px;
    }
}

.filters {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: var(--space-4);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  padding-bottom: 4px; /* Space for focus rings */
  width: 100%;
}
.filters::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

@media (min-width: 768px) {
  .filters {
    flex-wrap: wrap;
    overflow-x: visible;
    width: auto;
  }
}

.filter-btn {
  background: transparent;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  color: #888;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.filter-btn:hover {
  color: var(--dp-charcoal);
}

.filter-btn.active {
  color: var(--dp-charcoal);
  font-weight: 600;
  border-bottom: 2px solid #f38d53;
}

/* Product Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem; /* Explicitly 1.5rem in case variable is failing */
}

@media (min-width: 480px) {
  .products-grid {
    gap: 2rem;
  }
}

@media (min-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-8);
  }
}

@media (min-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 2.5rem;
  }
}

@media (min-width: 1280px) {
  .products-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
