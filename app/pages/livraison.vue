<script setup lang="ts">

import Container from '~/components/ui/Container.vue'
import SectionHeading from '~/components/ui/SectionHeading.vue'

</script>

<template>
  <div class="legal-page">
    <Container narrow>
      <SectionHeading title="Livraison" eyebrow="Informations" align="center" />
      <div class="legal-content">
        <h3 class="legal-title">Livraison standard</h3>
        <p class="legal-text">Nous livrons dans tout le Maroc sous 5 à 10 jours ouvrés pour les articles en stock. La livraison est offerte pour toute commande supérieure à 5 000 MAD.</p>
        <h3 class="legal-title">Livraison sur mesure</h3>
        <p class="legal-text">Les pièces fabriquées sur mesure sont livrées sous 6 à 12 semaines. Un conseiller vous accompagne tout au long du processus.</p>
        <h3 class="legal-title">Installation</h3>
        <p class="legal-text">Notre équipe assure l'installation et la mise en place de chaque pièce dans votre intérieur, avec le plus grand soin.</p>
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
}

.legal-title {
  font-size: 1.5rem;
  color: var(--dp-charcoal);
  margin-top: var(--space-8);
  margin-bottom: var(--space-4);
}

.legal-text {
  margin: 0 0 var(--space-6) 0;
}
</style>
