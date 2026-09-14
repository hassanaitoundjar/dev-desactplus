<script setup lang="ts">
import LayoutHeader from '~/components/layout/Header.vue'
import LayoutFooter from '~/components/layout/Footer.vue'
import SearchOverlay from '~/components/layout/SearchOverlay.vue'
import NewsletterPopup from '~/components/ui/NewsletterPopup.vue'
</script>

<template>
  <div class="layout-default">
    <LayoutHeader />
    <main class="layout-main">
      <slot />
    </main>
    <LayoutFooter />
    <SearchOverlay />
    <NewsletterPopup />
  </div>
</template>

<style scoped>
.layout-default {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--dp-ivory);
}

.layout-main {
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
}
</style>
