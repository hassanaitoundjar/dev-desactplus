<script setup lang="ts">
import Container from '../ui/Container.vue'
import { ref, computed } from 'vue'

// Product hotspot on a gallery image
interface Hotspot {
  x: number // percentage from left
  y: number // percentage from top
  label: string
  link: string
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
    alt: 'Salon contemporain avec canapé en velours',
    category: 'Salon',
    aspect: 'tall',
    link: '/products?category=sofas',
    hotspots: [
      { x: 45, y: 25, label: 'Suspension design', link: '/products?category=lighting' },
      { x: 50, y: 58, label: 'Table ronde', link: '/products?category=tables' },
      { x: 25, y: 65, label: 'Chaise velours', link: '/products?category=chairs' },
      { x: 78, y: 30, label: 'Étagère vitrée', link: '/products?category=storage' },
    ],
  },
  {
    id: '2',
    src: '/images/category-textiles.jpg',
    alt: 'Textiles et couvertures artisanales',
    category: 'Décoration',
    aspect: 'tall',
    link: '/products?category=textiles',
    hotspots: [
      { x: 60, y: 40, label: 'Plaid chunky', link: '/products?category=textiles' },
      { x: 35, y: 55, label: 'Fauteuil lounge', link: '/products?category=armchairs' },
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
      { x: 35, y: 22, label: 'Suspensions céramique', link: '/products?category=lighting' },
      { x: 45, y: 55, label: 'Table design', link: '/products?category=tables' },
      { x: 72, y: 60, label: 'Fauteuil courbe', link: '/products?category=armchairs' },
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
      { x: 50, y: 50, label: 'Chaise scandinave', link: '/products?category=chairs' },
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
      { x: 50, y: 50, label: 'Lit king size', link: '/products?category=beds' },
      { x: 25, y: 30, label: 'Lampe de chevet', link: '/products?category=lighting' },
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
      { x: 50, y: 60, label: 'Table en bois', link: '/products?category=tables' },
      { x: 30, y: 45, label: 'Vaisselle design', link: '/products?category=decor' },
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
      { x: 50, y: 45, label: 'Décoration intérieure', link: '/products?category=decor' },
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
      { x: 50, y: 35, label: 'Luminaire suspension', link: '/products?category=lighting' },
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
      { x: 35, y: 50, label: 'Plante décorative', link: '/products?category=decor' },
      { x: 65, y: 65, label: 'Cache-pot design', link: '/products?category=decor' },
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
      { x: 50, y: 50, label: 'Accessoires bain', link: '/products?category=decor' },
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
      { x: 50, y: 50, label: 'Table basse', link: '/products?category=tables' },
    ],
  },
  {
    id: '12',
    src: '/images/category-sofas.jpg',
    alt: 'Canapé d\'angle en cuir',
    category: 'Salon',
    aspect: 'tall',
    link: '/products?category=sofas',
    hotspots: [
      { x: 50, y: 55, label: 'Canapé d\'angle', link: '/products?category=sofas' },
      { x: 30, y: 35, label: 'Coussin décoratif', link: '/products?category=textiles' },
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
      { x: 50, y: 50, label: 'Lit capitonné', link: '/products?category=beds' },
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
      { x: 50, y: 50, label: 'Fauteuil lecture', link: '/products?category=armchairs' },
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
      { x: 45, y: 30, label: 'Lampadaire arc', link: '/products?category=lighting' },
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
      { x: 50, y: 50, label: 'Rangement modulaire', link: '/products?category=storage' },
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
      { x: 55, y: 55, label: 'Canapé modulable', link: '/products?category=sofas' },
      { x: 30, y: 30, label: 'Lampe design', link: '/products?category=lighting' },
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
      { x: 50, y: 50, label: 'Jouets design', link: '/products?category=toys' },
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
}

function showMore() {
  visibleCount.value += itemsPerPage
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
            :class="`dg-item--${item.aspect}`"
          >
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
            <template v-if="item.hotspots">
              <NuxtLink
                v-for="(spot, idx) in item.hotspots"
                :key="`${item.id}-spot-${idx}`"
                :to="spot.link"
                class="dg-hotspot"
                :style="{ left: `${spot.x}%`, top: `${spot.y}%` }"
                @click.stop
              >
                <span class="dg-hotspot-dot">
                  <span class="dg-hotspot-pulse"></span>
                </span>
                <span class="dg-hotspot-tooltip">{{ spot.label }}</span>
              </NuxtLink>
            </template>
          </div>
        </TransitionGroup>
      </div>

      <!-- Footer -->
      <div class="dg-footer">
        <div class="dg-count-bar">
          <div class="dg-count-fill" :style="{ width: `${Math.min((visibleItems.length / totalFiltered) * 100, 100)}%` }"></div>
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
  background-color: #7c5cfc;
  border-color: #7c5cfc;
  color: var(--dp-white);
}

.dg-pill--active:hover {
  background-color: #6a48e8;
  border-color: #6a48e8;
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
  overflow: hidden;
  border-radius: var(--radius-md);
  display: block;
}

@media (min-width: 1280px) {
  .dg-item {
    margin-bottom: var(--space-5);
  }
}

/* ── Aspect-based fixed heights (match screenshot) ── */
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

/* ── Image Link ────────────────────────────── */
.dg-image-link {
  display: block;
  width: 100%;
  height: 100%;
  text-decoration: none;
}

.dg-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.dg-item:hover .dg-image {
  transform: scale(1.05);
}

/* ── Overlay ───────────────────────────────── */
.dg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 50%, rgba(0, 0, 0, 0.45) 100%);
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

/* ── Product Hotspot Indicators ────────────── */
.dg-hotspot {
  position: absolute;
  z-index: 5;
  transform: translate(-50%, -50%);
  text-decoration: none;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.dg-hotspot-dot {
  position: relative;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dg-hotspot-dot::before {
  content: '';
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--dp-white);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  position: relative;
  z-index: 2;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.dg-hotspot:hover .dg-hotspot-dot::before {
  transform: scale(1.3);
  background-color: #7c5cfc;
}

/* Pulse ring animation */
.dg-hotspot-pulse {
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.6);
  animation: hotspot-pulse 2s ease-out infinite;
}

@keyframes hotspot-pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  70% {
    transform: scale(2.2);
    opacity: 0;
  }
  100% {
    transform: scale(2.2);
    opacity: 0;
  }
}

/* Tooltip */
.dg-hotspot-tooltip {
  position: absolute;
  left: calc(100% + 6px);
  top: 50%;
  transform: translateY(-50%);
  background-color: var(--dp-white);
  color: var(--dp-charcoal);
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 500;
  padding: 0.35rem 0.65rem;
  border-radius: var(--radius-md);
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease, transform 0.25s ease;
  transform: translateY(-50%) translateX(4px);
}

.dg-hotspot-tooltip::before {
  content: '';
  position: absolute;
  left: -4px;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
  width: 8px;
  height: 8px;
  background-color: var(--dp-white);
  box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.05);
}

.dg-hotspot:hover .dg-hotspot-tooltip {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

/* On smaller items, show tooltip to the left if near right edge */
@media (max-width: 768px) {
  .dg-hotspot-tooltip {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
  }
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
