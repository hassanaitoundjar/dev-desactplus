<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApiClient } from '~/api/apiClient'
import Container from '~/components/ui/Container.vue'

definePageMeta({ layout: 'default' })

const api = useApiClient()
const status = ref<'checking' | 'connected' | 'failed'>('checking')
const responseData = ref<any>(null)
const errorData = ref<any>(null)

onMounted(async () => {
  try {
    // In Medusa 2.x, /store/regions is a common public endpoint to test connectivity
    const res = await api.get('/store/regions')
    responseData.value = res
    status.value = 'connected'
  } catch (err: any) {
    status.value = 'failed'
    errorData.value = err
    console.error('Medusa connection error:', err)
  }
})
</script>

<template>
  <div class="tm-page">
    <Container>
      <h1 class="tm-title">Medusa Connection Test</h1>
      
      <div v-if="status === 'checking'" class="tm-card tm-card-info">
        <p>Checking connection to Medusa API...</p>
      </div>
      
      <div v-else-if="status === 'connected'" class="tm-card tm-card-success">
        <h2 class="tm-card-title">✅ Connected</h2>
        <p class="tm-card-desc">Successfully reached Medusa backend.</p>
        <pre class="tm-pre">{{ JSON.stringify(responseData, null, 2) }}</pre>
      </div>
      
      <div v-else class="tm-card tm-card-error">
        <h2 class="tm-card-title">❌ Connection Failed</h2>
        <p class="tm-card-desc">Could not reach Medusa backend or received an error response.</p>
        <pre class="tm-pre">{{ errorData?.message || errorData }}</pre>
        <pre class="tm-pre tm-mt-4" v-if="errorData?.data">{{ JSON.stringify(errorData.data, null, 2) }}</pre>
      </div>
    </Container>
  </div>
</template>

<style scoped>
.tm-page {
  padding-top: 8rem;
  padding-bottom: 6rem;
  background-color: var(--dp-white);
}

.tm-title {
  font-family: var(--font-heading);
  font-size: 2.25rem;
  color: var(--dp-charcoal);
  margin-bottom: 2rem;
}

.tm-card {
  padding: 1.5rem;
  border-radius: 4px;
  border: 1px solid;
}

.tm-card-info {
  background-color: #f9fafb;
  border-color: #e5e7eb;
}

.tm-card-success {
  background-color: #f0fdf4;
  border-color: #bbf7d0;
  color: #166534;
}

.tm-card-error {
  background-color: #fef2f2;
  border-color: #fecaca;
  color: #991b1b;
}

.tm-card-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.tm-card-desc {
  margin-bottom: 1rem;
}

.tm-pre {
  background-color: var(--dp-white);
  padding: 1rem;
  overflow: auto;
  font-size: 0.875rem;
  border: 1px solid currentColor;
  opacity: 0.8;
}

.tm-mt-4 {
  margin-top: 1rem;
}
</style>
