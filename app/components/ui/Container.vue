<script setup lang="ts">
interface Props {
  as?: string
  narrow?: boolean
}

withDefaults(defineProps<Props>(), {
  as: 'div',
  narrow: false,
})
</script>

<template>
  <component
    :is="as"
    class="container-site"
    :class="{ 'container-narrow': narrow }"
  >
    <slot />
  </component>
</template>

<style scoped>
.container-narrow {
  max-width: 1200px;
}
</style>
