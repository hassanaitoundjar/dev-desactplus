<script setup lang="ts">
import Container from '../ui/Container.vue'
import BaseImage from '../ui/BaseImage.vue'
import { ArrowRight, ArrowLeft } from 'lucide-vue-next'
import { useProjects } from '~/composables/useProjects'
import { ref } from 'vue'

const { featured } = useProjects()
const scrollContainer = ref<HTMLElement | null>(null)

const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: -400, behavior: 'smooth' })
  }
}

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: 400, behavior: 'smooth' })
  }
}
</script>

<template>
  <section class="fp-section">
    <Container>
      <div class="fp-layout">
        
        <!-- Text Column -->
        <div class="fp-text-column">
          <span class="fp-subtitle">PROJETS D'EXCEPTION</span>
          <h2 class="fp-title">
            Des réalisations<br/>uniques.
          </h2>
          <NuxtLink to="/projects" class="fp-link">
            Voir tous les projets
            <ArrowRight class="fp-link-icon" />
          </NuxtLink>
        </div>

        <!-- Horizontal Projects Scroll -->
        <div class="fp-scroll-container">
          <div 
            ref="scrollContainer" 
            class="fp-scroll-area hide-scrollbar"
          >
            <NuxtLink
              v-for="project in featured"
              :key="project.id"
              :to="`/projects/${project.slug}`"
              class="fp-card"
            >
              <div class="fp-image-wrapper">
                <BaseImage
                  :src="project.images[0]"
                  :alt="project.title"
                  class="fp-card-image"
                />
              </div>
              
              <div class="fp-card-content">
                <h3 class="fp-card-title">{{ project.title }}</h3>
                <p class="fp-card-location">{{ project.location }}</p>
                <span class="fp-card-action">
                  Découvrir le projet
                </span>
              </div>
            </NuxtLink>
          </div>
          
          <!-- Navigation Arrows -->
          <div class="fp-nav">
            <button @click="scrollLeft" class="fp-nav-btn">
              <ArrowLeft class="fp-nav-icon" />
            </button>
            <button @click="scrollRight" class="fp-nav-btn">
              <ArrowRight class="fp-nav-icon" />
            </button>
          </div>
        </div>
        
      </div>
    </Container>
  </section>
</template>

<style scoped>
.fp-section {
  padding-top: var(--space-24);
  padding-bottom: var(--space-24);
  background-color: var(--dp-bg-alt);
}

.fp-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-12);
}

@media (min-width: 1024px) {
  .fp-layout {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-8);
  }
}

.fp-text-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

@media (min-width: 1024px) {
  .fp-text-column {
    grid-column: span 1;
    padding-right: var(--space-8);
  }
}

.fp-subtitle {
  display: block;
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--dp-charcoal);
  margin-bottom: var(--space-6);
}

.fp-title {
  font-size: 2.25rem;
  font-weight: 300;
  color: var(--dp-charcoal);
  line-height: 1.1;
  letter-spacing: -0.025em;
  margin-top: 0;
  margin-bottom: var(--space-12);
}

@media (min-width: 768px) {
  .fp-title {
    font-size: 3rem;
  }
}

.fp-link {
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

.fp-link:hover {
  color: var(--dp-charcoal);
}

.fp-link-icon {
  width: 1rem;
  height: 1rem;
  transition: transform 0.3s ease;
}

.fp-link:hover .fp-link-icon {
  transform: translateX(4px);
}

.fp-scroll-container {
  position: relative;
}

@media (min-width: 1024px) {
  .fp-scroll-container {
    grid-column: span 3;
  }
}

.fp-scroll-area {
  display: flex;
  gap: var(--space-4);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: var(--space-6);
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.fp-card {
  position: relative;
  flex: none;
  width: 320px;
  scroll-snap-align: start;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

@media (min-width: 768px) {
  .fp-card {
    width: 450px;
  }
}

.fp-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background-color: #f3f4f6;
}

.fp-card-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.fp-card:hover .fp-card-image {
  transform: scale(1.05);
}

.fp-card-content {
  display: flex;
  flex-direction: column;
}

.fp-card-title {
  font-family: var(--font-heading);
  font-weight: 400;
  font-size: 1.25rem;
  color: var(--dp-charcoal);
  margin-top: 0;
  margin-bottom: var(--space-1);
}

@media (min-width: 768px) {
  .fp-card-title {
    font-size: 1.5rem;
  }
}

.fp-card-location {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0;
  margin-bottom: var(--space-4);
}

.fp-card-action {
  font-family: var(--font-body);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--dp-charcoal);
  text-decoration: underline;
  text-underline-offset: 4px;
  transition: color 0.3s ease;
  align-self: flex-start;
}

.fp-card:hover .fp-card-action {
  color: #000;
}

.fp-nav {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-top: var(--space-8);
}

@media (min-width: 1024px) {
  .fp-nav {
    position: absolute;
    right: -1rem;
    bottom: 50%;
    transform: translateY(50%) translateX(100%);
    flex-direction: column;
    margin-top: 0;
  }
}

.fp-nav-btn {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  border: 1px solid rgba(26, 25, 22, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dp-charcoal);
  background-color: transparent;
  cursor: pointer;
  transition: border-color 0.3s ease;
  padding: 0;
}

.fp-nav-btn:hover {
  border-color: var(--dp-charcoal);
}

.fp-nav-icon {
  width: 1rem;
  height: 1rem;
}
</style>
