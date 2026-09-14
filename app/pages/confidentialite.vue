<script setup lang="ts">

import Container from '~/components/ui/Container.vue'
import SectionHeading from '~/components/ui/SectionHeading.vue'

</script>

<template>
  <div class="legal-page">
    <Container narrow>
      <SectionHeading title="Politique de Confidentialité" align="center" />
      <div class="legal-content">
        <h3 class="legal-title">Collecte des données</h3>
        <p class="legal-text">Nous collectons uniquement les données nécessaires au traitement de vos commandes et à l'amélioration de nos services.</p>
        <h3 class="legal-title">Utilisation</h3>
        <p class="legal-text">Vos données personnelles ne sont jamais vendues à des tiers. Elles sont utilisées exclusivement pour la gestion de vos commandes et communications.</p>
        <h3 class="legal-title">Cookies</h3>
        <p class="legal-text">Ce site utilise des cookies fonctionnels pour améliorer votre expérience de navigation.</p>
        <h3 class="legal-title">Vos droits</h3>
        <p class="legal-text">Conformément à la loi 09-08, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Contactez-nous à contact@desactplus.com.</p>
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
