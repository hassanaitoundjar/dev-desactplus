<script setup lang="ts">
interface Props {
  open: boolean
  title?: string
}

defineProps<Props>()
defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-wrapper">
        <div class="modal-backdrop" @click="$emit('close')" />
        <div class="modal-content">
          <button
            class="modal-close-btn"
            aria-label="Fermer"
            @click="$emit('close')"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
          <h3 v-if="title" class="modal-title">{{ title }}</h3>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-wrapper {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background-color: rgba(10, 9, 8, 0.55); /* dp-black/55 */
}

.modal-content {
  position: relative;
  width: 100%;
  max-width: 32rem; /* max-w-lg */
  background-color: var(--dp-white);
  padding: 2rem;
  animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dp-ash);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
  padding: 0;
}

.modal-close-btn:hover {
  color: var(--dp-charcoal);
}

.modal-title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--dp-charcoal);
  margin-bottom: 1.5rem;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@keyframes scaleUp {
  0% {
    transform: scale(0.95);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
