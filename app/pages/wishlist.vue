<script setup lang="ts">
import { useBreadcrumbs } from '~/composables/useSeo'
import { useWishlist } from '~/composables/useWishlist'
import { useProducts } from '~/composables/useProducts'
import Container from '~/components/ui/Container.vue'
import SectionHeading from '~/components/ui/SectionHeading.vue'
import ProductCard from '~/components/product/ProductCard.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import BaseButton from '~/components/ui/BaseButton.vue'

useBreadcrumbs([{ label: 'Favoris', href: '/wishlist' }])

const { items, count, isEmpty, remove, clear } = useWishlist()
const { products: allProducts } = useProducts()

const wishlistedProducts = computed(() => {
  if (!allProducts.value) return []
  return items.value
    .map(id => allProducts.value.find(p => p.id === id))
    .filter(p => p !== undefined)
})
</script>

<template>
  <div class="wishlist-page">
    <Container>
      <SectionHeading title="Mes Favoris" eyebrow="Sélection" :description="count === 0 ? '' : `${count} article(s) sauvegardé(s)`" />

      <div v-if="count === 0" class="wishlist-empty">
        <EmptyState
          title="Aucun favori"
          description="Vous n'avez pas encore sauvegardé d'articles."
          icon="heart"
        >
          <template #action>
            <BaseButton @click="$router.push('/products')">Explorer la collection</BaseButton>
          </template>
        </EmptyState>
      </div>

      <div v-else class="wishlist-grid">
        <ProductCard
          v-for="product in wishlistedProducts"
          :key="product!.id"
          :product="product!"
        />
      </div>
    </Container>
  </div>
</template>

<style scoped>
.wishlist-page {
  padding-top: var(--space-12);
  padding-bottom: var(--space-12);
  background-color: var(--dp-white);
}

@media (min-width: 768px) {
  .wishlist-page {
    padding-top: var(--space-24);
    padding-bottom: var(--space-24);
  }
}

.wishlist-empty {
  /* No specific styles needed right now */
}

.wishlist-grid {
  display: grid;
  grid-template-columns: 1fr;
  column-gap: var(--space-8);
  row-gap: var(--space-12);
}

@media (min-width: 640px) {
  .wishlist-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .wishlist-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .wishlist-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
