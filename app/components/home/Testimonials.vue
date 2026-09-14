<script setup lang="ts">
import Container from '../ui/Container.vue'
import BaseImage from '../ui/BaseImage.vue'
import { ArrowRight, ArrowLeft } from 'lucide-vue-next'
</script>

<template>
  <section class="tst-section">
    <Container>
      <div class="tst-grid">
        
        <!-- Image Side -->
        <div class="tst-image-side">
          <div class="tst-image-wrapper">
            <BaseImage
              src="/images/hero-living-room.jpg"
              alt="Intérieur élégant"
              class="tst-image"
            />
          </div>
          <div class="tst-image-caption">
            <span>Projet Résidentiel</span>
            <span class="tst-divider"></span>
            <span>Casablanca, 2023</span>
          </div>
        </div>

        <!-- Content Side -->
        <div class="tst-content-side">
          <div class="tst-badge">TÉMOIGNAGES</div>
          
          <h2 class="tst-quote">
            &ldquo;Chaque pièce choisie a transformé notre maison en un véritable sanctuaire de paix et d'élégance. Un service irréprochable.&rdquo;
          </h2>
          
          <div class="tst-footer">
            <div class="tst-author">
              <span class="tst-author-name">Amélie & Youssef B.</span>
              <span class="tst-author-role">Clients Studio</span>
            </div>
            
            <div class="tst-nav">
              <button class="tst-nav-btn" aria-label="Précédent">
                <ArrowLeft class="tst-nav-icon" />
              </button>
              <button class="tst-nav-btn" aria-label="Suivant">
                <ArrowRight class="tst-nav-icon" />
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </Container>
  </section>
</template>

<style scoped>
.tst-section {
  padding-top: var(--space-24);
  padding-bottom: var(--space-24);
  background-color: var(--dp-white);
  overflow: hidden;
}

.tst-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-12);
  align-items: center;
}

@media (min-width: 1024px) {
  .tst-grid {
    grid-template-columns: 5fr 7fr;
    gap: var(--space-24);
  }
}

/* Image Side */
.tst-image-side {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.tst-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  border-radius: 4px;
  overflow: hidden;
  background-color: #f3f4f6;
}

.tst-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tst-image-caption {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.tst-divider {
  width: 1rem;
  height: 1px;
  background-color: #d1d5db;
}

/* Content Side */
.tst-content-side {
  display: flex;
  flex-direction: column;
  padding-top: var(--space-8);
}

@media (min-width: 1024px) {
  .tst-content-side {
    padding-top: 0;
    padding-right: var(--space-12);
  }
}

.tst-badge {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--dp-gold);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: var(--space-8);
}

.tst-quote {
  font-size: 2rem;
  font-weight: 300;
  color: var(--dp-charcoal);
  line-height: 1.3;
  margin-top: 0;
  margin-bottom: var(--space-12);
}

@media (min-width: 768px) {
  .tst-quote {
    font-size: 2.75rem;
  }
}

@media (min-width: 1280px) {
  .tst-quote {
    font-size: 3.5rem;
    line-height: 1.2;
  }
}

.tst-footer {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

@media (min-width: 768px) {
  .tst-footer {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

.tst-author {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.tst-author-name {
  font-size: 1.25rem;
  font-weight: 400;
  color: var(--dp-charcoal);
}

.tst-author-role {
  font-size: 0.875rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.tst-nav {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.tst-nav-btn {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dp-charcoal);
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.tst-nav-btn:hover {
  border-color: var(--dp-charcoal);
  background-color: var(--dp-charcoal);
  color: var(--dp-white);
}

.tst-nav-icon {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.3s ease;
}

.tst-nav-btn:hover:first-child .tst-nav-icon {
  transform: translateX(-2px);
}

.tst-nav-btn:hover:last-child .tst-nav-icon {
  transform: translateX(2px);
}
</style>
