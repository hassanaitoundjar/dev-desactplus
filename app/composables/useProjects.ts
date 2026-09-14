import { getAllProjects, getProjectBySlug, getFeaturedProjects } from '~/repositories/project.repository'

export function useProjects() {
  const { data: projects, pending, error } = useAsyncData(
    'projects',
    () => Promise.resolve(getAllProjects()),
  )

  const featured = computed(() => getFeaturedProjects())

  function getBySlug(slug: string) {
    return getProjectBySlug(slug)
  }

  return { projects, featured, pending, error, getBySlug }
}
