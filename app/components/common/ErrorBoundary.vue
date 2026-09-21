<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { AlertCircle, RotateCcw } from 'lucide-vue-next'

const error = ref<Error | null>(null)

onErrorCaptured((err: unknown) => {
  error.value = err instanceof Error ? err : new Error(String(err))
  // Prevent error from bubbling up
  return false
})

const reset = () => {
  error.value = null
}
</script>

<template>
  <slot v-if="!error" />
  <div v-else class="error-boundary">
    <div class="eb-content">
      <AlertCircle class="eb-icon" :size="32" />
      <h3 class="eb-title">Élément indisponible</h3>
      <p class="eb-message">Nous n'avons pas pu charger cette section. Veuillez réessayer.</p>
      <button class="eb-btn" @click="reset">
        <RotateCcw :size="14" />
        Réessayer
      </button>
    </div>
  </div>
</template>

<style scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: var(--dp-ivory);
  border: 1px dashed var(--dp-sand);
  border-radius: 4px;
}

.eb-content {
  text-align: center;
  max-width: 320px;
}

.eb-icon {
  color: var(--dp-gold);
  margin-bottom: 1rem;
}

.eb-title {
  font-family: var(--font-heading);
  font-size: 1.125rem;
  color: var(--dp-charcoal);
  margin: 0 0 0.5rem 0;
}

.eb-message {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--dp-ash);
  margin: 0 0 1.5rem 0;
}

.eb-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--dp-white);
  color: var(--dp-charcoal);
  border: 1px solid var(--dp-sand);
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}

.eb-btn:hover {
  background: var(--dp-charcoal);
  color: var(--dp-white);
  border-color: var(--dp-charcoal);
}
</style>
