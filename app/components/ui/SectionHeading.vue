<script setup lang="ts">
interface Props {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

withDefaults(defineProps<Props>(), {
  align: 'left',
})
</script>

<template>
  <div class="section-heading-wrapper" :class="{ 'align-center': align === 'center' }">
    <span
      v-if="eyebrow"
      class="section-eyebrow"
    >
      {{ eyebrow }}
    </span>
    <h2 class="section-title">
      {{ title }}
    </h2>
    <p v-if="description" class="section-description">
      {{ description }}
    </p>
    <slot />
  </div>
</template>

<style scoped>
.section-heading-wrapper {
  margin-bottom: 3rem; /* mb-12 */
}

@media (min-width: 768px) {
  .section-heading-wrapper {
    margin-bottom: 4rem; /* md:mb-16 */
  }
}

.align-center {
  text-align: center;
}

.align-center .section-description {
  margin-left: auto;
  margin-right: auto;
}

.section-eyebrow {
  display: block;
  font-family: var(--font-body);
  font-size: 0.75rem; /* text-xs */
  font-weight: 500; /* font-medium */
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--dp-gold);
  margin-bottom: 1rem; /* mb-4 */
}

.section-title {
  font-family: var(--font-heading);
  font-size: 1.875rem; /* text-3xl */
  font-weight: 300; /* font-light */
  color: var(--dp-charcoal);
  line-height: 1.25; /* leading-tight */
  letter-spacing: -0.025em; /* tracking-tight */
  margin: 0;
}

@media (min-width: 768px) {
  .section-title {
    font-size: 2.25rem; /* md:text-4xl */
  }
}

@media (min-width: 1024px) {
  .section-title {
    font-size: 3rem; /* lg:text-5xl */
  }
}

.section-description {
  margin-top: 1rem; /* mt-4 */
  font-size: 1rem; /* text-base */
  color: var(--dp-ash);
  line-height: 1.625; /* leading-relaxed */
  max-width: 42rem; /* max-w-2xl */
  margin-bottom: 0;
}
</style>
