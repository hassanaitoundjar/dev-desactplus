<script setup lang="ts">
import { computed } from 'vue'
import { LayoutGrid } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  name?: string
  slug?: string
  icon?: string
  size?: number | string
  strokeWidth?: number | string
}>(), {
  name: '',
  slug: '',
  icon: '',
  size: 16,
  strokeWidth: 1.5
})

const iconKey = computed(() => {
  const raw = (props.slug || props.name || '').toLowerCase().trim()
  
  if (raw.includes('chair') || raw.includes('chaise')) return 'chairs'
  if (raw.includes('table')) return 'tables'
  if (raw.includes('sofa') || raw.includes('canape') || raw.includes('canapé') || raw.includes('salon')) return 'sofas'
  if (raw.includes('armchair') || raw.includes('fauteuil')) return 'armchairs'
  if (raw.includes('bed') || raw.includes('lit') || raw.includes('chambre')) return 'beds'
  if (raw.includes('storage') || raw.includes('rangement')) return 'storage'
  if (raw.includes('textile')) return 'textiles'
  if (raw.includes('light') || raw.includes('luminaire') || raw.includes('éclairage')) return 'lighting'
  if (raw.includes('toy') || raw.includes('jouet')) return 'toys'
  if (raw.includes('decor') || raw.includes('décor')) return 'decor'

  return null
})
</script>

<template>
  <!-- Chairs -->
  <svg
    v-if="iconKey === 'chairs'"
    :width="size"
    :height="size"
    viewBox="0 0 36 36"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="cat-svg-icon"
  >
    <path d="M10 28V32M26 28V32" />
    <rect x="8" y="14" width="20" height="14" rx="2" />
    <path d="M12 14V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6" />
    <path d="M8 20h20" />
  </svg>

  <!-- Tables -->
  <svg
    v-else-if="iconKey === 'tables'"
    :width="size"
    :height="size"
    viewBox="0 0 36 36"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="cat-svg-icon"
  >
    <rect x="4" y="12" width="28" height="4" rx="1" />
    <path d="M8 16V30M28 16V30" />
    <path d="M6 30h6M24 30h6" />
  </svg>

  <!-- Sofas -->
  <svg
    v-else-if="iconKey === 'sofas'"
    :width="size"
    :height="size"
    viewBox="0 0 42 26"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="cat-svg-icon"
  >
    <path d="M6 22V24M36 22V24" />
    <path d="M4 12a4 4 0 0 1 4-4h26a4 4 0 0 1 4 4v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6z" />
    <path d="M10 8V6a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v2" />
    <path d="M10 12v4h22v-4" />
  </svg>

  <!-- Armchairs -->
  <svg
    v-else-if="iconKey === 'armchairs'"
    :width="size"
    :height="size"
    viewBox="0 0 36 36"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="cat-svg-icon"
  >
    <path d="M10 30V33M26 30V33" />
    <path d="M6 16a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V16z" />
    <path d="M12 12V8a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v4" />
    <path d="M10 18h16v4H10z" />
  </svg>

  <!-- Beds -->
  <svg
    v-else-if="iconKey === 'beds'"
    :width="size"
    :height="size"
    viewBox="0 0 36 36"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="cat-svg-icon"
  >
    <path d="M4 28V32M32 28V32" />
    <rect x="4" y="16" width="28" height="12" rx="2" />
    <path d="M4 22h28" />
    <path d="M8 16V12a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" />
    <path d="M18 16V12a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" />
    <path d="M4 18h2v-6a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v6h2" />
  </svg>

  <!-- Storage -->
  <svg
    v-else-if="iconKey === 'storage'"
    :width="size"
    :height="size"
    viewBox="0 0 36 36"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="cat-svg-icon"
  >
    <rect x="4" y="4" width="28" height="28" rx="2" />
    <path d="M4 18h28" />
    <path d="M18 4v28" />
    <circle cx="14" cy="11" r="1" fill="currentColor" />
    <circle cx="22" cy="11" r="1" fill="currentColor" />
    <circle cx="14" cy="25" r="1" fill="currentColor" />
    <circle cx="22" cy="25" r="1" fill="currentColor" />
  </svg>

  <!-- Textiles -->
  <svg
    v-else-if="iconKey === 'textiles'"
    :width="size"
    :height="size"
    viewBox="0 0 36 36"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="cat-svg-icon"
  >
    <path d="M6 6h24v24H6z" />
    <path d="M6 6l12 12M30 6L18 18" />
    <path d="M18 18v12" />
    <path d="M10 30l8-12 8 12" />
    <path d="M6 10h4M26 10h4" />
    <path d="M6 26h4M26 26h4" />
  </svg>

  <!-- Lighting -->
  <svg
    v-else-if="iconKey === 'lighting'"
    :width="size"
    :height="size"
    viewBox="0 0 36 36"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="cat-svg-icon"
  >
    <path d="M18 2v4" />
    <path d="M14 26h8" />
    <path d="M15 30h6" />
    <path d="M12 22c-2.5-2-4-5-4-8a10 10 0 0 1 20 0c0 3-1.5 6-4 8" />
    <path d="M12 22v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4" />
  </svg>

  <!-- Toys -->
  <svg
    v-else-if="iconKey === 'toys'"
    :width="size"
    :height="size"
    viewBox="0 0 36 36"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="cat-svg-icon"
  >
    <circle cx="18" cy="14" r="10" />
    <path d="M18 4a4 4 0 0 0-4 4" />
    <path d="M18 4a4 4 0 0 1 4 4" />
    <path d="M14 24l-2 8h12l-2-8" />
    <circle cx="14" cy="14" r="2" fill="currentColor" />
    <circle cx="22" cy="14" r="2" fill="currentColor" />
    <path d="M15 19c1 1 5 1 6 0" />
  </svg>

  <!-- Decor -->
  <svg
    v-else-if="iconKey === 'decor'"
    :width="size"
    :height="size"
    viewBox="0 0 36 32"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="cat-svg-icon"
  >
    <path d="M14 30H22" />
    <path d="M18 20v10" />
    <path d="M10 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    <ellipse cx="18" cy="10" rx="6" ry="8" />
    <path d="M12 10c0-3 2.7-6 6-6" />
    <path d="M24 10c0-3-2.7-6-6-6" />
  </svg>

  <!-- Fallback: Lucide LayoutGrid -->
  <LayoutGrid
    v-else
    :size="size"
    :stroke-width="strokeWidth"
    class="cat-svg-icon"
  />
</template>

<style scoped>
.cat-svg-icon {
  flex-shrink: 0;
  display: inline-block;
  vertical-align: middle;
  transition: color 0.3s ease;
}
</style>
