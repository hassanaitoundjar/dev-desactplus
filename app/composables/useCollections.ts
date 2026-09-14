import { getAllCollections, getCollectionBySlug, getFeaturedCollections } from '~/repositories/collection.repository'

export function useCollections() {
  const { data: collections, pending, error } = useAsyncData(
    'collections',
    () => Promise.resolve(getAllCollections()),
  )

  const featured = computed(() => getFeaturedCollections())

  function getBySlug(slug: string) {
    return getCollectionBySlug(slug)
  }

  return { collections, featured, pending, error, getBySlug }
}
