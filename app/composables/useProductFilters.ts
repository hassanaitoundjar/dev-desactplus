import { ref } from 'vue'

const searchQuery = ref<string>('')
const selectedCategory = ref<string>('all')
const selectedMaterials = ref<string[]>([])
const selectedColors = ref<string[]>([])
const inStockOnly = ref(false)
const priceRange = ref([0, 20000])

export const useProductFilters = () => {
  return {
    searchQuery,
    selectedCategory,
    selectedMaterials,
    selectedColors,
    inStockOnly,
    priceRange
  }
}
