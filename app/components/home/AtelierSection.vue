<script setup lang="ts">
import Container from '../ui/Container.vue'
import BaseImage from '../ui/BaseImage.vue'
import { ArrowRight } from 'lucide-vue-next'
</script>

<template>
  <section class="as-section">
    <Container>
      <div class="as-layout">
        <!-- Large Image (Left) -->
        <div class="as-image-large">
          <BaseImage
            src="/images/kitchen.jpeg"
            alt="Artisan au travail"
            class="as-image"
          />
        </div>

        <!-- Text Block (Center) -->
        <div class="as-text-content">
          <span class="as-subtitle">L'ATELIER</span>
          
          <h2 class="as-title">
            Un savoir-faire<br>
            au service de <span class="as-title-highlight">l'exception.</span>
          </h2>
          
          <p class="as-description">
            Depuis notre atelier, chaque création naît de l'équilibre entre tradition artisanale et design contemporain. Nous sélectionnons les plus beaux matériaux et collaborons avec des artisans d'exception pour donner vie à des pièces uniques, durables et intemporelles.
          </p>
          
          <NuxtLink to="/about" class="as-link">
            Découvrir notre histoire
            <ArrowRight class="as-link-icon" />
          </NuxtLink>
        </div>

        <!-- Small Image (Right) -->
        <div class="as-image-small">
          <BaseImage
            src="/images/collection-lighting.png"
            alt="Détail de finition"
            class="as-image"
          />
        </div>
      </div>
    </Container>
  </section>
</template>

<style scoped>
.as-section {
  padding-top: var(--space-24);
  padding-bottom: var(--space-24);
  background-color: var(--dp-bg-alt);
  overflow: hidden;
}

.as-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
  align-items: center;
}

@media (min-width: 1024px) {
  .as-layout {
    grid-template-columns: repeat(12, 1fr);
    gap: var(--space-12);
  }
}

.as-image-large {
  position: relative;
  width: 100%;
  height: 400px;
}

@media (min-width: 768px) {
  .as-image-large {
    height: 600px;
  }
}

@media (min-width: 1024px) {
  .as-image-large {
    grid-column: span 5;
  }
}

.as-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.as-text-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: var(--space-4);
  padding-right: var(--space-4);
}

@media (min-width: 1024px) {
  .as-text-content {
    grid-column: span 4;
    padding-left: var(--space-8);
    padding-right: var(--space-8);
  }
}

.as-subtitle {
  display: block;
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--dp-charcoal);
  margin-bottom: var(--space-6);
}

.as-title {
  font-size: 2.25rem;
  font-weight: 300;
  color: var(--dp-charcoal);
  line-height: 1.1;
  letter-spacing: -0.025em;
  margin-top: 0;
  margin-bottom: var(--space-8);
}

@media (min-width: 1024px) {
  .as-title {
    font-size: 2.75rem;
  }
}

.as-title-highlight {
  color: #8B7355;
  font-style: italic;
}

.as-description {
  font-size: 0.875rem;
  color: rgba(26, 25, 22, 0.8);
  line-height: 1.625;
  margin-top: 0;
  margin-bottom: var(--space-10);
}

.as-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  font-family: var(--font-body);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #8B7355;
  text-decoration: none;
  transition: color 0.3s ease;
}

.as-link:hover {
  color: var(--dp-charcoal);
}

.as-link-icon {
  width: 1rem;
  height: 1rem;
  transition: transform 0.3s ease;
}

.as-link:hover .as-link-icon {
  transform: translateX(4px);
}

.as-image-small {
  position: relative;
  width: 100%;
  height: 300px;
  margin-top: var(--space-12);
}

@media (min-width: 768px) {
  .as-image-small {
    height: 500px;
  }
}

@media (min-width: 1024px) {
  .as-image-small {
    grid-column: span 3;
    margin-top: 0;
  }
}
</style>
