<script setup lang="ts">
interface Props {
  width?: string
  height?: string
  rounded?: boolean
}

withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '200px',
  rounded: false,
})
</script>

<template>
  <div
    class="skeleton-loader"
    :class="{ 'skeleton-rounded': rounded }"
    :style="{ width, height }"
  />
</template>

<style scoped>
.skeleton-loader {
  background: linear-gradient(90deg, #F9F9F8 0px, #E5E5E5 50%, #F9F9F8 100%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite linear;
}

.skeleton-rounded {
  border-radius: 9999px; /* rounded-full */
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}
</style>
