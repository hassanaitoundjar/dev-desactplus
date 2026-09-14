import type { ProductFilters } from '~/types/product'
import { getAllProducts, getFeaturedProducts, getNewProducts, filterProducts } from '~/repositories/product.repository'

export function useProducts(filters?: Ref<ProductFilters> | ProductFilters) {
  const resolvedFilters = isRef(filters) ? filters : ref(filters)

  const { data: products, pending, error, refresh } = useAsyncData(
    'products',
    () => {
      const f = resolvedFilters.value
      return Promise.resolve(f ? filterProducts(f) : getAllProducts())
    },
    { watch: [resolvedFilters] },
  )

  const { data: featured } = useAsyncData('featured-products', () => getFeaturedProducts(), { default: () => [] })
  const { data: newest } = useAsyncData('newest-products', () => getNewProducts(), { default: () => [] })

  return { products, pending, error, refresh, featured, newest }
}
