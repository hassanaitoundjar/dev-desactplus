<script setup lang="ts">
import { useSeo, useBreadcrumbs } from '~/composables/useSeo'
import Container from '~/components/ui/Container.vue'
import BaseImage from '~/components/ui/BaseImage.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import { useProjects } from '~/composables/useProjects'

const route = useRoute()
const slug = route.params.slug as string
const { getBySlug } = useProjects()
const project = computed(() => getBySlug(slug))

watch(project, (p) => {
  if (p) {
    useSeo({
      title: p.title,
      description: p.description,
      image: p.images[0],
    })
    useBreadcrumbs([
      { label: 'Projets', href: '/projects' },
      { label: p.title, href: `/projects/${p.slug}` },
    ])
  }
}, { immediate: true })
</script>

<template>
  <div v-if="project" class="project-detail-page">
    <!-- Hero -->
    <section class="project-hero">
      <BaseImage
        :src="project.images[0]"
        :alt="project.title"
        class="project-hero-image"
        loading="eager"
      />
      <div class="project-hero-overlay" />
      <div class="project-hero-content">
        <span class="project-category-tag">{{ project.category }}</span>
        <h1 class="project-title">{{ project.title }}</h1>
        <p class="project-location">{{ project.location }} — {{ new Date(project.date).getFullYear() }}</p>
      </div>
    </section>

    <Container class="project-container">
      <div class="project-description-wrapper">
        <p class="project-description">{{ project.description }}</p>
      </div>

      <!-- Image Gallery -->
      <div class="project-gallery">
        <div v-for="(img, idx) in project.images" :key="idx" class="project-gallery-item">
          <BaseImage
            :src="img"
            :alt="`${project.title} — Photo ${idx + 1}`"
            class="project-gallery-image"
          />
        </div>
      </div>

      <div class="project-action">
        <BaseButton variant="outline" @click="$router.push('/projects')">
          Retour aux projets
        </BaseButton>
      </div>
    </Container>
  </div>
</template>

<style scoped>
.project-detail-page {
  background-color: var(--dp-white);
}

.project-hero {
  position: relative;
  height: 50vh;
  min-height: 350px;
}

.project-hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-hero-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(18, 18, 18, 0.4); /* dp-black with opacity */
}

.project-hero-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--dp-white);
  z-index: 10;
}

.project-category-tag {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--dp-gold);
  margin-bottom: var(--space-4);
}

.project-title {
  font-size: 2.25rem;
  font-weight: 300;
  margin-bottom: var(--space-4);
  margin-top: 0;
}

@media (min-width: 768px) {
  .project-title {
    font-size: 3.75rem;
  }
}

.project-location {
  font-size: 0.875rem;
  color: var(--dp-cream);
  margin: 0;
}

.project-container {
  padding-top: var(--space-24);
  padding-bottom: var(--space-24);
}

.project-description-wrapper {
  max-width: 48rem;
  margin: 0 auto;
  text-align: center;
  margin-bottom: var(--space-16);
}

.project-description {
  font-size: 1.125rem;
  color: var(--dp-ash);
  line-height: 1.625;
  margin: 0;
}

.project-gallery {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
  margin-bottom: var(--space-16);
}

@media (min-width: 768px) {
  .project-gallery {
    grid-template-columns: repeat(2, 1fr);
  }
}

.project-gallery-item {
  aspect-ratio: 4 / 3;
  background-color: var(--dp-ivory);
  overflow: hidden;
  border-radius: 2px;
}

.project-gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-action {
  text-align: center;
}
</style>
