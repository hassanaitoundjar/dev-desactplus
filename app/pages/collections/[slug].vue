<script setup lang="ts">
import { useSeo, useBreadcrumbs } from '~/composables/useSeo'
import Container from '~/components/ui/Container.vue'
import SectionHeading from '~/components/ui/SectionHeading.vue'
import ProductCard from '~/components/product/ProductCard.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import { useCollections } from '~/composables/useCollections'
import { getProductsByCollection } from '~/repositories/product.repository'

definePageMeta({ layout: 'shop' })

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const { getBySlug } = useCollections()
const collection = computed(() => getBySlug(slug.value))

const { data: products } = useAsyncData(
  `collection-products-${slug.value}`,
  async () => {
    if (!collection.value) return []
    return await getProductsByCollection(collection.value.id)
  },
  { watch: [collection] }
)

watch(collection, (c) => {
  if (c) {
    useSeo({
      title: c.name,
      description: c.description,
      image: c.image,
    })
    useBreadcrumbs([
      { label: 'Collections', href: '/collections' },
      { label: c.name, href: `/collections/${c.slug}` },
    ])
  }
}, { immediate: true })
</script>

<template>
  <div v-if="collection" class="collection-page">
    <Container>
      <SectionHeading
        :title="collection.name"
        :description="collection.description"
        eyebrow="Collection"
        align="center"
      />

      <div v-if="products.length" class="collection-grid">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>

      <EmptyState
        v-else
        title="Collection en préparation"
        description="Les produits de cette collection seront bientôt disponibles."
      >
        <template #action>
          <BaseButton variant="outline" @click="$router.push('/collections')">
            Voir toutes les collections
          </BaseButton>
        </template>
      </EmptyState>
    </Container>
  </div>
</template>

<style scoped>
.collection-page {
  padding-top: var(--space-12);
  padding-bottom: var(--space-12);
}

@media (min-width: 768px) {
  .collection-page {
    padding-top: var(--space-24);
    padding-bottom: var(--space-24);
  }
}

.collection-grid {
  display: grid;
  grid-template-columns: 1fr;
  column-gap: var(--space-8);
  row-gap: var(--space-12);
  margin-top: var(--space-16);
}

@media (min-width: 640px) {
  .collection-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .collection-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .collection-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
