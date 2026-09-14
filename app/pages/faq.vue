<script setup lang="ts">

import Container from '~/components/ui/Container.vue'
import SectionHeading from '~/components/ui/SectionHeading.vue'
import { ref } from 'vue'


const faqs = [
  { q: 'Quels sont vos délais de livraison ?', a: 'Les délais varient selon les produits. Les articles en stock sont livrés sous 5 à 10 jours ouvrés. Les pièces sur mesure nécessitent 6 à 12 semaines de fabrication.' },
  { q: 'Proposez-vous la livraison et l\'installation ?', a: 'Oui, nous offrons un service de livraison et d\'installation à domicile dans tout le Maroc. Nos équipes installent chaque pièce avec soin.' },
  { q: 'Puis-je personnaliser un produit ?', a: 'Absolument. La personnalisation est au cœur de notre démarche. Contactez notre studio pour discuter de vos envies en termes de matériaux, dimensions et finitions.' },
  { q: 'Quelle est votre politique de retour ?', a: 'Nous acceptons les retours sous 14 jours pour les articles standards, dans leur état d\'origine. Les pièces sur mesure ne sont pas éligibles au retour.' },
]

const openIndex = ref<number | null>(null)
function toggle(i: number) { openIndex.value = openIndex.value === i ? null : i }
</script>

<template>
  <div class="faq-page">
    <Container narrow>
      <SectionHeading title="Foire aux Questions" eyebrow="FAQ" align="center" />
      <div class="faq-list">
        <div v-for="(faq, i) in faqs" :key="i" class="faq-item">
          <button class="faq-question-btn" @click="toggle(i)">
            <span class="faq-question-text">{{ faq.q }}</span>
            <span class="faq-icon" :class="{ 'is-open': openIndex === i }">+</span>
          </button>
          <div class="faq-answer-wrapper" :style="{ maxHeight: openIndex === i ? '200px' : '0' }">
            <p class="faq-answer-text">{{ faq.a }}</p>
          </div>
        </div>
      </div>
    </Container>
  </div>
</template>

<style scoped>
.faq-page {
  padding-top: var(--space-24);
  padding-bottom: var(--space-24);
  background-color: var(--dp-white);
}

.faq-list {
  max-width: 48rem;
  margin: 0 auto;
}

.faq-item {
  border-bottom: 1px solid var(--dp-sand);
}

.faq-question-btn {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-6) 0;
  text-align: left;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.faq-question-text {
  font-size: 1.25rem;
  color: var(--dp-charcoal);
  padding-right: var(--space-8);
}

.faq-icon {
  color: var(--dp-ash);
  font-size: 1.5rem;
  line-height: 1;
  transition: transform 0.3s ease;
}

.faq-icon.is-open {
  transform: rotate(45deg);
}

.faq-answer-wrapper {
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.faq-answer-text {
  padding-bottom: var(--space-6);
  color: var(--dp-ash);
  line-height: 1.625;
  margin: 0;
}
</style>
