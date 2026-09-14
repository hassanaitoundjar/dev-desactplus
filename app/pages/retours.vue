<script setup lang="ts">

import Container from '~/components/ui/Container.vue'
import SectionHeading from '~/components/ui/SectionHeading.vue'

</script>

<template>
  <div class="legal-page">
    <Container narrow>
      <SectionHeading title="Retours & Échanges" eyebrow="Politique" align="center" />
      <div class="legal-content">
        <p class="legal-text">Nous souhaitons que vous soyez entièrement satisfait de votre achat. Si ce n'est pas le cas, voici les conditions de retour.</p>
        <h3 class="legal-title">Délai de retour</h3>
        <p class="legal-text">Vous disposez de 14 jours après réception pour retourner un article standard dans son état d'origine.</p>
        <h3 class="legal-title">Articles sur mesure</h3>
        <p class="legal-text">Les pièces fabriquées sur mesure ne sont pas éligibles au retour, sauf en cas de défaut de fabrication.</p>
        <h3 class="legal-title">Procédure</h3>
        <p class="legal-text">Contactez notre service client pour initier un retour. Nous organisons la collecte à domicile.</p>
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
