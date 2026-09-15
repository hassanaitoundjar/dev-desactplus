<script setup>
import { onMounted } from 'vue'
import { useCart } from '~/composables/useCart'

const { syncCart } = useCart()

onMounted(() => {
  syncCart()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
