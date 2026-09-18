<script setup lang="ts">
import { useSeo, useBreadcrumbs } from '~/composables/useSeo'
import Container from '~/components/ui/Container.vue'
import SectionHeading from '~/components/ui/SectionHeading.vue'
import BaseImage from '~/components/ui/BaseImage.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import { useServices } from '~/composables/useServices'
import { Palette, Ruler, Lightbulb } from 'lucide-vue-next'

useSeo({
  title: 'Nos Services',
  description: 'Desact Plus vous accompagne dans tous vos projets d\'aménagement, de la conception à la réalisation.',
})

useBreadcrumbs([
  { label: 'Services', href: '/services' },
])

const { services } = useServices()
const icons: Record<string, any> = { Palette, Ruler, Lightbulb }
</script>

<template>
  <div class="services-page">
    <Container>
      <SectionHeading
        title="Studio de Design"
        eyebrow="Nos Services"
        description="Au-delà de la création de mobilier, notre studio vous accompagne pour imaginer et concrétiser des espaces de vie uniques."
        align="center"
      />

      <div class="services-grid">
        <div v-for="service in services" :key="service.id" class="service-card">
          <div class="service-image-wrapper">
            <BaseImage
              :src="service.image"
              :alt="service.title"
              class="service-image"
            />
            <div class="service-icon-badge">
              <component :is="icons[service.icon]" :size="24" :stroke-width="1.5" />
            </div>
          </div>
          <h3 class="service-title">{{ service.title }}</h3>
          <p class="service-desc">{{ service.description }}</p>
          <ul class="service-features">
            <li v-for="feature in service.features" :key="feature" class="service-feature">
              <span class="feature-dot"/>
              {{ feature }}
            </li>
          </ul>
        </div>
      </div>

      <div class="cta-block">
        <h2 class="cta-title">Prêt à donner vie à votre projet ?</h2>
        <p class="cta-desc">
          Nos architectes d'intérieur sont à votre écoute pour concevoir un espace qui vous ressemble.
        </p>
        <BaseButton variant="primary" size="lg" @click="$router.push('/contact')">
          Prendre rendez-vous
        </BaseButton>
      </div>

    </Container>
  </div>
</template>

<style scoped>
.services-page {
  padding: 6rem 0;
  background-color: var(--dp-white);
}

/* ─── Services Grid ─── */
.services-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  margin-top: 4rem;
  margin-bottom: 6rem;
}

@media (min-width: 1024px) {
  .services-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* ─── Service Card ─── */
.service-card {
  display: flex;
  flex-direction: column;
}

.service-image-wrapper {
  position: relative;
  aspect-ratio: 1 / 1;
  background-color: var(--dp-ivory);
  overflow: hidden;
  margin-bottom: 2rem;
}

.service-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;
}

.service-card:hover .service-image {
  transform: scale(1.05);
}

.service-icon-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 3rem;
  height: 3rem;
  background-color: var(--dp-white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dp-gold);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.service-title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--dp-charcoal);
  margin: 0 0 1rem 0;
  font-weight: 400;
}

.service-desc {
  font-family: var(--font-body);
  color: var(--dp-ash);
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  flex: 1;
}

.service-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--dp-charcoal);
  border-top: 1px solid var(--dp-sand);
  padding-top: 1.5rem;
}

.service-feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.feature-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--dp-gold);
  flex-shrink: 0;
}

/* ─── CTA Block ─── */
.cta-block {
  background-color: var(--dp-charcoal);
  color: var(--dp-white);
  padding: 3rem;
  text-align: center;
}

@media (min-width: 768px) {
  .cta-block {
    padding: 6rem;
  }
}

.cta-title {
  font-family: var(--font-heading);
  font-size: 1.875rem;
  font-weight: 300;
  margin: 0 0 1.5rem 0;
}

@media (min-width: 768px) {
  .cta-title {
    font-size: 3rem;
  }
}

.cta-desc {
  font-family: var(--font-body);
  color: var(--dp-stone);
  font-size: 1.125rem;
  max-width: 42rem;
  margin: 0 auto 2.5rem auto;
  line-height: 1.6;
}
</style>
