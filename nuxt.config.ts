export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  modules: ['@nuxt/image', '@vueuse/nuxt', '@nuxt/eslint', 'nuxt-security'],

  security: {
    headers: {
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'base-uri': ["'self'"],
        'font-src': ["'self'", 'https: data:', 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"],
        'img-src': ["'self'", 'data:', 'blob:', 'https:', '*'], // Allow images from anywhere, as they might come from Medusa or S3
        'object-src': ["'none'"],
        'script-src': ["'self'", "'unsafe-inline'"], // Removed 'unsafe-eval' for security
        'script-src-attr': ["'none'"],
        'style-src': ["'self'", 'https:', "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'connect-src': ["'self'", 'https:', 'http:', 'http://localhost:9000', '*'], // API connections
        'upgrade-insecure-requests': true
      },
      crossOriginEmbedderPolicy: 'unsafe-none',
      xFrameOptions: 'DENY',
      xContentTypeOptions: 'nosniff',
      strictTransportSecurity: {
        maxAge: 31536000,
        includeSubdomains: true,
        preload: true
      },
    },
    rateLimiter: {
      tokensPerInterval: 150,
      interval: 300000,
      headers: false
    }
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap',
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL || '',
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || process.env.PUBLIC_API_BASE_URL || '',
      storefrontApiKey: process.env.NUXT_PUBLIC_STOREFRONT_API_KEY || process.env.PUBLIC_STOREFRONT_API_KEY || '',
    },
  },

  image: {
    domains: ['https://desactplus.ma'],
    quality: 80,
    format: ['webp', 'avif'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },
})