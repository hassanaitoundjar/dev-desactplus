import { mainNavigation } from '~/config/navigation'

export function useNavigation() {
  const route = useRoute()
  const mobileMenuOpen = useState('mobileMenuOpen', () => false)
  const searchOpen = useState('searchOpen', () => false)

  const navLinks = computed(() => mainNavigation)

  const isActive = (href: string) => {
    if (href === '/') return route.path === '/'
    return route.path.startsWith(href)
  }

  function toggleMobileMenu() {
    mobileMenuOpen.value = !mobileMenuOpen.value
  }

  function closeMobileMenu() {
    mobileMenuOpen.value = false
  }

  function toggleSearch() {
    searchOpen.value = !searchOpen.value
  }

  function closeSearch() {
    searchOpen.value = false
  }

  // Close mobile menu on route change
  watch(() => route.path, () => {
    closeMobileMenu()
    closeSearch()
  })

  return {
    navLinks,
    mobileMenuOpen,
    searchOpen,
    isActive,
    toggleMobileMenu,
    closeMobileMenu,
    toggleSearch,
    closeSearch,
  }
}
