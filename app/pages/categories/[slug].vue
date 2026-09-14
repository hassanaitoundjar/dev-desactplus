<script setup lang="ts">
import { useSeo, useBreadcrumbs } from '~/composables/useSeo'
import Container from '~/components/ui/Container.vue'
import SectionHeading from '~/components/ui/SectionHeading.vue'
import ProductCard from '~/components/product/ProductCard.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import { useCategories } from '~/composables/useCategories'
import { useProducts } from '~/composables/useProducts'

definePageMeta({ layout: 'shop' })

const route = useRoute()
const slug = route.params.slug as string
const { getBySlug } = useCategories()
const category = computed(() => getBySlug(slug))

const { products } = useProducts(computed(() => ({ categoryId: category.value?.id })))

watch(category, (c) => {
  if (c) {
    useSeo({
      title: c.name,
      description: c.description,
      image: c.image,
    })
    useBreadcrumbs([
      { label: 'Boutique', href: '/products' },
      { label: c.name, href: `/categories/${c.slug}` },
    ])
  }
}, { immediate: true })

if (!category.value && import.meta.server) {
  throw createError({ statusCode: 404, statusMessage: 'Category not found' })
}
</script>

<template>
  <div v-if="category" class="category-page">
    <Container>
      <!-- Hero -->
      <div class="category-hero">
        <SectionHeading
          :title="category.name"
          :description="category.description"
          align="center"
        />
      </div>

      <!-- Products -->
      <div v-if="products?.length" class="category-grid">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>

      <EmptyState
        v-else
        title="Aucun produit"
        description="Il n'y a pas encore de produits dans cette catégorie."
      >
        <template #action>
          <BaseButton variant="outline" @click="$router.push('/products')">
            Retour à la boutique
          </BaseButton>
        </template>
      </EmptyState>

    </Container>
  </div>
</template>

<style scoped>
.category-page {
  padding-top: var(--space-12);
  padding-bottom: var(--space-12);
}

@media (min-width: 768px) {
  .category-page {
    padding-top: var(--space-24);
    padding-bottom: var(--space-24);
  }
}

.category-hero {
  margin-bottom: var(--space-16);
}

.category-grid {
  display: grid;
  grid-template-columns: 1fr;
  column-gap: var(--space-8);
  row-gap: var(--space-12);
}

@media (min-width: 640px) {
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .category-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .category-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
