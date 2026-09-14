import { AppError, AuthError, NetworkError, NotFoundError, ValidationError } from './errors'

export interface ApiClientOptions {
  baseURL?: string
  headers?: Record<string, string>
}

/**
 * A centralized API Client utilizing Nuxt's $fetch.
 * Prepares the application for a real backend connection without coupling to a specific stack.
 */
export function createApiClient(options: ApiClientOptions = {}) {
  const fetchInstance = $fetch.create({
    baseURL: options.baseURL,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
    async onRequest({ options: _options }) {
      // Future: Attach auth tokens here (e.g. from cookies or state)
      // const token = useCookie('auth_token').value
      // if (token) {
      //   _options.headers = { ..._options.headers, Authorization: `Bearer ${token}` }
      // }
    },
    async onResponseError({ response }) {
      const status = response.status
      const data = response._data
      
      const message = data?.message || data?.error || response.statusText

      if (status === 401 || status === 403) {
        throw new AuthError(message, status)
      }
      if (status === 404) {
        throw new NotFoundError(message)
      }
      if (status === 422) {
        throw new ValidationError(message, data)
      }
      
      throw new AppError(message, status, 'API_ERROR', data)
    },
    async onRequestError({ error }) {
      throw new NetworkError(error.message)
    }
  })

  return {
    get: <T>(url: string, params?: Record<string, unknown>) => fetchInstance<T>(url, { method: 'GET', query: params }),
    post: <T>(url: string, body?: Record<string, unknown> | unknown[] | null) => fetchInstance<T>(url, { method: 'POST', body: body as Record<string, unknown> }),
    put: <T>(url: string, body?: Record<string, unknown> | unknown[] | null) => fetchInstance<T>(url, { method: 'PUT', body: body as Record<string, unknown> }),
    delete: <T>(url: string, body?: Record<string, unknown> | unknown[] | null) => fetchInstance<T>(url, { method: 'DELETE', body: body as Record<string, unknown> }),
  }
}

export function useApiClient() {
  const config = useRuntimeConfig()
  
  // Return a singleton-like instance bound to the runtime config
  // For Medusa storefront, we generally point to the base URL and append `/store/...`
  const headers: Record<string, string> = {}
  
  // In Medusa 2.x, publishable API key might be required for storefront requests
  if (config.public.medusaPublishableKey) {
    headers['x-publishable-api-key'] = config.public.medusaPublishableKey as string
  }

  return createApiClient({
    baseURL: config.public.medusaApiUrl as string,
    headers
  })
}
