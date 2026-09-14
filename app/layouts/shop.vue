<script setup lang="ts">
import LayoutHeader from '~/components/layout/Header.vue'
import LayoutFooter from '~/components/layout/Footer.vue'
import SearchOverlay from '~/components/layout/SearchOverlay.vue'
</script>

<template>
  <div class="layout-shop">
    <LayoutHeader />
    <main class="layout-main">
      <slot />
    </main>
    <LayoutFooter />
    <SearchOverlay />
  </div>
</template>

<style scoped>
.layout-shop {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--dp-white);
}

.layout-main {
  flex: 1 1 0%;
}
</style>
