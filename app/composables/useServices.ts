import { getAllServices, getServiceBySlug } from '~/repositories/service.repository'

export function useServices() {
  const { data: services, pending, error } = useAsyncData(
    'services',
    () => getAllServices(),
  )

  function getBySlug(slug: string) {
    return services.value?.find(s => s.slug === slug)
  }

  return { services, pending, error, getBySlug }
}
