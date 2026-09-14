<script setup lang="ts">
import { useSeo, useBreadcrumbs } from '~/composables/useSeo'
import Container from '~/components/ui/Container.vue'
import BaseImage from '~/components/ui/BaseImage.vue'

useSeo({
  title: 'La Maison',
  description: 'L\'histoire de Desact Plus, éditeur de mobilier haut de gamme et studio de design d\'intérieur.',
})

useBreadcrumbs([
  { label: 'La Maison', href: '/about' },
])
</script>

<template>
  <div class="about-page">
    <!-- Hero -->
    <section class="about-hero">
      <BaseImage
        src="/images/kitchen.jpeg"
        alt="L'Atelier Desact Plus"
        class="about-hero-image"
        loading="eager"
      />
      <div class="about-hero-overlay" />
      <div class="about-hero-content">
        <h1 class="about-hero-title">La Maison</h1>
        <p class="about-hero-subtitle">L'Art de Vivre Contemporain</p>
      </div>
    </section>

    <Container class="about-container">
      <div class="about-intro">
        <h2 class="about-intro-title">
          « Nous concevons du mobilier qui traverse le temps, où chaque détail raconte une histoire de passion et d'exigence. »
        </h2>
        <p class="about-intro-text">
          Né de la volonté d'offrir une alternative locale au mobilier de luxe importé, Desact Plus s'impose aujourd'hui comme une référence dans l'édition de meubles et l'aménagement d'intérieur au Maroc.
        </p>
      </div>

      <div class="about-grid mb-large">
        <div class="about-text-content about-text-left">
          <span class="about-badge">Savoir-Faire</span>
          <h3 class="about-section-title">Artisanat & Innovation</h3>
          <p class="about-section-text">
            Notre atelier regroupe des maîtres artisans exceptionnels (ébénistes, tapissiers, ferronniers) qui collaborent étroitement avec notre studio de design. Cette synergie permet d'allier des techniques ancestrales aux outils de production les plus modernes.
          </p>
        </div>
        <div class="about-image-wrapper about-image-right">
          <BaseImage src="/images/collection-salon.png" alt="Savoir faire" class="about-section-image" />
        </div>
      </div>

      <div class="about-grid">
        <div class="about-image-wrapper">
          <BaseImage src="/images/bathrom.jpeg" alt="Matériaux" class="about-section-image" />
        </div>
        <div class="about-text-content">
          <span class="about-badge">Matériaux</span>
          <h3 class="about-section-title">La noblesse de la matière</h3>
          <p class="about-section-text">
            Marbre de Carrare, noyer massif américain, laiton brossé et tissus européens de haute facture... Nous parcourons le monde pour sélectionner les matériaux les plus nobles. Chaque pièce sélectionnée doit répondre à nos critères stricts d'esthétique, de durabilité et d'éthique.
          </p>
        </div>
      </div>
    </Container>
  </div>
</template>

<style scoped>
.about-page {
  background-color: var(--dp-white);
}

.about-hero {
  position: relative;
  height: 60vh;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.about-hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.about-hero-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(26, 25, 22, 0.5); /* dp-black with opacity */
}

.about-hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  color: var(--dp-white);
}

.about-hero-title {
  font-size: 3rem;
  font-weight: 300;
  margin-bottom: var(--space-4);
  margin-top: 0;
}

@media (min-width: 768px) {
  .about-hero-title {
    font-size: 4.5rem;
  }
}

.about-hero-subtitle {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--dp-gold);
  margin: 0;
}

@media (min-width: 768px) {
  .about-hero-subtitle {
    font-size: 1rem;
  }
}

.about-container {
  padding-top: var(--space-24);
  padding-bottom: var(--space-24);
}

.about-intro {
  max-width: 48rem; /* 3xl */
  margin: 0 auto;
  text-align: center;
  margin-bottom: var(--space-24);
}

.about-intro-title {
  font-size: 1.875rem;
  color: var(--dp-charcoal);
  line-height: 1.25;
  margin-top: 0;
  margin-bottom: var(--space-8);
}

@media (min-width: 768px) {
  .about-intro-title {
    font-size: 2.25rem;
  }
}

.about-intro-text {
  color: var(--dp-ash);
  font-size: 1.125rem;
  line-height: 1.625;
  margin: 0;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-16);
  align-items: center;
}

@media (min-width: 768px) {
  .about-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.mb-large {
  margin-bottom: var(--space-24);
}

.about-text-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.about-text-left {
  order: 2;
}

@media (min-width: 768px) {
  .about-text-left {
    order: 1;
  }
}

.about-image-right {
  order: 1;
}

@media (min-width: 768px) {
  .about-image-right {
    order: 2;
  }
}

.about-badge {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--dp-gold);
}

.about-section-title {
  font-size: 1.875rem;
  color: var(--dp-charcoal);
  margin: 0;
}

.about-section-text {
  color: var(--dp-ash);
  line-height: 1.625;
  margin: 0;
}

.about-image-wrapper {
  width: 100%;
}

.about-section-image {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  border-radius: 2px;
}
</style>
