<script setup lang="ts">
import { useBreadcrumbs } from '~/composables/useSeo'
import Container from '~/components/ui/Container.vue'
import SectionHeading from '~/components/ui/SectionHeading.vue'
import ProductCard from '~/components/product/ProductCard.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import { searchProducts } from '~/repositories/product.repository'

const route = useRoute()
const query = computed(() => (route.query.q as string) || '')

useBreadcrumbs([{ label: 'Recherche', href: `/search?q=${query.value}` }])

const results = computed(() => {
  if (query.value.length < 2) return []
  return searchProducts(query.value)
})
</script>

<template>
  <div class="search-page">
    <Container>
      <SectionHeading
        title="Résultats de recherche"
        :description="query ? `Pour : &quot;${query}&quot;` : 'Saisissez un terme de recherche'"
        align="center"
      />

      <div v-if="!query || query.length < 2" class="search-prompt">
        <p class="search-prompt-text">Veuillez entrer au moins 2 caractères pour rechercher.</p>
      </div>
      
      <div v-else-if="results.length === 0">
        <EmptyState
          title="Aucun résultat"
          description="Nous n'avons trouvé aucun produit correspondant à votre recherche."
          icon="search"
        >
          <template #action>
            <BaseButton @click="$router.push('/products')">Voir tous nos produits</BaseButton>
          </template>
        </EmptyState>
      </div>

      <div v-else>
        <p class="search-count">{{ results.length }} produit(s) trouvé(s)</p>
        <div class="search-results-grid">
          <ProductCard
            v-for="product in results"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </Container>
  </div>
</template>

<style scoped>
.search-page {
  padding-top: var(--space-12);
  padding-bottom: var(--space-12);
  background-color: var(--dp-white);
}

@media (min-width: 768px) {
  .search-page {
    padding-top: var(--space-24);
    padding-bottom: var(--space-24);
  }
}

.search-prompt {
  text-align: center;
  padding-top: var(--space-12);
  padding-bottom: var(--space-12);
}

.search-prompt-text {
  color: var(--dp-ash);
  margin: 0;
}

.search-count {
  font-size: 0.875rem;
  color: var(--dp-ash);
  margin-bottom: var(--space-8);
  text-align: center;
}

.search-results-grid {
  display: grid;
  grid-template-columns: 1fr;
  column-gap: var(--space-8);
  row-gap: var(--space-12);
}

@media (min-width: 640px) {
  .search-results-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .search-results-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .search-results-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
