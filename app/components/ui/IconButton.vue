<script setup lang="ts">
interface Props {
  label: string
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  size: 'md',
})

defineEmits<{ click: [event: MouseEvent] }>()

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
}
</script>

<template>
  <button
    :aria-label="label"
    :class="[
      'flex items-center justify-center rounded-full bg-transparent border-none cursor-pointer text-dp-charcoal transition-all duration-200 hover:text-dp-gold hover:bg-dp-cream',
      sizeClasses[size],
    ]"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
