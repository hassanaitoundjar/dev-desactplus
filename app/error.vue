<script setup lang="ts">
import { useError, clearError } from '#app'
import { ArrowLeft, AlertCircle } from 'lucide-vue-next'

const error = useError()

const handleError = () => {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-icon">
        <AlertCircle :size="64" stroke-width="1.5" />
      </div>
      
      <h1 class="error-code">{{ error?.statusCode || 500 }}</h1>
      <h2 class="error-title">
        {{ error?.statusCode === 404 ? 'Page introuvable' : 'Une erreur est survenue' }}
      </h2>
      
      <p class="error-message">
        {{ error?.message || 'Nous rencontrons un problème technique. Veuillez réessayer ultérieurement.' }}
      </p>

      <button class="btn-home" @click="handleError">
        <ArrowLeft :size="16" />
        Retour à l'accueil
      </button>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--dp-ivory);
  padding: 2rem;
  font-family: var(--font-body);
}

.error-container {
  text-align: center;
  max-width: 480px;
  background: var(--dp-white);
  padding: 4rem 2rem;
  border: 1px solid var(--dp-sand);
}

.error-icon {
  color: var(--dp-gold);
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.error-code {
  font-family: var(--font-heading);
  font-size: 5rem;
  font-weight: 300;
  color: var(--dp-charcoal);
  margin: 0;
  line-height: 1;
}

.error-title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--dp-charcoal);
  margin: 1rem 0;
}

.error-message {
  font-size: 0.875rem;
  color: var(--dp-ash);
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.btn-home {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: var(--dp-charcoal);
  color: var(--dp-white);
  border: none;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-home:hover {
  opacity: 0.9;
}
</style>
