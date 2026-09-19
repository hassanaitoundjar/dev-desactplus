import { useApiClient } from '~/api/apiClient'

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  category: string | null
  author_name: string
  featured_image: string | null
  published_at: string | null
  created_at: string
}

interface BlogPostsResponse {
  posts: BlogPost[]
}

interface BlogPostResponse {
  post: BlogPost
}

export async function getLatestPosts(limit = 4): Promise<BlogPost[]> {
  const client = useApiClient()
  try {
    const data = await client.get<BlogPostsResponse>('/store/blog', { limit })
    return data.posts || []
  } catch (error) {
    console.error('Failed to fetch blog posts:', error)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const client = useApiClient()
  try {
    const data = await client.get<BlogPostResponse>(`/store/blog/${slug}`)
    return data.post
  } catch (error) {
    console.error(`Failed to fetch blog post ${slug}:`, error)
    return undefined
  }
}
