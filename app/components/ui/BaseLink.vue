<script setup lang="ts">
interface Props {
  to: string
  external?: boolean
}

withDefaults(defineProps<Props>(), {
  external: false,
})
</script>

<template>
  <a v-if="external" :href="to" target="_blank" rel="noopener noreferrer" class="base-link">
    <slot />
  </a>
  <NuxtLink v-else :to="to" class="base-link">
    <slot />
  </NuxtLink>
</template>

<style scoped>
.base-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  transition: color 0.2s, background-color 0.2s, border-color 0.2s;
}
</style>
