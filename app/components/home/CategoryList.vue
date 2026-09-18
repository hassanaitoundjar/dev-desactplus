<script setup lang="ts">
import Container from '../ui/Container.vue'
import BaseButton from '../ui/BaseButton.vue'
import { useCategories } from '~/composables/useCategories'
import { ref } from 'vue'

const { categories } = useCategories()
const showAll = ref(false)
</script>

<template>
  <section class="category-list-section">
    <Container>
      <div class="category-list-header">
        <h2 class="cl-title">Our categories</h2>
        <p class="cl-desc">Lots of new products and product collections</p>
      </div>

      <div class="cl-grid" :class="{ 'show-all': showAll }">
        <NuxtLink 
          v-for="cat in categories" 
          :key="cat.slug"
          :to="`/products?category=${cat.id}`"
          class="cl-card"
        >
          <img :src="cat.image" :alt="cat.name" class="cl-image" loading="lazy" >
          <div class="cl-pill">{{ cat.name }}</div>
        </NuxtLink>
      </div>

      <div v-if="categories && categories.length > 6" class="cl-actions">
        <button class="btn-list" @click="showAll = !showAll">
          {{ showAll ? 'Show Less' : 'Show More' }}
        </button>
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

.btn-list {
  width: 50%;
  background-color: #f38d53;
  color: white;
  border: none;
  border-radius: 9999px;
  padding: 10px 16px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-list:hover {
  background-color: var(--dp-charcoal);
  color: var(--dp-white);
}

/* Hide items after 6th on mobile if not showing all */
@media (max-width: 639px) {
  .cl-grid:not(.show-all) .cl-card:nth-child(n+7) {
    display: none;
  }
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

.cl-actions {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .cl-actions {
    display: none;
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
