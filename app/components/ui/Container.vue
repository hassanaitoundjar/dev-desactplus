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
.container-site {
  box-sizing: border-box;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
}

@media (min-width: 640px) {
  .container-site {
    padding-left: 24px;
    padding-right: 24px;
  }
}

@media (min-width: 1024px) {
  .container-site {
    padding-left: 40px;
    padding-right: 40px;
  }
}

.container-narrow {
  max-width: 1200px;
}
</style>