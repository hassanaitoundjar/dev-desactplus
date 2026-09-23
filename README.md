# Disact Plus

Disact Plus is a modern, high-performance E-commerce and Interior Design portfolio platform. It features a luxury editorial design aesthetic with a strong emphasis on whitespace, organic shapes, and minimalist UI, built entirely without external CSS frameworks like Tailwind.

## Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/) (Vue 3)
- **Language**: TypeScript
- **Styling**: Native CSS with CSS Variables (`var(--dp-white)`, `var(--space-4)`, etc.)
- **Icons**: `lucide-vue-next`
- **Architecture**: Repository Pattern with Data Mappers for API integration (Medusa storefront).

## Project Structure Schema

The project follows a modular, feature-based Nuxt 3 directory structure:

```text
.
├── AGENT_HANDOFF.md
├── app
│   ├── api
│   │   ├── apiClient.ts
│   │   ├── errors.ts
│   │   └── mappers
│   │       ├── product.mapper.ts
│   │       ├── review.mapper.ts
│   │       ├── service.mapper.ts
│   │       └── testimonial.mapper.ts
│   ├── app.vue
│   ├── assets
│   │   └── css
│   │       ├── animations.css
│   │       ├── main.css
│   │       └── tokens.css
│   ├── components
│   │   ├── home
│   │   │   ├── AtelierSection.vue
│   │   │   ├── CategoryList.vue
│   │   │   ├── FeaturedCategories.vue
│   │   │   ├── FeaturedProjects.vue
│   │   │   ├── Hero.vue
│   │   │   ├── NewArrivals.vue
│   │   │   ├── Testimonials.vue
│   │   │   ├── TrustBar.vue
│   │   │   └── WeeklyBestsellers.vue
│   │   ├── layout
│   │   │   ├── DesktopNavigation.vue
│   │   │   ├── Footer.vue
│   │   │   ├── Header.vue
│   │   │   ├── MobileNavigation.vue
│   │   │   ├── Newsletter.vue
│   │   │   ├── SearchOverlay.vue
│   │   │   └── Topbar.vue
│   │   ├── product
│   │   │   ├── ProductCard.vue
│   │   │   └── ProductSidebar.vue
│   │   └── ui
│   │       ├── Badge.vue
│   │       ├── BaseButton.vue
│   │       ├── BaseImage.vue
│   │       ├── BaseInput.vue
│   │       ├── BaseLink.vue
│   │       ├── Container.vue
│   │       ├── Drawer.vue
│   │       ├── EmptyState.vue
│   │       ├── IconButton.vue
│   │       ├── Modal.vue
│   │       ├── NewsletterPopup.vue
│   │       ├── SectionHeading.vue
│   │       └── Skeleton.vue
│   ├── composables
│   │   ├── useCart.ts
│   │   ├── useCategories.ts
│   │   ├── useCheckout.ts
│   │   ├── useCollections.ts
│   │   ├── useNavigation.ts
│   │   ├── useProductFilters.ts
│   │   ├── useProducts.ts
│   │   ├── useProduct.ts
│   │   ├── useProjects.ts
│   │   ├── useReviews.ts
│   │   ├── useScrollReveal.ts
│   │   ├── useSearch.ts
│   │   ├── useSeo.ts
│   │   ├── useServices.ts
│   │   └── useWishlist.ts
│   ├── config
│   │   ├── categories.ts
│   │   ├── design.ts
│   │   ├── navigation.ts
│   │   ├── seo.ts
│   │   └── site.ts
│   ├── layouts
│   │   ├── default.vue
│   │   └── shop.vue
│   ├── pages
│   │   ├── about.vue
│   │   ├── cart.vue
│   │   ├── categories
│   │   │   └── [slug].vue
│   │   ├── checkout
│   │   │   ├── confirmation.vue
│   │   │   └── index.vue
│   │   ├── collections
│   │   │   ├── index.vue
│   │   │   └── [slug].vue
│   │   ├── confidentialite.vue
│   │   ├── contact.vue
│   │   ├── faq.vue
│   │   ├── garantie.vue
│   │   ├── index.vue
│   │   ├── livraison.vue
│   │   ├── mentions-legales.vue
│   │   ├── products
│   │   │   ├── index.vue
│   │   │   └── [slug].vue
│   │   ├── projects
│   │   │   ├── index.vue
│   │   │   └── [slug].vue
│   │   ├── retours.vue
│   │   ├── search.vue
│   │   ├── services
│   │   │   └── index.vue
│   │   ├── test-medusa.vue
│   │   └── wishlist.vue
│   ├── repositories
│   │   ├── category.repository.ts
│   │   ├── collection.repository.ts
│   │   ├── product.repository.ts
│   │   ├── project.repository.ts
│   │   ├── review.repository.ts
│   │   ├── service.repository.ts
│   │   └── testimonial.repository.ts
│   ├── types
│   │   ├── api.ts
│   │   ├── category.ts
│   │   ├── collection.ts
│   │   ├── index.ts
│   │   ├── navigation.ts
│   │   ├── product.ts
│   │   ├── project.ts
│   │   ├── review.ts
│   │   ├── seo.ts
│   │   ├── service.ts
│   │   └── testimonial.ts
│   └── utils
│       ├── formatDate.ts
│       ├── formatPrice.ts
│       ├── image.ts
│       └── slugify.ts
├── check-console.js
├── .env
├── eslint.config.mjs
├── .gitignore
├── mockProducts.json
├── nuxt.config.ts
├── package.json
├── package-lock.json
├── README.md
├── scratch2.cjs
├── scratch.js
├── scripts
├── test-mapper.cjs
├── test-mapper.js
└── tsconfig.json
```

## Architectural Concepts

### 1. The Repository Pattern (`app/repositories/`)
We use the repository pattern to abstract all data fetching logic. UI components do not call the API directly. Instead, they call a repository (e.g., `productRepository.getProducts()`). This allows us to easily mock data or swap out the backend without changing the Vue components.

### 2. Data Mappers (`app/api/mappers/`)
APIs often return raw data that isn't perfectly structured for the frontend. Mappers take the raw API response (DTO) and transform it into clean Domain Models (defined in `app/types/`). This isolates backend schema changes from the frontend UI.

### 3. Native CSS Design System (`app/assets/css/`)
The project intentionally avoids Tailwind. All styling is achieved via standard CSS using CSS variables defined in `tokens.css`. This ensures maximum control over the luxury aesthetic and custom animations.

## Setup Instructions

Make sure to install dependencies:

```bash
npm install
```

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

Build the application for production:

```bash
npm run build
```
# dev-desactplus
