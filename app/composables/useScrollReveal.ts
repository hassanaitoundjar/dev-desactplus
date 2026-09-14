import { scrollRevealOptions } from '~/config/design'

/**
 * Intersection Observer-based scroll reveal.
 * Elements with the `reveal-hidden` class get `reveal-visible` added when visible.
 */
export function useScrollReveal() {
  const observer = ref<IntersectionObserver | null>(null)

  function observe(el: HTMLElement) {
    if (!observer.value) return
    observer.value.observe(el)
  }

  function init() {
    if (!import.meta.client) return

    observer.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
            observer.value?.unobserve(entry.target)
          }
        })
      },
      {
        threshold: scrollRevealOptions.threshold,
        rootMargin: scrollRevealOptions.rootMargin,
      },
    )
  }

  function destroy() {
    observer.value?.disconnect()
    observer.value = null
  }

  onMounted(init)
  onBeforeUnmount(destroy)

  return { observe }
}
