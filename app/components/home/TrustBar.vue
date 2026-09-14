<script setup lang="ts">
import { Truck, ShieldCheck, Award, Headset } from 'lucide-vue-next'
import Container from '../ui/Container.vue'
</script>

<template>
  <section class="trust-bar">
    <Container>
      <div class="trust-grid">
        <div class="trust-item">
          <Truck class="trust-icon" :size="28" stroke-width="1.25" />
          <div class="trust-text">
            <h3 class="trust-title">Livraison & Installation</h3>
            <p class="trust-desc">Partout en France et en Europe</p>
          </div>
        </div>
        
        <div class="trust-item">
          <ShieldCheck class="trust-icon" :size="28" stroke-width="1.25" />
          <div class="trust-text">
            <h3 class="trust-title">Paiement Sécurisé</h3>
            <p class="trust-desc">Transactions 100% sécurisées</p>
          </div>
        </div>
        
        <div class="trust-item">
          <Award class="trust-icon" :size="28" stroke-width="1.25" />
          <div class="trust-text">
            <h3 class="trust-title">Garantie 5 Ans</h3>
            <p class="trust-desc">Sur toutes nos collections</p>
          </div>
        </div>
        
        <div class="trust-item">
          <Headset class="trust-icon" :size="28" stroke-width="1.25" />
          <div class="trust-text">
            <h3 class="trust-title">Accompagnement Sur-Mesure</h3>
            <p class="trust-desc">Conseils et suivi personnalisé</p>
          </div>
        </div>
      </div>
    </Container>
  </section>
</template>

<style scoped>
.trust-bar {
  background-color: #F9F8F6;
  padding: 3rem 0;
  width: 100%;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.trust-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
}

@media (min-width: 640px) {
  .trust-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .trust-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: flex-start;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.trust-item:last-child {
  border-bottom: none;
}

@media (min-width: 640px) {
  .trust-item {
    padding: 1.25rem 1rem;
  }
  .trust-item:nth-child(even) {
    border-left: 1px solid rgba(0, 0, 0, 0.04);
  }
  .trust-item:nth-last-child(-n+2) {
    border-bottom: none;
  }
}

@media (min-width: 1024px) {
  .trust-item {
    justify-content: center;
    padding: 0 1.5rem;
    border-bottom: none;
    border-left: none;
    border-right: 1px solid rgba(0, 0, 0, 0.06);
  }
  .trust-item:nth-child(even) {
    border-left: none;
  }
  .trust-item:last-child {
    border-right: none;
  }
}

.trust-icon {
  color: var(--dp-charcoal);
  flex-shrink: 0;
}

.trust-text {
  display: flex;
  flex-direction: column;
}

.trust-title {
  font-size: 0.6875rem; /* 11px */
  font-weight: 600;
  text-transform: uppercase;
  color: var(--dp-charcoal);
  margin: 0 0 0.25rem 0;
  letter-spacing: 0.08em;
}

.trust-desc {
  font-size: 0.6875rem; /* 11px */
  color: #737373;
  margin: 0;
}
</style>
