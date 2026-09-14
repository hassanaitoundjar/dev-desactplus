<script setup lang="ts">
type BadgeVariant = 'default' | 'gold' | 'success' | 'error'

interface Props {
  variant?: BadgeVariant
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <span class="badge" :class="`badge--${variant}`">
    <slot />
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 2px;
}

.badge--default {
  background-color: var(--dp-cream);
  color: var(--dp-slate);
}

.badge--gold {
  background-color: rgba(193, 154, 91, 0.1);
  color: var(--dp-gold-dark);
}

.badge--success {
  background-color: var(--dp-success-bg);
  color: var(--dp-success);
}

.badge--error {
  background-color: var(--dp-error-bg);
  color: var(--dp-error);
}
</style>
