<script setup lang="ts">

import Container from '~/components/ui/Container.vue'
import SectionHeading from '~/components/ui/SectionHeading.vue'

</script>

<template>
  <div class="legal-page">
    <Container narrow>
      <SectionHeading title="Mentions Légales" align="center" />
      <div class="legal-content">
        <h3 class="legal-title">Éditeur</h3>
        <p class="legal-text">Desact Plus SARL — Casablanca, Maroc</p>
        <h3 class="legal-title">Hébergement</h3>
        <p class="legal-text">Le site est hébergé par Vercel Inc.</p>
        <h3 class="legal-title">Propriété intellectuelle</h3>
        <p class="legal-text">L'ensemble du contenu de ce site (textes, images, design) est protégé par le droit d'auteur. Toute reproduction est interdite sans autorisation.</p>
      </div>
    </Container>
  </div>
</template>

<style scoped>
.legal-page {
  padding-top: var(--space-24);
  padding-bottom: var(--space-24);
  background-color: var(--dp-white);
}

.legal-content {
  max-width: 48rem;
  margin: 0 auto;
  color: var(--dp-ash);
  line-height: 1.625;
  font-size: 0.875rem;
}

.legal-title {
  font-size: 1.25rem;
  color: var(--dp-charcoal);
  margin-top: var(--space-8);
  margin-bottom: var(--space-4);
}

.legal-text {
  margin: 0 0 var(--space-4) 0;
}
</style>
