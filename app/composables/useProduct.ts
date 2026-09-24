import { getProductBySlug } from '~/repositories/product.repository'

export function useProduct(slug: string | Ref<string>) {
  const resolvedSlug = isRef(slug) ? slug : ref(slug)

  const product = ref<any>(null)
  const related = ref<any[]>([])

  const { pending, error } = useAsyncData(
    () => `product-${toValue(resolvedSlug)}`,
    async () => {
      const result = await getProductBySlug(toValue(resolvedSlug))
      product.value = result.product ?? null
      related.value = result.related ?? []
      return result
    },
    { watch: [resolvedSlug] },
  )

  return { product, related, pending, error }
}
