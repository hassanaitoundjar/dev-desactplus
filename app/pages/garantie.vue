<script setup lang="ts">

import Container from '~/components/ui/Container.vue'
import SectionHeading from '~/components/ui/SectionHeading.vue'

</script>

<template>
  <div class="legal-page">
    <Container narrow>
      <SectionHeading title="Garantie" eyebrow="Notre Engagement" align="center" />
      <div class="legal-content">
        <p class="legal-text">Tous nos produits bénéficient d'une garantie contre les défauts de fabrication.</p>
        <h3 class="legal-title">Garantie structure : 5 ans</h3>
        <p class="legal-text">La structure de chaque meuble est garantie 5 ans contre tout défaut de fabrication dans des conditions normales d'utilisation.</p>
        <h3 class="legal-title">Garantie revêtements : 2 ans</h3>
        <p class="legal-text">Les tissus, cuirs et finitions sont garantis 2 ans contre les défauts de fabrication.</p>
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
