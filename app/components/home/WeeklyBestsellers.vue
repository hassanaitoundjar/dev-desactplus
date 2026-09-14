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
  background-color:  #F9F8F6;
;
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

@media (min-width: 768px) {
  .title {
    font-size: 2.5rem;
  }
}

.filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4);
}

.filter-btn {
  background: transparent;
  border: none;
  font-size: 0.875rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem 0;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
  font-weight: 500;
}

.filter-btn:hover {
  color: var(--dp-charcoal);
}

.filter-btn.active {
  color: var(--dp-charcoal);
  border-bottom-color: var(--dp-charcoal);
}

/* 5 Column Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--space-6);
}

@media (min-width: 480px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
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
