<script setup lang="ts">
interface Props {
  title: string
  description?: string
  icon?: string
}

defineProps<Props>()
</script>

<template>
  <div class="empty-state">
    <div class="empty-state-icon">
      <slot name="icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10" /><path d="M8 15h8M9 9h.01M15 9h.01" />
        </svg>
      </slot>
    </div>
    <h3 class="empty-state-title">{{ title }}</h3>
    <p v-if="description" class="empty-state-description">{{ description }}</p>
    <div class="empty-state-action">
      <slot name="action" />
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1.5rem;
  text-align: center;
}

.empty-state-icon {
  width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: var(--dp-cream);
  color: var(--dp-stone);
  margin-bottom: 1.5rem;
}

.empty-state-title {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  color: var(--dp-charcoal);
  margin-bottom: 0.5rem;
}

.empty-state-description {
  font-size: 0.875rem;
  color: var(--dp-ash);
  max-width: 24rem; /* max-w-sm */
  margin: 0;
}

.empty-state-action {
  margin-top: 1.5rem;
}
</style>
