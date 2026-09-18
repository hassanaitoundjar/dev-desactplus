<script setup lang="ts">
interface Props {
  open: boolean
  side?: 'left' | 'right'
  title?: string
}

withDefaults(defineProps<Props>(), {
  side: 'right',
})

defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer-backdrop">
      <div v-if="open" class="drawer-overlay" @click="$emit('close')" />
    </Transition>
    <Transition :name="side === 'right' ? 'drawer-right' : 'drawer-left'">
      <div
        v-if="open"
        class="drawer-panel"
        :class="side === 'right' ? 'drawer-side-right' : 'drawer-side-left'"
      >
        <div class="drawer-header">
          <slot name="header">
            <h3 v-if="title" class="drawer-title">{{ title }}</h3>
            <button
              class="drawer-close-btn"
              aria-label="Fermer"
              @click="$emit('close')"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </slot>
        </div>
        <div class="drawer-content">
          <slot />
        </div>
        <div v-if="$slots.footer" class="drawer-footer">
          <slot name="footer" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-overlay);
  background-color: rgba(10, 9, 8, 0.55); /* dp-black with 55% opacity */
}

.drawer-panel {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: calc(var(--z-overlay) + 10);
  width: 100%;
  max-width: 24rem; /* max-w-sm */
  background-color: var(--dp-white);
  display: flex;
  flex-direction: column;
}

.drawer-side-right {
  right: 0;
}

.drawer-side-left {
  left: 0;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  height: var(--header-height, 4rem);
  border-bottom: 1px solid var(--dp-sand);
}

.drawer-title {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  color: var(--dp-charcoal);
  margin: 0;
}

.drawer-close-btn {
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

.drawer-close-btn:hover {
  color: var(--dp-charcoal);
}

.drawer-content {
  flex: 1 1 0%;
  overflow-y: auto;
  padding: 1.5rem;
}

.drawer-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--dp-sand);
  background-color: var(--dp-white);
}

.drawer-backdrop-enter-active,
.drawer-backdrop-leave-active { transition: opacity 300ms; }
.drawer-backdrop-enter-from,
.drawer-backdrop-leave-to { opacity: 0; }

.drawer-right-enter-active,
.drawer-right-leave-active { transition: transform 300ms var(--ease-out, ease); }
.drawer-right-enter-from,
.drawer-right-leave-to { transform: translateX(100%); }

.drawer-left-enter-active,
.drawer-left-leave-active { transition: transform 300ms var(--ease-out, ease); }
.drawer-left-enter-from,
.drawer-left-leave-to { transform: translateX(-100%); }
</style>
