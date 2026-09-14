<script setup lang="ts">
import Container from '../ui/Container.vue'
import ProductCard from '../product/ProductCard.vue'
import { useProducts } from '~/composables/useProducts'
import { ArrowRight } from 'lucide-vue-next'

const { newest } = useProducts()
</script>

<template>
  <section class="na-section">
    <Container>
      <!-- Header row -->
      <div class="na-header">
        <h2 class="na-title">NOUVEAUTÉS</h2>
        
        <NuxtLink to="/collections/nouveautes" class="na-link">
          Voir toutes les nouveautés
          <ArrowRight class="na-link-icon" />
        </NuxtLink>
      </div>

      <!-- Products Grid -->
      <div class="na-grid">
        <ProductCard
          v-for="product in newest.slice(0, 4)"
          :key="product.id"
          :product="product"
        />
      </div>
    </Container>
  </section>
</template>

<style scoped>
.na-section {
  padding-top: var(--space-24);
  padding-bottom: var(--space-24);
  background-color: var(--dp-bg-alt);
}

.na-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  border-bottom: 1px solid rgba(26, 25, 22, 0.1);
  padding-bottom: var(--space-6);
  margin-bottom: var(--space-12);
}

@media (min-width: 640px) {
  .na-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.na-title {
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--dp-charcoal);
  margin: 0;
}

.na-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  font-family: var(--font-body);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(26, 25, 22, 0.7);
  text-decoration: none;
  transition: color 0.3s ease;
}

.na-link:hover {
  color: var(--dp-charcoal);
}

.na-link-icon {
  width: 1rem;
  height: 1rem;
  transition: transform 0.3s ease;
}

.na-link:hover .na-link-icon {
  transform: translateX(4px);
}

.na-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

@media (min-width: 640px) {
  .na-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .na-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
