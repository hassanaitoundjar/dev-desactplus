<script setup lang="ts">
import { useSeo, useBreadcrumbs } from '~/composables/useSeo'
import Container from '~/components/ui/Container.vue'
import SectionHeading from '~/components/ui/SectionHeading.vue'
import BaseImage from '~/components/ui/BaseImage.vue'
import { useProjects } from '~/composables/useProjects'

useSeo({
  title: 'Nos Projets',
  description: 'Découvrez nos réalisations d\'aménagement intérieur pour résidences privées, hôtellerie et espaces commerciaux.',
})

useBreadcrumbs([
  { label: 'Projets', href: '/projects' },
])

const { projects } = useProjects()
</script>

<template>
  <div class="projects-page">
    <Container>
      <SectionHeading
        title="Réalisations d'Exception"
        eyebrow="Portfolio"
        description="Chaque projet est une histoire unique, pensée et réalisée sur mesure."
        align="center"
      />

      <div class="projects-grid">
        <NuxtLink
          v-for="project in projects"
          :key="project.id"
          :to="`/projects/${project.slug}`"
          class="project-card"
        >
          <div class="project-image-wrapper">
            <BaseImage
              :src="project.images[0]"
              :alt="project.title"
              class="project-image"
            />
          </div>
          <div class="project-meta">
            <div class="project-info">
              <h3 class="project-title">{{ project.title }}</h3>
              <p class="project-location">{{ project.location }} — {{ new Date(project.date).getFullYear() }}</p>
            </div>
            <span class="project-category">
              {{ project.category }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </Container>
  </div>
</template>

<style scoped>
.projects-page {
  padding-top: var(--space-24);
  padding-bottom: var(--space-24);
  background-color: var(--dp-ivory);
}

.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  column-gap: var(--space-8);
  row-gap: var(--space-16);
  margin-top: var(--space-16);
}

@media (min-width: 768px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.project-card {
  display: block;
  text-decoration: none;
}

.project-image-wrapper {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 2px;
  margin-bottom: var(--space-6);
  background-color: var(--dp-white);
}

.project-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;
}

.project-card:hover .project-image {
  transform: scale(1.05);
}

.project-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.project-info {
  display: flex;
  flex-direction: column;
}

.project-title {
  font-size: 1.5rem;
  color: var(--dp-charcoal);
  margin-bottom: var(--space-2);
  margin-top: 0;
  transition: color 0.3s ease;
}

.project-card:hover .project-title {
  color: var(--dp-gold);
}

.project-location {
  font-size: 0.875rem;
  color: var(--dp-ash);
  margin: 0;
}

.project-category {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--dp-charcoal);
  border: 1px solid var(--dp-sand);
  padding: var(--space-1) var(--space-3);
}
</style>
