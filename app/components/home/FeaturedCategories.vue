<script setup lang="ts">
import Container from '../ui/Container.vue'
import BaseImage from '../ui/BaseImage.vue'
import { useCategories } from '~/composables/useCategories'
import { ArrowRight } from 'lucide-vue-next'
const { featured } = useCategories()

</script>

<template>
  <section class="fc-section">
    <Container>
      <div class="fc-layout">
        
        <!-- Text Column -->
        <div class="fc-text-column">
          <span class="fc-subtitle">COLLECTIONS</span>
          <h2 class="fc-title">
            Des univers,<br>une signature.
          </h2>
          <span class="fc-divider"/>
          <NuxtLink to="/collections" class="fc-link">
            Voir toutes les collections
            <ArrowRight class="fc-link-icon" />
          </NuxtLink>
        </div>

        <!-- Cards Grid -->
        <div class="fc-cards-column">
          <div class="fc-grid">
            <NuxtLink
              v-for="category in featured"
              :key="category.id"
              :to="`/categories/${category.slug}`"
              class="fc-card"
            >
              <div class="fc-card-overlay" />
              <BaseImage
                :src="category.image"
                :alt="category.name"
                class="fc-card-image"
              />
              <div class="fc-card-content">
                <h3 class="fc-card-title">{{ category.name }}</h3>
                <span class="fc-card-action">
                  Découvrir
                </span>
              </div>
            </NuxtLink>
          </div>
        </div>
        
      </div>
    </Container>
  </section>
</template>

<style scoped>
.fc-section {
  padding-top: var(--space-24);
  padding-bottom: var(--space-24);
  background-color: var(--dp-bg-light);
}

.fc-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-12);
}

@media (min-width: 1024px) {
  .fc-layout {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-8);
  }
}

.fc-text-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

@media (min-width: 1024px) {
  .fc-text-column {
    grid-column: span 1;
  }
}

.fc-subtitle {
  display: block;
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: rgba(26, 25, 22, 0.6);
  margin-bottom: var(--space-6);
}

.fc-title {
  font-size: 2.25rem;
  font-weight: 300;
  color: var(--dp-charcoal);
  line-height: 1.1;
  letter-spacing: -0.025em;
  margin-bottom: var(--space-8);
  margin-top: 0;
}

@media (min-width: 768px) {
  .fc-title { font-size: 3rem; }
}

@media (min-width: 1024px) {
  .fc-title { font-size: 2.75rem; }
}

.fc-divider {
  display: block;
  width: 2.5rem;
  height: 1px;
  background-color: rgba(139, 115, 85, 0.4);
  margin-bottom: var(--space-8);
}

.fc-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #8B7355;
  text-decoration: none;
  transition: color 0.3s ease;
}

.fc-link:hover {
  color: #6a563f;
}

.fc-link-icon {
  width: 1rem;
  height: 1rem;
  transition: transform 0.3s ease;
}

.fc-link:hover .fc-link-icon {
  transform: translateX(4px);
}

.fc-cards-column {
}

@media (min-width: 1024px) {
  .fc-cards-column {
    grid-column: span 3;
  }
}

.fc-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

@media (min-width: 640px) {
  .fc-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1280px) {
  .fc-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.fc-card {
  position: relative;
  display: block;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background-color: var(--dp-charcoal);
  text-decoration: none;
}

@media (min-width: 640px) {
  .fc-card {
    aspect-ratio: 1 / 1;
  }
}

.fc-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(26, 25, 22, 0.8), transparent, transparent);
  z-index: var(--z-content);
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.fc-card:hover .fc-card-overlay {
  opacity: 0.9;
}

.fc-card-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.5s ease-out;
  opacity: 0.9;
}

.fc-card:hover .fc-card-image {
  transform: scale(1.05);
}

.fc-card-content {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: var(--space-6);
  z-index: var(--z-overlay);
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .fc-card-content {
    padding: var(--space-8);
  }
}

.fc-card-title {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--dp-white);
  margin-top: 0;
  margin-bottom: var(--space-2);
}

@media (min-width: 768px) {
  .fc-card-title {
    font-size: 1rem;
  }
}

.fc-card-action {
  font-family: var(--font-body);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-color: rgba(255, 255, 255, 0.3);
  transition: color 0.3s ease;
}

.fc-card:hover .fc-card-action {
  color: var(--dp-white);
}
</style>
