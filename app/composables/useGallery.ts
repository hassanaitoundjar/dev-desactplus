import { getGalleryItems, type GalleryItem } from '~/repositories/gallery.repository'

export function useGallery() {
  const { data, pending, error, refresh } = useAsyncData(
    'design-gallery',
    () => getGalleryItems(),
    {
      default: () => ({ items: [], categories: [] }),
    }
  )

  const items = computed<GalleryItem[]>(() => data.value?.items ?? [])
  const categories = computed<string[]>(() => data.value?.categories ?? [])

  return {
    data,
    items,
    categories,
    pending,
    error,
    refresh,
  }
}
