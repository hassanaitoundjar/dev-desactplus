<script setup lang="ts">
interface Props {
  src: string
  alt: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  sizes?: string
  class?: string
}

withDefaults(defineProps<Props>(), {
  loading: 'lazy',
})
</script>

<template>
  <img
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="loading"
    :class="$props.class"
  >
</template>
