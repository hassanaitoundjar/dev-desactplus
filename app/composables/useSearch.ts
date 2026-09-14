import { searchProducts } from '~/repositories/product.repository'

export function useSearch() {
  const query = ref('')
  const isOpen = ref(false)

  const { data: resultsData } = useAsyncData(
    'search-results',
    async () => {
      if (query.value.length < 2) return []
      return await searchProducts(query.value)
    },
    { watch: [query] }
  )

  const results = computed(() => resultsData.value || [])
  const hasResults = computed(() => results.value.length > 0)

  function open() { isOpen.value = true }
  function close() {
    isOpen.value = false
    query.value = ''
  }
  function toggle() { isOpen.value = !isOpen.value }

  return { query, results, hasResults, isOpen, open, close, toggle }
}
