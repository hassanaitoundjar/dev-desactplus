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
            v-for="cat in categories" 
            :key="cat.id" 
            :class="['filter-btn', 'font-body', { active: activeCategory === cat.id }]"
            @click="setCategory(cat.id)"
          >
            {{ cat.label }}
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
  background-color: #F9F8F6;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
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
