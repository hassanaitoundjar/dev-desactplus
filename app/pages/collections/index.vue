<script setup lang="ts">
import { useSeo, useBreadcrumbs } from '~/composables/useSeo'
import Container from '~/components/ui/Container.vue'
import SectionHeading from '~/components/ui/SectionHeading.vue'
import BaseImage from '~/components/ui/BaseImage.vue'
import { useCollections } from '~/composables/useCollections'
import { ArrowRight } from 'lucide-vue-next'

useSeo({
  title: 'Nos Collections',
  description: 'Découvrez nos collections thématiques, pensées pour créer des ambiances uniques et harmonieuses.',
})

useBreadcrumbs([
  { label: 'Collections', href: '/collections' },
])

const { collections } = useCollections()
</script>

<template>
  <div class="collections-page">
    <Container>
      <SectionHeading
        title="Nos Collections"
        eyebrow="Thématiques"
        description="Plongez dans nos univers pensés pour sublimer chaque espace de votre intérieur."
        align="center"
      />

      <div class="collections-list">
        <div
          v-for="(collection, index) in collections"
          :key="collection.id"
          class="collection-item"
          :class="{ 'is-reversed': index % 2 === 1 }"
        >
          <div class="collection-image-wrapper">
            <BaseImage
              :src="collection.image"
              :alt="collection.name"
              class="collection-image"
            />
          </div>
          
          <div class="collection-content">
            <h2 class="collection-title">{{ collection.name }}</h2>
            <p class="collection-description">{{ collection.description }}</p>
            <NuxtLink :to="`/collections/${collection.slug}`" class="collection-link">
              Découvrir la collection <ArrowRight :size="16" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </Container>
  </div>
</template>

<style scoped>
.collections-page {
  padding-top: var(--space-24);
  padding-bottom: var(--space-24);
  background-color: var(--dp-white);
}

.collections-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-24);
  margin-top: var(--space-16);
}

.collection-item {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-12);
  align-items: center;
}

@media (min-width: 1024px) {
  .collection-item {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-24);
  }
}

.collection-image-wrapper {
  position: relative;
  aspect-ratio: 4 / 3;
  background-color: var(--dp-ivory);
  overflow: hidden;
}

@media (min-width: 1024px) {
  .collection-item.is-reversed .collection-image-wrapper {
    order: 2;
  }
}

.collection-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;
}

.collection-item:hover .collection-image {
  transform: scale(1.05);
}

.collection-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

@media (min-width: 1024px) {
  .collection-item.is-reversed .collection-content {
    order: 1;
    align-items: flex-end;
    text-align: right;
  }
}

.collection-title {
  font-size: 2.25rem;
  color: var(--dp-charcoal);
  margin-bottom: var(--space-6);
  margin-top: 0;
}

@media (min-width: 1024px) {
  .collection-title {
    font-size: 3rem;
  }
}

.collection-description {
  color: var(--dp-ash);
  font-size: 1.125rem;
  line-height: 1.625;
  margin-bottom: var(--space-8);
  margin-top: 0;
  max-width: 32rem;
}

.collection-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--dp-charcoal);
  transition: color 0.3s ease, border-color 0.3s ease;
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--dp-charcoal);
  text-decoration: none;
}

.collection-link:hover {
  color: var(--dp-gold);
  border-color: var(--dp-gold);
}
</style>
