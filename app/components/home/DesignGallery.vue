<script setup lang="ts">
import Container from '../ui/Container.vue'
import { ref, computed } from 'vue'
import { useCart } from '~/composables/useCart'

// Product hotspot on a gallery image
interface Hotspot {
  x: number // percentage from left
  y: number // percentage from top
  title: string
  price: string
  description: string
  image: string
  link: string
  variantId?: string
}

// Gallery item type
interface GalleryItem {
  id: string
  src: string
  alt: string
  category: string
  aspect: 'tall' | 'wide' | 'square'
  link: string
  hotspots?: Hotspot[]
}

// Filter categories
const filterCategories = [
  'All',
  'Salon',
  'Chambre',
  'Salle à manger',
  'Cuisine',
  'Bureau',
  'Extérieur',
  'Salle de bain',
  'Décoration',
]

// Gallery items with product hotspots
const galleryItems: GalleryItem[] = [
  {
    id: '1',
    src: '/images/collection-salon.png',
    alt: 'Salon contemporain avec table et suspensions',
    category: 'Salon',
    aspect: 'tall',
    link: '/products?category=tables',
    hotspots: [
      {
        x: 55,
        y: 18,
        title: 'Solitaire Pendant Light',
        price: '$450.00',
        description: 'Multi-tiered contemporary pendant lamp with matte white finish and brushed brass rod.',
        image: '/images/category-lighting.jpg',
        link: '/products?category=lighting',
      },
      {
        x: 54,
        y: 43,
        title: 'Kumo Dining Table',
        price: '$1,820.00',
        description: 'The compact and well-proportioned silhouette of marble and walnut for timeless gatherings.',
        image: '/images/category-tables.jpg',
        link: '/products?category=tables',
      },
      {
        x: 15,
        y: 48,
        title: 'Velvet Curve Chair',
        price: '$340.00',
        description: 'Sculpted dining armchair upholstered in ultra-soft taupe velvet with matte black steel legs.',
        image: '/images/category-chairs.jpg',
        link: '/products?category=chairs',
      },
    ],
  },
  {
    id: '2',
    src: '/images/category-textiles.jpg',
    alt: 'Fauteuil et textiles contemporains',
    category: 'Salon',
    aspect: 'tall',
    link: '/products?category=armchairs',
    hotspots: [
      {
        x: 38,
        y: 55,
        title: 'Elephant',
        price: '$1,820.00',
        description: 'The compact and well-proportioned silhouette of both the seats and the backrest.',
        image: '/images/gallery/prod-elephant-armchair.png',
        link: '/products?category=armchairs',
      },
      {
        x: 65,
        y: 38,
        title: 'Chunky Wool Throw',
        price: '$195.00',
        description: 'Hand-knitted oversized wool throw bringing tactile warmth and cozy texture.',
        image: '/images/category-textiles.jpg',
        link: '/products?category=textiles',
      },
    ],
  },
  {
    id: '3',
    src: '/images/collection-dining.png',
    alt: 'Salle à manger moderne avec table en bois massif',
    category: 'Salle à manger',
    aspect: 'wide',
    link: '/products?category=tables',
    hotspots: [
      {
        x: 35,
        y: 22,
        title: 'Ceramic Pendant Light',
        price: '$280.00',
        description: 'Organic ceramic suspension with natural earthenware texture and warm diffused radiance.',
        image: '/images/category-lighting.jpg',
        link: '/products?category=lighting',
      },
      {
        x: 48,
        y: 56,
        title: 'Nordic Oak Dining Table',
        price: '$1,490.00',
        description: 'Solid natural oak dining table with softly radiused corners and sculptural base.',
        image: '/images/category-tables.jpg',
        link: '/products?category=tables',
      },
      {
        x: 72,
        y: 60,
        title: 'Curved Lounge Chair',
        price: '$420.00',
        description: 'Molded wood frame wrapped in textural bouclé upholstery.',
        image: '/images/category-chairs.jpg',
        link: '/products?category=armchairs',
      },
    ],
  },
  {
    id: '4',
    src: '/images/category-chairs.jpg',
    alt: 'Chaise design scandinave',
    category: 'Salon',
    aspect: 'square',
    link: '/products?category=chairs',
    hotspots: [
      {
        x: 50,
        y: 50,
        title: 'Scandi Dining Chair',
        price: '$290.00',
        description: 'Iconic mid-century silhouette in solid ash with ergonomic molded curved backrest.',
        image: '/images/category-chairs.jpg',
        link: '/products?category=chairs',
      },
    ],
  },
  {
    id: '5',
    src: '/images/collection-bedroom.png',
    alt: 'Chambre élégante aux tons neutres',
    category: 'Chambre',
    aspect: 'tall',
    link: '/products?category=beds',
    hotspots: [
      {
        x: 50,
        y: 56,
        title: 'Calm Linen King Bed',
        price: '$2,250.00',
        description: 'Upholstered platform bed tailored in Belgian linen with solid oak tapered legs.',
        image: '/images/category-beds.jpg',
        link: '/products?category=beds',
      },
      {
        x: 24,
        y: 38,
        title: 'Alabaster Table Lamp',
        price: '$180.00',
        description: 'Translucent Spanish alabaster cylinder emitting a soothing, mellow bedside glow.',
        image: '/images/category-lighting.jpg',
        link: '/products?category=lighting',
      },
    ],
  },
  {
    id: '6',
    src: '/images/kitchen.jpeg',
    alt: 'Cuisine ouverte avec ilot central',
    category: 'Cuisine',
    aspect: 'wide',
    link: '/products?category=tables',
    hotspots: [
      {
        x: 50,
        y: 60,
        title: 'Oak Kitchen Island',
        price: '$1,350.00',
        description: 'Solid natural timber worktable with integrated open slatted shelving.',
        image: '/images/category-tables.jpg',
        link: '/products?category=tables',
      },
      {
        x: 30,
        y: 45,
        title: 'Ceramic Pitcher Set',
        price: '$85.00',
        description: 'Handmade stoneware ceramic pitcher and bowls with satin glaze.',
        image: '/images/category-decor.jpg',
        link: '/products?category=decor',
      },
    ],
  },
  {
    id: '7',
    src: '/images/category-decor.jpg',
    alt: 'Objets de décoration design',
    category: 'Décoration',
    aspect: 'square',
    link: '/products?category=decor',
    hotspots: [
      {
        x: 50,
        y: 45,
        title: 'Terracotta Vase Trio',
        price: '$120.00',
        description: 'Hand-thrown earthen vases in warm earthy pigments and matte mineral slip.',
        image: '/images/category-decor.jpg',
        link: '/products?category=decor',
      },
    ],
  },
  {
    id: '8',
    src: '/images/category-lighting.jpg',
    alt: 'Luminaire suspension design',
    category: 'Décoration',
    aspect: 'tall',
    link: '/products?category=lighting',
    hotspots: [
      {
        x: 50,
        y: 35,
        title: 'Halo Brass Chandelier',
        price: '$680.00',
        description: 'Circular architectural ring suspended with warm dimmable LED ambiance.',
        image: '/images/category-lighting.jpg',
        link: '/products?category=lighting',
      },
    ],
  },
  {
    id: '9',
    src: '/images/collection-decoration.png',
    alt: 'Décoration intérieure avec plantes',
    category: 'Décoration',
    aspect: 'wide',
    link: '/products?category=decor',
    hotspots: [
      {
        x: 35,
        y: 50,
        title: 'Monstera Ceramic Planter',
        price: '$140.00',
        description: 'Elevated matte ceramic pedestal pot with porous terracotta reservoir.',
        image: '/images/category-decor.jpg',
        link: '/products?category=decor',
      },
      {
        x: 65,
        y: 65,
        title: 'Fluted Pedestal Stand',
        price: '$260.00',
        description: 'Fluted architectural plinth crafted from cast plaster and aggregate stone.',
        image: '/images/category-decor.jpg',
        link: '/products?category=decor',
      },
    ],
  },
  {
    id: '10',
    src: '/images/bathrom.jpeg',
    alt: 'Salle de bain moderne',
    category: 'Salle de bain',
    aspect: 'square',
    link: '/products?category=decor',
    hotspots: [
      {
        x: 50,
        y: 50,
        title: 'Stone Washbasin Accessories',
        price: '$95.00',
        description: 'Monolithic travertine soap dispenser and marble amenity canister set.',
        image: '/images/category-decor.jpg',
        link: '/products?category=decor',
      },
    ],
  },
  {
    id: '11',
    src: '/images/category-tables.jpg',
    alt: 'Table basse en bois et métal',
    category: 'Salon',
    aspect: 'wide',
    link: '/products?category=tables',
    hotspots: [
      {
        x: 50,
        y: 50,
        title: 'Low Profile Coffee Table',
        price: '$580.00',
        description: 'Low-slung minimalist coffee table with organic bevel edge in dark walnut.',
        image: '/images/category-tables.jpg',
        link: '/products?category=tables',
      },
    ],
  },
  {
    id: '12',
    src: '/images/category-sofas.jpg',
    alt: 'Canapé d\'angle modulable',
    category: 'Salon',
    aspect: 'tall',
    link: '/products?category=sofas',
    hotspots: [
      {
        x: 50,
        y: 55,
        title: 'Milano Modular Sofa',
        price: '$2,450.00',
        description: 'Deep-seat sectional sofa in heavyweight cream bouclé with down-blend cushions.',
        image: '/images/category-sofas.jpg',
        link: '/products?category=sofas',
      },
      {
        x: 30,
        y: 35,
        title: 'Textured Linen Cushion',
        price: '$65.00',
        description: 'Stonewashed pure Belgian linen accent pillow with feather insert.',
        image: '/images/category-textiles.jpg',
        link: '/products?category=textiles',
      },
    ],
  },
  {
    id: '13',
    src: '/images/category-beds.jpg',
    alt: 'Lit king size avec tête de lit capitonnée',
    category: 'Chambre',
    aspect: 'square',
    link: '/products?category=beds',
    hotspots: [
      {
        x: 50,
        y: 50,
        title: 'Tufted Velvet Platform Bed',
        price: '$1,950.00',
        description: 'Generously proportioned channel-tufted headboard in matte velvet finish.',
        image: '/images/category-beds.jpg',
        link: '/products?category=beds',
      },
    ],
  },
  {
    id: '14',
    src: '/images/category-armchairs.jpg',
    alt: 'Fauteuil de lecture confortable',
    category: 'Salon',
    aspect: 'wide',
    link: '/products?category=armchairs',
    hotspots: [
      {
        x: 50,
        y: 50,
        title: 'Cosy Swivel Armchair',
        price: '$890.00',
        description: 'Ergonomic 360-degree swivel armchair with cocooning high-density foam.',
        image: '/images/category-armchairs.jpg',
        link: '/products?category=armchairs',
      },
    ],
  },
  {
    id: '15',
    src: '/images/collection-lighting.png',
    alt: 'Éclairage d\'ambiance pour salon',
    category: 'Décoration',
    aspect: 'tall',
    link: '/products?category=lighting',
    hotspots: [
      {
        x: 45,
        y: 30,
        title: 'Arc Brass Floor Lamp',
        price: '$540.00',
        description: 'Sweeping architectural brass arch extending over sofa with marble counterbalance.',
        image: '/images/category-lighting.jpg',
        link: '/products?category=lighting',
      },
    ],
  },
  {
    id: '16',
    src: '/images/category-storage.jpg',
    alt: 'Meuble de rangement design',
    category: 'Bureau',
    aspect: 'square',
    link: '/products?category=storage',
    hotspots: [
      {
        x: 50,
        y: 50,
        title: 'Modular Credenza',
        price: '$1,120.00',
        description: 'Fluted sliding timber doors concealing adjustable interior shelving.',
        image: '/images/category-storage.jpg',
        link: '/products?category=storage',
      },
    ],
  },
  {
    id: '17',
    src: '/images/hero-living-room.jpg',
    alt: 'Living room design inspiration',
    category: 'Salon',
    aspect: 'wide',
    link: '/products?category=sofas',
    hotspots: [
      {
        x: 55,
        y: 55,
        title: 'Horizon Lounge Sectional',
        price: '$2,800.00',
        description: 'Low-profile architectural modular sofa system in premium natural oat fabric.',
        image: '/images/category-sofas.jpg',
        link: '/products?category=sofas',
      },
      {
        x: 30,
        y: 30,
        title: 'Minimal Globe Lamp',
        price: '$210.00',
        description: 'Satin matte brass stand supporting hand-blown milky glass orb.',
        image: '/images/category-lighting.jpg',
        link: '/products?category=lighting',
      },
    ],
  },
  {
    id: '18',
    src: '/images/category-toys.jpg',
    alt: 'Espace enfant décoré',
    category: 'Décoration',
    aspect: 'square',
    link: '/products?category=toys',
    hotspots: [
      {
        x: 50,
        y: 50,
        title: 'Wooden Heirloom Play Set',
        price: '$110.00',
        description: 'Sustainably harvested beechwood educational building blocks with organic beeswax finish.',
        image: '/images/category-toys.jpg',
        link: '/products?category=toys',
      },
    ],
  },
]

const activeFilter = ref('All')
const itemsPerPage = 9
const visibleCount = ref(itemsPerPage)

const filteredItems = computed(() => {
  if (activeFilter.value === 'All') return galleryItems
  return galleryItems.filter(item => item.category === activeFilter.value)
})

const visibleItems = computed(() => {
  return filteredItems.value.slice(0, visibleCount.value)
})

const totalFiltered = computed(() => filteredItems.value.length)
const hasMore = computed(() => visibleCount.value < totalFiltered.value)

function setFilter(cat: string) {
  activeFilter.value = cat
  visibleCount.value = itemsPerPage
  activeHotspotKey.value = null
}

function showMore() {
  visibleCount.value += itemsPerPage
}

// Hotspot hover & active state management
const { add: addToCart, isOpen: isCartOpen } = useCart()
const activeHotspotKey = ref<string | null>(null)
let closeTimeout: ReturnType<typeof setTimeout> | null = null

function openHotspot(key: string) {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
  activeHotspotKey.value = key
}

function scheduleCloseHotspot(key: string) {
  if (closeTimeout) clearTimeout(closeTimeout)
  closeTimeout = setTimeout(() => {
    if (activeHotspotKey.value === key) {
      activeHotspotKey.value = null
    }
  }, 220)
}

function toggleHotspot(key: string) {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
  if (activeHotspotKey.value === key) {
    activeHotspotKey.value = null
  } else {
    activeHotspotKey.value = key
  }
}

// Added to cart feedback map
const addedMap = ref<Record<string, boolean>>({})

async function onAddToCart(spot: Hotspot, key: string, e: Event) {
  e.preventDefault()
  e.stopPropagation()

  if (spot.variantId) {
    try {
      await addToCart(spot.variantId, 1)
    } catch (err) {
      console.error(err)
    }
  }

  addedMap.value[key] = true
  isCartOpen.value = true

  setTimeout(() => {
    addedMap.value[key] = false
  }, 2200)
}

// Scroll filter pills
const pillsContainer = ref<HTMLElement | null>(null)
</script>

<template>
  <section class="dg-section">
    <Container>
      <!-- Header -->
      <div class="dg-header">
        <h2 class="dg-title">Design inspiration and modern home ideas</h2>
      </div>

      <!-- Filter Pills -->
      <div class="dg-pills-wrapper">
        <div ref="pillsContainer" class="dg-pills hide-scrollbar">
          <button
            v-for="cat in filterCategories"
            :key="cat"
            class="dg-pill"
            :class="{ 'dg-pill--active': activeFilter === cat }"
            @click="setFilter(cat)"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Masonry Grid -->
      <div class="dg-masonry">
        <TransitionGroup name="gallery-item">
          <div
            v-for="item in visibleItems"
            :key="item.id"
            class="dg-item"
            :class="[
              `dg-item--${item.aspect}`,
              { 'dg-item--has-active-hotspot': item.hotspots?.some((_, idx) => activeHotspotKey === `${item.id}-${idx}`) }
            ]"
          >
            <!-- Background Image Link -->
            <NuxtLink :to="item.link" class="dg-image-link">
              <img
                :src="item.src"
                :alt="item.alt"
                class="dg-image"
                loading="lazy"
              >
              <div class="dg-overlay">
                <span class="dg-overlay-cat">{{ item.category }}</span>
              </div>
            </NuxtLink>

            <!-- Product Hotspot Indicators -->
            <template v-if="item.hotspots && item.hotspots.length > 0">
              <div
                v-for="(spot, idx) in item.hotspots"
                :key="`${item.id}-spot-${idx}`"
                class="dg-hotspot"
                :class="[
                  `dg-hotspot--y-${spot.y < 45 ? 'bottom' : 'top'}`,
                  `dg-hotspot--x-${spot.x < 30 ? 'right' : spot.x > 70 ? 'left' : 'center'}`,
                  { 'dg-hotspot--active': activeHotspotKey === `${item.id}-${idx}` }
                ]"
                :style="{ left: `${spot.x}%`, top: `${spot.y}%` }"
                @mouseenter="openHotspot(`${item.id}-${idx}`)"
                @mouseleave="scheduleCloseHotspot(`${item.id}-${idx}`)"
                @click.stop="toggleHotspot(`${item.id}-${idx}`)"
              >
                <!-- Indicator Ring Button -->
                <button
                  type="button"
                  class="dg-hotspot-btn"
                  :aria-label="`Product: ${spot.title}`"
                >
                  <span class="dg-hotspot-pulse" />
                  <span class="dg-hotspot-dot" />
                </button>

                <!-- Hover Product Card Popover -->
                <Transition name="dg-card-fade">
                  <div
                    v-if="activeHotspotKey === `${item.id}-${idx}`"
                    class="dg-card"
                    @mouseenter="openHotspot(`${item.id}-${idx}`)"
                    @mouseleave="scheduleCloseHotspot(`${item.id}-${idx}`)"
                    @click.stop
                  >
                    <!-- Product Thumbnail -->
                    <NuxtLink :to="spot.link" class="dg-card-image-wrap">
                      <img
                        :src="spot.image"
                        :alt="spot.title"
                        class="dg-card-image"
                        loading="lazy"
                      >
                    </NuxtLink>

                    <!-- Product Title -->
                    <NuxtLink :to="spot.link" class="dg-card-title-link">
                      <h4 class="dg-card-title">{{ spot.title }}</h4>
                    </NuxtLink>

                    <!-- Product Price -->
                    <div class="dg-card-price">{{ spot.price }}</div>

                    <!-- Product Description -->
                    <p class="dg-card-desc">{{ spot.description }}</p>

                    <!-- Add To Cart Button -->
                    <button
                      type="button"
                      class="dg-card-btn"
                      :class="{ 'dg-card-btn--added': addedMap[`${item.id}-${idx}`] }"
                      @click="onAddToCart(spot, `${item.id}-${idx}`, $event)"
                    >
                      <span v-if="addedMap[`${item.id}-${idx}`]">Added ✓</span>
                      <span v-else>Add to cart</span>
                    </button>
                  </div>
                </Transition>
              </div>
            </template>
          </div>
        </TransitionGroup>
      </div>

      <!-- Footer -->
      <div class="dg-footer">
        <div class="dg-count-bar">
          <div class="dg-count-fill" :style="{ width: `${Math.min((visibleItems.length / totalFiltered) * 100, 100)}%` }" />
        </div>
        <p class="dg-count-text">
          Showing {{ visibleItems.length }} of {{ totalFiltered }} results
        </p>
        <button
          v-if="hasMore"
          class="dg-show-more"
          @click="showMore"
        >
          Show more
        </button>
      </div>
    </Container>
  </section>
</template>

<style scoped>
.dg-section {
  padding-top: var(--space-24);
  padding-bottom: var(--space-24);
}

/* ── Header ────────────────────────────────── */
.dg-header {
  margin-bottom: var(--space-8);
}

.dg-title {
  font-family: var(--font-body);
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--dp-charcoal);
  margin: 0;
  letter-spacing: -0.01em;
}

@media (min-width: 768px) {
  .dg-title {
    font-size: 2rem;
  }
}

/* ── Filter Pills ──────────────────────────── */
.dg-pills-wrapper {
  margin-bottom: var(--space-10);
  position: relative;
}

.dg-pills {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  padding-bottom: var(--space-2);
  -webkit-overflow-scrolling: touch;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.dg-pill {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background-color: transparent;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--dp-charcoal);
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--duration-base) var(--ease-out);
}

.dg-pill:hover {
  border-color: var(--dp-charcoal);
}

.dg-pill--active {
  background-color: var(--dp-black);
  border-color: var(--dp-black);
  color: var(--dp-white);
}

.dg-pill--active:hover {
  background-color: var(--dp-black);
  border-color: var(--dp-black);
}

/* ── Masonry Grid ──────────────────────────── */
.dg-masonry {
  columns: 2;
  column-gap: var(--space-4);
}

@media (min-width: 768px) {
  .dg-masonry {
    columns: 3;
    column-gap: var(--space-4);
  }
}

@media (min-width: 1280px) {
  .dg-masonry {
    columns: 3;
    column-gap: var(--space-5);
  }
}

.dg-item {
  break-inside: avoid;
  margin-bottom: var(--space-4);
  position: relative;
  display: block;
  /* NO overflow:hidden here so the hover card can float outside item boundaries */
}

.dg-item--has-active-hotspot {
  z-index: 45;
}

@media (min-width: 1280px) {
  .dg-item {
    margin-bottom: var(--space-5);
  }
}

/* ── Aspect-based heights (match screenshot) ── */
.dg-item--tall {
  height: 360px;
}

.dg-item--wide {
  height: 240px;
}

.dg-item--square {
  height: 300px;
}

@media (min-width: 768px) {
  .dg-item--tall {
    height: 480px;
  }

  .dg-item--wide {
    height: 300px;
  }

  .dg-item--square {
    height: 360px;
  }
}

@media (min-width: 1280px) {
  .dg-item--tall {
    height: 540px;
  }

  .dg-item--wide {
    height: 320px;
  }

  .dg-item--square {
    height: 400px;
  }
}

/* ── Image Link & Zoom ─────────────────────── */
.dg-image-link {
  display: block;
  width: 100%;
  height: 100%;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
}

.dg-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.dg-item:hover .dg-image {
  transform: scale(1.04);
}

/* ── Overlay ───────────────────────────────── */
.dg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 55%, rgba(0, 0, 0, 0.45) 100%);
  display: flex;
  align-items: flex-end;
  padding: var(--space-4);
  opacity: 0;
  transition: opacity var(--duration-base) var(--ease-out);
  pointer-events: none;
}

.dg-item:hover .dg-overlay {
  opacity: 1;
}

.dg-overlay-cat {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--dp-white);
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-full);
}

/* ── Product Hotspots ──────────────────────── */
.dg-hotspot {
  position: absolute;
  z-index: 20;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dg-hotspot--active {
  z-index: 60;
}

/* ── Hotspot Ring Button ───────────────────── */
.dg-hotspot-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 2px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.28);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  outline: none;
  transition: transform 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
  position: relative;
}

.dg-hotspot-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
  transition: transform 0.2s ease;
}

/* Pulsing outer wave */
.dg-hotspot-pulse {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.75);
  animation: hotspot-pulse 2.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
  pointer-events: none;
}

@keyframes hotspot-pulse {
  0% {
    transform: scale(0.85);
    opacity: 0.9;
  }
  65% {
    transform: scale(1.6);
    opacity: 0;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}

.dg-hotspot:hover .dg-hotspot-btn,
.dg-hotspot--active .dg-hotspot-btn {
  transform: scale(1.18);
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
}

.dg-hotspot:hover .dg-hotspot-pulse,
.dg-hotspot--active .dg-hotspot-pulse {
  animation-play-state: paused;
  opacity: 0;
}

/* ── Product Card Popover ──────────────────── */
.dg-card {
  position: absolute;
  width: 215px;
  background-color: #ffffff;
  border-radius: 14px;
  box-shadow: 0 16px 36px -4px rgba(0, 0, 0, 0.16), 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 22px 18px 20px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: default;
  pointer-events: auto;
}

/* Invisible hit bridge so mouse doesn't leave when crossing between button and card */
.dg-card::before {
  content: '';
  position: absolute;
  inset: -14px;
  z-index: -1;
  pointer-events: auto;
}

/* ── Placement variations ── */
/* Vertical: top (opens above dot) */
.dg-hotspot--y-top .dg-card {
  bottom: calc(100% + 14px);
}

/* Vertical: bottom (opens below dot) */
.dg-hotspot--y-bottom .dg-card {
  top: calc(100% + 14px);
}

/* Horizontal: center */
.dg-hotspot--x-center .dg-card {
  left: 50%;
  transform: translateX(-50%);
}

/* Horizontal: right (aligned towards right of dot) */
.dg-hotspot--x-right .dg-card {
  left: -12px;
  transform: none;
}

/* Horizontal: left (aligned towards left of dot) */
.dg-hotspot--x-left .dg-card {
  right: -12px;
  left: auto;
  transform: none;
}

/* ── Card Interior Elements ────────────────── */
.dg-card-image-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 110px;
  height: 110px;
  margin-bottom: 12px;
  text-decoration: none;
}

.dg-card-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 6px;
  transition: transform 0.3s ease;
}

.dg-card-image-wrap:hover .dg-card-image {
  transform: scale(1.05);
}

.dg-card-title-link {
  text-decoration: none;
  color: inherit;
  margin-bottom: 4px;
}

.dg-card-title {
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 700;
  color: #18181b;
  margin: 0;
  line-height: 1.25;
  transition: color 0.2s ease;
}

.dg-card-title-link:hover .dg-card-title {
  color: #ea7e49;
}

.dg-card-price {
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 700;
  color: #ea7e49;
  margin-bottom: 10px;
  letter-spacing: -0.01em;
}

.dg-card-desc {
  font-family: var(--font-body);
  font-size: 0.78rem;
  line-height: 1.45;
  color: #71717a;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dg-card-btn {
  background-color: #ea7e49;
  color: #ffffff;
  font-family: var(--font-body);
  font-size: 0.78rem;
  font-weight: 600;
  padding: 8px 22px;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(234, 126, 73, 0.28);
}

.dg-card-btn:hover {
  background-color: #d96d36;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(234, 126, 73, 0.4);
}

.dg-card-btn:active {
  transform: translateY(0);
}

.dg-card-btn--added {
  background-color: #10b981 !important;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3) !important;
}

/* ── Card Transition Animation ─────────────── */
.dg-card-fade-enter-active,
.dg-card-fade-leave-active {
  transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.dg-card-fade-enter-from,
.dg-card-fade-leave-to {
  opacity: 0;
  transform: scale(0.94);
}

.dg-hotspot--x-center .dg-card-fade-enter-from,
.dg-hotspot--x-center .dg-card-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) scale(0.94);
}

/* ── Footer ────────────────────────────────── */
.dg-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: var(--space-12);
  gap: var(--space-4);
}

.dg-count-bar {
  width: 100%;
  max-width: 280px;
  height: 2px;
  background-color: var(--color-border);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.dg-count-fill {
  height: 100%;
  background-color: var(--dp-charcoal);
  border-radius: var(--radius-full);
  transition: width var(--duration-slow) var(--ease-out);
}

.dg-count-text {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--dp-ash);
  margin: 0;
}

.dg-show-more {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 2rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--dp-charcoal);
  background-color: transparent;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--dp-charcoal);
  cursor: pointer;
  transition: all var(--duration-base) var(--ease-out);
}

.dg-show-more:hover {
  background-color: var(--dp-charcoal);
  color: var(--dp-white);
}

/* ── TransitionGroup Animations ────────────── */
.gallery-item-enter-active {
  transition: all 0.5s var(--ease-out);
}

.gallery-item-leave-active {
  transition: all 0.3s var(--ease-out);
}

.gallery-item-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.gallery-item-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.gallery-item-move {
  transition: transform 0.5s var(--ease-out);
}
</style>
