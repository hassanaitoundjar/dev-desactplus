import { getAllCategories, getCategoryBySlug, getFeaturedCategories } from '~/repositories/category.repository'

export function useCategories() {
  const { data: categories, pending, error } = useAsyncData(
    'categories',
    () => Promise.resolve(getAllCategories()),
  )

  const featured = computed(() => getFeaturedCategories())

  function getBySlug(slug: string) {
    return getCategoryBySlug(slug)
  }

  return { categories, featured, pending, error, getBySlug }
}
