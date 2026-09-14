import type { Product } from '~/types/product'

const COOKIE_KEY = 'dp-wishlist'

export function useWishlist() {
  const items = useCookie<string[]>(COOKIE_KEY, {
    default: () => [],
    watch: true
  })

  const count = computed(() => items.value.length)
  const isEmpty = computed(() => items.value.length === 0)

  function add(productId: string) {
    if (!items.value.includes(productId)) {
      items.value.push(productId)
    }
  }

  function remove(productId: string) {
    items.value = items.value.filter((id) => id !== productId)
  }

  function toggle(productId: string) {
    if (isInWishlist(productId)) {
      remove(productId)
    } else {
      add(productId)
    }
  }

  function isInWishlist(productId: string): boolean {
    return items.value.includes(productId)
  }

  function clear() {
    items.value = []
  }

  return { items, count, isEmpty, add, remove, toggle, isInWishlist, clear }
}
