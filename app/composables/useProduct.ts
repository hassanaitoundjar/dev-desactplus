import { getProductBySlug, getRelatedProducts } from '~/repositories/product.repository'

export function useProduct(slug: string | Ref<string>) {
  const resolvedSlug = isRef(slug) ? slug : ref(slug)

  const { data: product, pending, error } = useAsyncData(
    `product-${toValue(resolvedSlug)}`,
    () => getProductBySlug(toValue(resolvedSlug)),
    { watch: [resolvedSlug] },
  )

  const { data: related } = useAsyncData(
    `related-${toValue(resolvedSlug)}`,
    async () => {
      if (!product.value) return []
      return getRelatedProducts(product.value.slug, product.value.categoryId)
    },
    { watch: [product], default: () => [] },
  )

  return { product, related, pending, error }
}
