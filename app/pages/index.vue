<script setup lang="ts">
import Hero from '~/components/home/Hero.vue'
import CategoryList from '~/components/home/CategoryList.vue'
import WeeklyBestsellers from '~/components/home/WeeklyBestsellers.vue'
import AtelierSection from '~/components/home/AtelierSection.vue'
import Testimonials from '~/components/home/Testimonials.vue'
import TrustBar from '~/components/home/TrustBar.vue'
import DesignGallery from '~/components/home/DesignGallery.vue'
import { useSeo } from '~/composables/useSeo'
import LatestArticles from '~/components/home/LatestArticles.vue'

useSeo({
  title: 'Accueil',
  description: 'Desact Plus - Mobilier et design d\'intérieur d\'exception. Découvrez nos collections de meubles haut de gamme et nos services d\'aménagement.',
})
</script>

<template>
  <div>
    <Hero />
    <CategoryList />
    <WeeklyBestsellers />
    <AtelierSection />
    <DesignGallery />
    <Testimonials />
    <LatestArticles/>
    <TrustBar />
  </div>
</template>
