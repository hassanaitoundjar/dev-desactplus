<script setup lang="ts">
import Container from '../ui/Container.vue'
import { useCategories } from '~/composables/useCategories'

const { categories } = useCategories()
</script>

<template>
  <section class="category-list-section">
    <Container>
      <div class="category-list-header">
        <h2 class="cl-title">Our categories</h2>
        <p class="cl-desc">Lots of new products and product collections</p>
      </div>

      <div class="cl-grid">
        <NuxtLink 
          v-for="cat in categories" 
          :key="cat.slug"
          :to="`/products?category=${cat.id}`"
          class="cl-card"
        >
          <img :src="cat.image" :alt="cat.name" class="cl-image" loading="lazy" />
          <div class="cl-pill">{{ cat.name }}</div>
        </NuxtLink>
      </div>
    </Container>
  </section>
</template>

<style scoped>
.category-list-section {
  padding-top: 5rem;
  padding-bottom: 5rem;
  background-color: var(--dp-white);
}

.category-list-header {
  margin-bottom: 3rem;
  text-align: left;
}

.cl-title {
  font-family: var(--font-body);
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--dp-charcoal);
  margin: 0 0 0.5rem 0;
}

.cl-desc {
  font-size: 0.875rem;
  color: var(--dp-ash);
  margin: 0;
  font-family: var(--font-body);
}

.cl-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .cl-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}

@media (min-width: 1024px) {
  .cl-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 2rem;
  }
}

.cl-card {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  overflow: hidden;
  text-decoration: none;
  background-color: #E6E2DB; /* placeholder color */
}

.cl-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.cl-card:hover .cl-image {
  transform: scale(1.05);
}

.cl-pill {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--dp-white);
  color: var(--dp-charcoal);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.5rem 1.25rem;
  border-radius: 2rem;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: background-color 0.2s ease, color 0.2s ease;
}

.cl-card:hover .cl-pill {
  background-color: var(--dp-charcoal);
  color: var(--dp-white);
}
</style>
