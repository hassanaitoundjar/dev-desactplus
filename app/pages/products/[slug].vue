<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSeo, useBreadcrumbs } from '~/composables/useSeo'
import Container from '~/components/ui/Container.vue'
import ProductCard from '~/components/product/ProductCard.vue'
import { useProduct } from '~/composables/useProduct'
import { useCart } from '~/composables/useCart'
import { useWishlist } from '~/composables/useWishlist'
import { useReviews } from '~/composables/useReviews'
import { formatPrice } from '~/utils/formatPrice'
import { Heart, Truck, ShieldCheck, Headset, Shield, User, ArrowLeftRight, Activity } from 'lucide-vue-next'

definePageMeta({ layout: 'shop' })

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const { product, related, pending, error } = useProduct(slug)
const { add: addToCart, isOpen: isCartOpen } = useCart()
const { toggle: toggleWishlist, isInWishlist } = useWishlist()
const { reviews, summary, isLoading: reviewsLoading, isSubmitting, error: reviewsError, fetchReviews, submitReview, hasReviews } = useReviews()

const quantity = ref(1)
const activeImage = ref(0)
const selectedFabric = ref('')
const selectedColor = ref('')
const selectedDimension = ref('')
const activeTab = ref('description')

const currentImage = computed(() => {
  if (!product.value || !product.value.images.length) return null
  const idx = Math.min(activeImage.value, product.value.images.length - 1)
  return product.value.images[idx] || null
})

function setImage(idx: number) {
  activeImage.value = idx
}

// Variant resolution
const selectedVariant = computed(() => {
  if (!product.value || !product.value.variants || product.value.variants.length === 0) return null
  
  // Find a variant that matches all selected options if they exist
  return product.value.variants.find(variant => {
    let match = true
    const opts = variant.options || {}
    
    // Check fabric (if product has fabrics and one is selected)
    if (selectedFabric.value) {
      // We need to know which option key corresponds to fabric, color, dimension.
      // Usually, API option values are just strings, but if options are key-value:
      // For safety, we check if the variant's options object values contain our selection.
      // E.g., Object.values(opts).includes(selectedFabric.value)
      const hasFabric = Object.values(opts).some(val => 
        typeof val === 'string' && val.toLowerCase() === selectedFabric.value.toLowerCase()
      )
      if (!hasFabric) match = false
    }
    
    // Check color
    if (match && selectedColor.value) {
      const hasColor = Object.values(opts).some(val => 
        typeof val === 'string' && val.toLowerCase() === selectedColor.value.toLowerCase()
      )
      if (!hasColor) match = false
    }
    
    // Check dimension
    if (match && selectedDimension.value) {
      const hasDim = Object.values(opts).some(val => 
        typeof val === 'string' && val.toLowerCase() === selectedDimension.value.toLowerCase()
      )
      if (!hasDim) match = false
    }
    
    return match
  }) || null
})

const displayPrice = computed(() => {
  if (!product.value) return 0
  const basePrice = selectedVariant.value?.price || product.value.price
  return basePrice * quantity.value
})

const displayComparePrice = computed(() => {
  if (!product.value) return null
  const cp = selectedVariant.value?.compareAtPrice || product.value.compareAtPrice
  if (!cp || cp <= 0) return null
  return cp * quantity.value
})



const tabs = computed(() => [
  { id: 'description', label: 'DESCRIPTION' },
  { id: 'details', label: 'DÉTAILS' },
  { id: 'materiaux', label: 'MATÉRIAUX' },
  { id: 'livraison', label: 'LIVRAISON & RETOURS' },
  { id: 'avis', label: `AVIS (${summary.value?.totalReviews ?? product.value?.reviewsCount ?? 0})` },
])

// Initialize defaults once product loads
watch(product, async (p) => {
  if (p) {
    activeImage.value = 0 // Reset image index on route change
    if (p.fabrics?.length) selectedFabric.value = p.fabrics[0] || ''
    if (p.colors?.length) selectedColor.value = p.colors[0] || ''
    if (p.dimensions?.length) selectedDimension.value = p.dimensions[0]?.value || ''
    
    await fetchReviews(p.slug)
    
    useSeo({
      title: p.name,
      description: p.shortDescription || p.description,
      image: p.images[0]?.src || '',
    })
    
    useBreadcrumbs([
      { label: 'Boutique', href: '/products' },
      { label: p.categoryId, href: `/categories/${p.categoryId}` },
      { label: p.name, href: `/products/${p.slug}` },
    ])
  }
}, { immediate: true })

const isWishlisted = computed(() => product.value ? isInWishlist(product.value.id) : false)

const isAddedToCart = ref(false)
function handleAddToCart() {
  if (product.value && selectedVariant.value) {
    addToCart(selectedVariant.value.id, quantity.value)
    isCartOpen.value = true
    isAddedToCart.value = true
    setTimeout(() => {
      isAddedToCart.value = false
    }, 2000)
  }
}

async function handleBuyNow() {
  if (product.value && selectedVariant.value) {
    await addToCart(selectedVariant.value.id, quantity.value)
    navigateTo('/checkout')
  }
}

function handleSwatchClick(type: 'fabric' | 'color', index: number, val: string) {
  if (type === 'fabric') selectedFabric.value = val
  if (type === 'color') selectedColor.value = val
  
  if (product.value && product.value.images[index]) {
    activeImage.value = index
  }
}

// Review form state
const showReviewForm = ref(false)
const reviewForm = ref({
  authorName: '',
  email: '',
  rating: 5,
  title: '',
  content: ''
})

async function handleReviewSubmit() {
  if (!product.value) return
  const success = await submitReview(product.value.slug, { ...reviewForm.value })
  if (success) {
    showReviewForm.value = false
    reviewForm.value = {
      authorName: '',
      email: '',
      rating: 5,
      title: '',
      content: ''
    }
  }
}
</script>

<template>
  <div v-if="pending" class="pdp-page">
    <Container>
      <!-- Skeleton Breadcrumb -->
      <div class="skeleton-breadcrumb">
        <span class="skeleton-bone animate-shimmer" style="width: 60px; height: 12px;" />
        <span class="skeleton-bone animate-shimmer" style="width: 8px; height: 12px;" />
        <span class="skeleton-bone animate-shimmer" style="width: 80px; height: 12px;" />
        <span class="skeleton-bone animate-shimmer" style="width: 8px; height: 12px;" />
        <span class="skeleton-bone animate-shimmer" style="width: 140px; height: 12px;" />
      </div>

      <div class="product-top">
        <!-- Skeleton Gallery -->
        <div class="product-gallery">
          <div class="gallery-thumbnails">
            <div v-for="n in 4" :key="n" class="skeleton-thumb animate-shimmer" />
          </div>
          <div class="gallery-main">
            <div class="skeleton-main-img animate-shimmer" />
          </div>
        </div>

        <!-- Skeleton Product Info -->
        <div class="product-info">
          <div class="skeleton-header">
            <div class="skeleton-bone animate-shimmer" style="width: 70%; height: 32px; border-radius: 4px;" />
            <div class="skeleton-bone animate-shimmer" style="width: 90px; height: 36px; border-radius: 8px;" />
          </div>
          <div class="skeleton-bone animate-shimmer" style="width: 120px; height: 14px; margin-bottom: 0.75rem;" />
          <div class="skeleton-bone animate-shimmer" style="width: 180px; height: 14px; margin-bottom: 2rem;" />
          
          <!-- Skeleton promo box -->
          <div class="skeleton-promo animate-shimmer" />

          <!-- Skeleton description lines -->
          <div class="skeleton-bone animate-shimmer" style="width: 100%; height: 14px; margin-bottom: 0.5rem;" />
          <div class="skeleton-bone animate-shimmer" style="width: 85%; height: 14px; margin-bottom: 0.5rem;" />
          <div class="skeleton-bone animate-shimmer" style="width: 60%; height: 14px; margin-bottom: 2rem;" />

          <!-- Skeleton price -->
          <div class="skeleton-bone animate-shimmer" style="width: 160px; height: 28px; margin-bottom: 2rem;" />

          <!-- Skeleton swatches -->
          <div style="display: flex; gap: 0.75rem; margin-bottom: 2rem;">
            <div v-for="n in 4" :key="n" class="skeleton-swatch animate-shimmer" />
          </div>

          <!-- Skeleton actions -->
          <div class="skeleton-actions">
            <div class="skeleton-bone animate-shimmer" style="width: 130px; height: 48px; border-radius: 4px;" />
            <div class="skeleton-bone animate-shimmer" style="flex: 1; height: 48px; border-radius: 4px;" />
            <div class="skeleton-bone animate-shimmer" style="flex: 1; height: 48px; border-radius: 4px;" />
          </div>

          <!-- Skeleton trust badges -->
          <div class="skeleton-badges">
            <div v-for="n in 4" :key="n" class="skeleton-badge animate-shimmer" />
          </div>
        </div>
      </div>
    </Container>
  </div>
  <div v-else-if="error" class="error-page">
    <Container>Une erreur est survenue : {{ error.message }}</Container>
  </div>
  <div v-else-if="!product" class="error-page">
    <Container>Produit introuvable.</Container>
  </div>
  <div v-else class="pdp-page">
    <Container>
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <NuxtLink to="/" class="breadcrumb-link">Accueil</NuxtLink>
        <span class="breadcrumb-sep">&gt;</span>
        <NuxtLink :to="`/categories/${product.categoryId}`" class="breadcrumb-link capitalize">{{ product.categories?.[0]?.name || product.categoryId || 'decor' }}</NuxtLink>
        <span class="breadcrumb-sep">&gt;</span>
        <span class="breadcrumb-current">{{ product.name }}</span>
      </nav>

      <!-- Top Section -->
      <div class="product-top">
        
        <!-- Gallery -->
        <div class="product-gallery">
          <div class="gallery-thumbnails">
            <button
              v-for="(img, idx) in product.images.slice(0, 5)"
              :key="idx"
              class="thumbnail-btn"
              :class="{ active: activeImage === idx }"
              @click="setImage(idx)"
            >
              <img :src="img.src" :alt="img.alt" class="thumbnail-img" >
            </button>
          </div>
          <div class="gallery-main">
            <img
              v-if="currentImage"
              :key="activeImage"
              :src="currentImage.src"
              :alt="currentImage.alt"
              class="main-img"
            >
          </div>
        </div>

        <!-- Product Info -->
        <div class="product-info">
          
          <div class="product-header-flex">
            <h1 class="product-title">{{ product.name }}</h1>
            <div class="product-brand-box">
              <span class="brand-name capitalize">{{ product.categories?.[0]?.name }}</span>
            </div>
          </div>

          <div class="product-sku-rating">
            <div class="sku-text"><strong>SKU:</strong> {{ product.sku || 'N/A' }}</div>
            <div class="rating-info">
              <div class="review-stars-small">
                <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.round(summary?.averageRating || product.rating || 5) }">★</span>
              </div>
              <span class="reviews-count">({{ summary?.totalReviews ?? product.reviewsCount ?? 2 }} customer reviews)</span>
            </div>
          </div>

          <div v-if="product.collectionId || true" class="product-promo-box">
            <div class="promo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m15 9-6 6"/><path d="M9 9h.01"/><path d="M15 15h.01"/></svg>
            </div>
            <div class="promo-content">
              <h3 class="promo-title capitalize">{{ product.collectionId || 'Soft Edge' }} collection</h3>
              <p class="promo-text">Hurry and get discounts up to 20% <a href="#">Read more</a></p>
            </div>
          </div>

          <div class="product-desc" v-html="product.shortDescription || product.description"></div>

          <div class="product-price-block">
            <p class="product-price">{{ formatPrice(displayPrice) }}</p>
            <p v-if="displayComparePrice" class="product-compare-price">{{ formatPrice(displayComparePrice) }}</p>
          </div>

          <div class="product-options">
            
            <!-- Fabric Selector -->
            <div v-if="product.fabrics?.length" class="option-group">
              <span class="option-label">TISSU</span>
              <div class="swatch-list">
                <button
                  v-for="(fabric, idx) in product.fabrics"
                  :key="fabric"
                  class="swatch-btn"
                  :class="{ active: selectedFabric === fabric }"
                  :style="{ backgroundColor: fabric }"
                  @click="handleSwatchClick('fabric', idx, fabric)"
                />
              </div>
            </div>

            <!-- Color Selector -->
            <div v-if="product.colors?.length" class="option-group">
              <span class="option-label">COULEUR</span>
              <div class="swatch-list">
                <button
                  v-for="(color, idx) in product.colors"
                  :key="color"
                  class="swatch-btn"
                  :class="{ active: selectedColor === color }"
                  :style="{ backgroundColor: color }"
                  @click="handleSwatchClick('color', idx, color)"
                />
              </div>
            </div>

            <!-- Dimensions Selector -->
            <div v-if="product.dimensions?.length" class="option-group">
              <span class="option-label">DIMENSIONS</span>
              <div class="dimension-list">
                <button
                  v-for="dim in product.dimensions"
                  :key="dim.value"
                  class="dim-btn"
                  :class="{ active: selectedDimension === dim.value }"
                  @click="selectedDimension = dim.value"
                >
                  {{ dim.label }}
                </button>
              </div>
            </div>



          </div>

          <!-- Actions Row -->
          <div class="product-actions-row">
            <div class="quantity-selector-box">
              <button class="qty-btn" @click="quantity > 1 ? quantity-- : null">-</button>
              <div class="qty-divider"></div>
              <span class="qty-val">{{ quantity }}</span>
              <div class="qty-divider"></div>
              <button class="qty-btn" @click="quantity++">+</button>
            </div>
            <button class="btn-add-cart" :disabled="!selectedVariant" @click="handleAddToCart">
              <span v-if="!selectedVariant">Out of stock</span>
              <span v-else>{{ isAddedToCart ? 'Added' : 'Add to cart' }}</span>
            </button>
            <button class="btn-buy-now" :disabled="!selectedVariant" @click="handleBuyNow">
              Buy now
            </button>
          </div>
          
         

          <!-- Trust Badges -->
          <div class="product-trust-badges">
            <div class="trust-badge">
              <Truck :size="16" />
              <span>Livraison partout au Maroc</span>
            </div>
            <div class="trust-badge">
              <ShieldCheck :size="16" />
              <span>Paiement sécurisé</span>
            </div>
            <div class="trust-badge">
              <Shield :size="16" />
              <span>Garantie 2 ans</span>
            </div>
            <div class="trust-badge">
              <Headset :size="16" />
              <span>Service client dédié</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Middle Section: Tabs -->
      <div class="product-tabs-section">
        <div class="tabs-header">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            class="tab-btn"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
        
        <!-- Description Tab -->
        <div v-show="activeTab === 'description'" class="tab-content">
          <div class="desc-layout">
            <div class="desc-text">
              <div class="desc-intro" v-html="product.description"></div>
              <ul class="desc-features">
                <li v-for="tag in product.tags" :key="tag" class="capitalize">{{ tag }}</li>
              </ul>
            </div>
            <div v-if="product.images.length > 1" class="desc-image">
              <img :src="product.images[1]?.src || product.images[0]?.src || ''" :alt="product.name" class="desc-img" >
            </div>
          </div>
        </div>

        <!-- Details Tab -->
        <div v-show="activeTab === 'details'" class="tab-content">
          <div class="details-grid">
            <div class="detail-row">
              <span class="detail-label">Référence (SKU)</span>
              <span class="detail-value">{{ product.sku }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Catégorie</span>
              <span class="detail-value capitalize">{{ product.categories?.[0]?.name || product.categoryId || 'decor' }}</span>
            </div>
            <!-- <div v-if="product.collectionId" class="detail-row">
              <span class="detail-label">Collection</span>
              <span class="detail-value capitalize">{{ product.collectionId }}</span>
            </div> -->
            <div v-if="product.dimensions?.length" class="detail-row">
              <span class="detail-label">Dimensions disponibles</span>
              <span class="detail-value">{{ product.dimensions.map(d => d.label).join(' · ') }}</span>
            </div>
            <div v-if="product.colors?.length" class="detail-row">
              <span class="detail-label">Couleurs disponibles</span>
              <span class="detail-value">{{ product.colors.length }} coloris</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Disponibilité</span>
              <span class="detail-value" :class="product.available ? 'status-in-stock' : 'status-out-of-stock'">{{ product.available ? 'En stock' : 'Rupture de stock' }}</span>
            </div>
            <!-- <div class="detail-row">
              <span class="detail-label">Date d'ajout</span>
              <span class="detail-value">{{ new Date(product.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
            </div> -->
          </div>
        </div>

        <!-- Materials Tab -->
        <div v-show="activeTab === 'materiaux'" class="tab-content">
          <div class="desc-text">
            <p class="desc-intro">Ce produit est conçu avec des matériaux soigneusement sélectionnés pour leur qualité et leur durabilité.</p>
            <div class="materials-grid">
              <div v-for="mat in product.materials" :key="mat" class="material-card">
                <div class="material-icon">✦</div>
                <span class="material-name">{{ mat }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Livraison Tab -->
        <div v-show="activeTab === 'livraison'" class="tab-content">
          <div class="desc-text">
            <p class="desc-intro">Nous livrons partout au Maroc avec le plus grand soin pour vos meubles.</p>
            <ul class="desc-features">
              <li>Expédition sous 48h pour les articles en stock</li>
              <li>Livraison par transporteur spécialisé en mobilier</li>
              <li>Installation et montage inclus</li>
              <li>Retours acceptés sous 14 jours dans l'emballage d'origine</li>
              <li>Échange gratuit en cas de défaut de fabrication</li>
            </ul>
          </div>
        </div>

        <!-- Reviews Tab -->
        <div v-show="activeTab === 'avis'" class="tab-content">
          <div v-if="reviewsLoading" class="loading-state">Chargement des avis...</div>
          <div v-else-if="reviewsError" class="error-state">{{ reviewsError }}</div>
          <div v-else>
            <div v-if="hasReviews && summary" class="reviews-header">
              <div class="reviews-summary">
                <div class="review-score">
                  <span class="score-number">{{ summary.averageRating.toFixed(1) }}</span>
                  <span class="score-max">/5</span>
                </div>
                <div class="review-stars">
                  <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.round(summary.averageRating) }">★</span>
                </div>
                <p class="review-count">Basé sur {{ summary.totalReviews }} avis vérifiés</p>
              </div>
              <div class="review-actions">
                <button class="btn-outline-text" @click="showReviewForm = !showReviewForm">
                  {{ showReviewForm ? 'ANNULER' : 'ÉCRIRE UN AVIS' }}
                </button>
              </div>
            </div>
            
            <div v-else class="reviews-empty">
              <p class="desc-intro">Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>
              <button v-if="!showReviewForm" class="btn-primary mt-4" style="width: auto; padding: 0.75rem 1.5rem;" @click="showReviewForm = true">
                DONNER MON AVIS
              </button>
            </div>

            <!-- Review Form -->
            <form v-if="showReviewForm" class="review-form" @submit.prevent="handleReviewSubmit">
              <h3 class="form-title">Votre avis</h3>
              <div class="form-group">
                <label>Nom</label>
                <input v-model="reviewForm.authorName" type="text" required placeholder="Votre nom complet" >
              </div>
              <div class="form-group">
                <label>Email</label>
                <input v-model="reviewForm.email" type="email" required placeholder="Votre adresse email" >
              </div>
              <div class="form-group">
                <label>Note</label>
                <div class="rating-input">
                  <button v-for="n in 5" :key="n" type="button" class="star-btn" :class="{ active: n <= reviewForm.rating }" @click="reviewForm.rating = n">★</button>
                </div>
              </div>
              <div class="form-group">
                <label>Titre (facultatif)</label>
                <input v-model="reviewForm.title" type="text" placeholder="Résumez votre avis" >
              </div>
              <div class="form-group">
                <label>Commentaire</label>
                <textarea v-model="reviewForm.content" required placeholder="Que pensez-vous de ce produit ?"/>
              </div>
              <button type="submit" class="btn-primary" :disabled="isSubmitting">
                {{ isSubmitting ? 'ENVOI...' : 'ENVOYER MON AVIS' }}
              </button>
            </form>

            <!-- Reviews List -->
            <div v-if="hasReviews && !showReviewForm" class="reviews-list">
              <div v-for="review in reviews" :key="review.id" class="review-item">
                <div class="review-meta">
                  <div class="review-author">
                    <User :size="16" />
                    <span>{{ review.authorName }}</span>
                    <span v-if="review.verifiedPurchase" class="verified-badge"><ShieldCheck :size="14"/> Achat vérifié</span>
                  </div>
                  <div class="review-date">{{ new Date(review.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) }}</div>
                </div>
                <div class="review-stars-small">
                  <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= review.rating }">★</span>
                </div>
                <h4 v-if="review.title" class="review-title">{{ review.title }}</h4>
                <p class="review-content">{{ review.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div v-if="related.length > 0" class="related-section">
        <h3 class="related-subtitle">VOUS AIMEREZ AUSSI</h3>
        <h2 class="related-title">Découvrez nos pièces complémentaires.</h2>
        
        <div class="related-grid">
          <ProductCard
            v-for="p in related"
            :key="p.id"
            :product="p"
          />
        </div>

        <div class="related-action">
          <NuxtLink :to="`/categories/${product.categoryId}`" class="btn-outline-text">
            VOIR TOUTE LA COLLECTION {{ product.categoryId.toUpperCase() }}
            <span class="arrow">&rarr;</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Trust Bar & Newsletter -->
      <div class="footer-blocks">
        <div class="trust-bar">
          <div class="trust-item">
            <div class="trust-icon"><ShieldCheck :size="24" /></div>
            <div class="trust-info">
              <h4>DESIGN EXCLUSIF</h4>
              <p>Des pièces uniques sélectionnées avec soin</p>
            </div>
          </div>
          <div class="trust-item">
            <div class="trust-icon"><Shield :size="24" /></div>
            <div class="trust-info">
              <h4>QUALITÉ PREMIUM</h4>
              <p>Des matériaux haut de gamme pour une durabilité garantie</p>
            </div>
          </div>
          <div class="trust-item">
            <div class="trust-icon"><Truck :size="24" /></div>
            <div class="trust-info">
              <h4>LIVRAISON PARTOUT AU MAROC</h4>
              <p>Livraison rapide et sécurisée partout au Maroc</p>
            </div>
          </div>
          <div class="trust-item">
            <div class="trust-icon"><Headset :size="24" /></div>
            <div class="trust-info">
              <h4>SERVICE CLIENT DÉDIÉ</h4>
              <p>Une équipe à votre écoute pour vous accompagner</p>
            </div>
          </div>
        </div>

        <div class="newsletter-block">
          <div class="nl-image">
            <img src="/images/bathrom.jpeg" alt="Inspiration" >
          </div>
          <div class="nl-content">
            <h2>Restez inspiré</h2>
            <p>Inscrivez-vous à notre newsletter et découvrez nos nouveautés, inspirations et offres exclusives.</p>
            <form class="nl-form" @submit.prevent>
              <input type="email" placeholder="Votre adresse e-mail" required >
              <button type="submit">M'INSCRIRE</button>
            </form>
          </div>
        </div>
      </div>

    </Container>
  </div>
</template>

<style scoped>
.pdp-page {
  padding: 3rem 0;
  background-color: var(--dp-white);
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--dp-ash);
  margin-bottom: 3rem;
}
.breadcrumb-link {
  text-decoration: none;
  color: inherit;
  transition: color 0.2s;
}
.breadcrumb-link:hover {
  color: var(--dp-charcoal);
}
.breadcrumb-current {
  color: var(--dp-charcoal);
}
.breadcrumb-sep {
  font-size: 0.75rem;
}

/* Top Section */
.product-top {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  margin-bottom: 6rem;
}
@media (min-width: 1024px) {
  .product-top {
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
  }
}

/* Gallery */
.product-gallery {
  display: flex;
  flex-direction: column-reverse;
  gap: 1rem;
}
@media (min-width: 768px) {
  .product-gallery {
    flex-direction: row;
    align-items: flex-start;
  }
}

.gallery-thumbnails {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  overflow-x: auto;
  flex-shrink: 0;
}
@media (min-width: 768px) {
  .gallery-thumbnails {
    flex-direction: column;
    width: 80px;
    overflow-x: hidden;
    overflow-y: hidden;
  }
}

.thumbnail-btn {
  width: 80px;
  height: 80px;
  background: var(--dp-bg-alt);
  border: 1px solid transparent;
  cursor: pointer;
  transition: border-color 0.2s;
  padding: 0;
  position: relative;
  flex-shrink: 0;
}
.thumbnail-btn.active {
  border-color: var(--dp-charcoal);
}
.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.thumbnail-more {
  display: none;
}

.gallery-main {
  flex: 1;
  background: var(--dp-bg-alt);
  position: relative;
  aspect-ratio: 4/5;
  width: 100%;
}
.main-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: fadeIn 0.3s ease;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Product Info */
.product-info {
  display: flex;
  flex-direction: column;
}

/* Custom Header */
.product-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}
.product-title {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  color: var(--dp-charcoal);
  font-weight: 600;
  line-height: 1.1;
  margin: 0;
}
.product-brand-box {
  border: 1px solid var(--dp-sand);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.brand-name {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 700;
  color: var(--dp-charcoal);
}

.product-sku-rating {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.sku-text {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--dp-ash);
}
.sku-text strong {
  font-weight: 700;
  color: var(--dp-charcoal);
}
.rating-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.reviews-count {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--dp-ash);
}

.product-promo-box {
  background-color: #F8F8F8;
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 2rem;
}
.promo-icon {
  color: #F09B59;
}
.promo-title {
  font-family: var(--font-heading);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--dp-charcoal);
  margin: 0 0 0.5rem 0;
}
.promo-text {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--dp-ash);
  margin: 0;
}
.promo-text a {
  color: var(--dp-charcoal);
  text-decoration: underline;
  font-weight: 600;
}

.product-price-block {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin: 0 0 2rem 0;
}

.product-price {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 700;
  color: #F09B59;
  margin: 0;
}

.product-compare-price {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--dp-ash);
  text-decoration: line-through;
  margin: 0;
}

.product-desc {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--dp-ash);
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 90%;
}

/* Options */
.product-options {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option-label {
  font-family: var(--font-body);
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--dp-charcoal);
  font-weight: 600;
}

.swatch-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.swatch-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.25s ease;
  padding: 0;
  position: relative;
  outline: none;
}
.swatch-btn:hover {
  transform: scale(1.15);
}
.swatch-btn.active {
  transform: scale(1.2);
  box-shadow: 0 0 0 2px var(--dp-white), 0 0 0 4px var(--dp-charcoal);
  border-color: transparent;
}

.dimension-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.dim-btn {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid var(--dp-sand);
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--dp-charcoal);
  cursor: pointer;
  transition: all 0.25s ease;
  outline: none;
}
.dim-btn:hover {
  border-color: var(--dp-charcoal);
}
.dim-btn.active {
  background: var(--dp-charcoal);
  border-color: var(--dp-charcoal);
  color: var(--dp-white);
}

.product-actions-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: nowrap;
}
@media (min-width: 640px) {
  .product-actions-row {
    gap: 1rem;
  }
}

.quantity-selector-box {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--dp-sand);
  border-radius: 30px;
  background: var(--dp-white);
  height: 2.75rem;
  padding: 0;
  flex-shrink: 0;
}
.qty-divider {
  width: 1px;
  height: 1.25rem;
  background-color: var(--dp-sand);
}
.qty-btn {
  width: 2rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  font-size: 1.25rem;
  color: var(--dp-ash);
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  padding: 0;
}
.qty-btn:hover {
  color: var(--dp-charcoal);
}
.qty-btn:active {
  color: var(--dp-charcoal);
}
.qty-val {
  width: 1.5rem;
  text-align: center;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--dp-charcoal);
  font-weight: 600;
}

.btn-add-cart {
  flex: 1;
  min-width: 0;
  height: 2.75rem;
  border-radius: 30px;
  background-color: #F09B59;
  color: var(--dp-white);
  border: none;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  padding: 0 0.5rem;
  white-space: nowrap;
}
.btn-add-cart:hover {
  opacity: 0.9;
}
.btn-add-cart:disabled {
  background-color: var(--dp-sand);
  cursor: not-allowed;
}

.btn-buy-now {
  flex: 1;
  min-width: 0;
  height: 2.75rem;
  border-radius: 30px;
  background-color: var(--dp-charcoal);
  color: var(--dp-white);
  border: none;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  padding: 0 0.5rem;
  white-space: nowrap;
}
.btn-buy-now:hover {
  opacity: 0.9;
}
.btn-buy-now:disabled {
  background-color: var(--dp-ash);
  cursor: not-allowed;
}

@media (min-width: 640px) {
  .btn-add-cart, .btn-buy-now {
    font-size: 0.875rem;
    padding: 0 1rem;
  }
}

.secondary-actions-row {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
}

.btn-outline-text {
  display: inline-flex;
  align-items: center;
  background: transparent;
  border: none;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--dp-charcoal);
  cursor: pointer;
  padding: 0;
  gap: 0.5rem;
}
.btn-outline-text:hover {
  opacity: 0.7;
}

/* Badges */
.product-trust-badges {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  border-top: 1px solid var(--dp-sand);
  padding-top: 2rem;
}
.trust-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--dp-charcoal);
}
.trust-badge svg {
  color: var(--dp-gold);
}

/* Tabs Section */
.product-tabs-section {
  margin-bottom: 6rem;
}
.tabs-header {
  display: flex;
  gap: 3rem;
  border-bottom: 1px solid var(--dp-sand);
  margin-bottom: 3rem;
  overflow-x: auto;
  scrollbar-width: none;
}
.tabs-header::-webkit-scrollbar {
  display: none;
}
.tab-btn {
  background: none;
  border: none;
  padding: 1rem 0;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--dp-ash);
  cursor: pointer;
  position: relative;
  white-space: nowrap;
}
.tab-btn.active {
  color: var(--dp-charcoal);
}
.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--dp-gold);
}

.status-in-stock {
  color: var(--color-success);
}

.status-out-of-stock {
  color: var(--color-error);
}

.desc-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}
@media (min-width: 1024px) {
  .desc-layout {
    grid-template-columns: 1.5fr 1fr;
    gap: 5rem;
  }
}
.desc-text {
  padding-right: 2rem;
}
.desc-intro {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--dp-ash);
  line-height: 1.8;
  margin-bottom: 2rem;
}
.desc-features {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}
@media (min-width: 640px) {
  .desc-features {
    grid-template-columns: 1fr 1fr;
  }
}
.desc-features li {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--dp-charcoal);
  position: relative;
  padding-left: 1rem;
}
.desc-features li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--dp-gold);
}

.desc-image {
  aspect-ratio: 4/3;
  background: var(--dp-bg-alt);
}
.desc-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Details Grid */
.details-grid {
  display: grid;
  gap: 0;
}
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--dp-sand);
}
.detail-row:first-child {
  border-top: 1px solid var(--dp-sand);
}
.detail-label {
  font-family: var(--font-body);
  font-size: 0.8rem;
  color: var(--dp-ash);
  font-weight: 500;
}
.detail-value {
  font-family: var(--font-body);
  font-size: 0.8rem;
  color: var(--dp-charcoal);
  font-weight: 600;
}
.text-success { color: var(--dp-success); }
.text-error { color: var(--dp-error); }
.capitalize { text-transform: capitalize; }

/* Materials Grid */
.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}
.material-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border: 1px solid var(--dp-sand);
  transition: border-color 0.2s;
}
.material-card:hover {
  border-color: var(--dp-gold);
}
.material-icon {
  color: var(--dp-gold);
  font-size: 1rem;
}
.material-name {
  font-family: var(--font-body);
  font-size: 0.8rem;
  color: var(--dp-charcoal);
  font-weight: 500;
}

/* Reviews */
.reviews-summary {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem 0;
}
.review-score {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}
.score-number {
  font-family: var(--font-heading);
  font-size: 3.5rem;
  color: var(--dp-charcoal);
  font-weight: 400;
  line-height: 1;
}
.score-max {
  font-family: var(--font-body);
  font-size: 1.25rem;
  color: var(--dp-ash);
}
.review-stars {
  display: flex;
  gap: 0.25rem;
}
.star {
  font-size: 1.5rem;
  color: var(--dp-sand);
}
.star.filled {
  color: var(--dp-gold);
}
.review-count {
  font-family: var(--font-body);
  font-size: 0.8rem;
  color: var(--dp-ash);
  margin: 0;
}

/* Related Section */
.related-section {
  text-align: center;
  padding-top: 4rem;
  border-top: 1px solid var(--dp-sand);
  margin-bottom: 6rem;
}
.related-subtitle {
  font-family: var(--font-body);
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  color: var(--dp-gold);
  margin-bottom: 1rem;
}
.related-title {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  color: var(--dp-charcoal);
  font-weight: 400;
  margin-bottom: 4rem;
}
.related-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 4rem;
  text-align: left;
}
@media (min-width: 1024px) {
  .related-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.related-action {
  display: flex;
  justify-content: center;
}
.btn-outline-text {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid var(--dp-sand);
  padding: 1rem 2rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-decoration: none;
  color: var(--dp-charcoal);
  transition: border-color 0.2s;
}
.btn-outline-text:hover {
  border-color: var(--dp-charcoal);
}

/* Footer Blocks */
.footer-blocks {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.trust-bar {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding: 3rem 0;
  border-top: 1px solid var(--dp-sand);
  border-bottom: 1px solid var(--dp-sand);
}
@media (min-width: 768px) {
  .trust-bar {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .trust-bar {
    grid-template-columns: repeat(4, 1fr);
  }
}
.trust-item {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}
.trust-icon {
  color: var(--dp-gold);
}
.trust-info h4 {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--dp-charcoal);
  margin: 0 0 0.5rem 0;
}
.trust-info p {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--dp-ash);
  margin: 0;
  line-height: 1.5;
}

.newsletter-block {
  display: grid;
  grid-template-columns: 1fr;
  background: var(--dp-bg-alt);
}
@media (min-width: 768px) {
  .newsletter-block {
    grid-template-columns: 1fr 2fr;
  }
}
.nl-image {
  aspect-ratio: 1;
}
.nl-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.nl-content {
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
@media (min-width: 1024px) {
  .nl-content {
    padding: 0 5rem;
  }
}
.nl-content h2 {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  color: var(--dp-charcoal);
  font-weight: 400;
  margin: 0 0 1rem 0;
}
.nl-content p {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--dp-ash);
  margin: 0 0 2rem 0;
  max-width: 400px;
}
.nl-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 500px;
}
@media (min-width: 480px) {
  .nl-form {
    flex-direction: row;
    gap: 0;
  }
}
.nl-form input {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  font-family: var(--font-body);
  font-size: 0.875rem;
  outline: none;
}
.nl-form button {
  background: var(--dp-gold);
  color: var(--dp-white);
  border: none;
  padding: 1rem 2rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: opacity 0.2s;
}
.nl-form button:hover {
  opacity: 0.9;
}
.btn-outline-text {
  background: transparent;
  border: none;
  color: var(--dp-charcoal);
  font-family: var(--font-heading);
  font-size: 1rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
}
.btn-outline-text:hover {
  color: var(--dp-gold);
}

.mt-4 {
  margin-top: 1rem;
}

/* Review Styles */
.loading-state, .error-state, .reviews-empty {
  padding: 2rem 0;
  text-align: center;
  font-family: var(--font-body);
  color: var(--dp-ash);
}
.error-state {
  color: var(--color-error);
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;
  border-bottom: 1px solid var(--dp-sand);
  padding-bottom: 2rem;
}

@media (max-width: 640px) {
  .reviews-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
}

.review-form {
  max-width: 650px;
  margin: 0 auto 4rem;
  background: var(--dp-white);
  padding: 3rem 2.5rem;
  border: 1px solid var(--dp-sand);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}
.form-title {
  margin-top: 0;
  margin-bottom: 2rem;
  font-family: var(--font-heading);
  color: var(--dp-charcoal);
  font-size: 1.75rem;
  text-align: center;
  font-weight: 500;
}
.form-group {
  margin-bottom: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.form-group label {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--dp-charcoal);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.form-group input, .form-group textarea {
  padding: 0.875rem 1rem;
  border: 1px solid #E5E5E5;
  border-radius: 6px;
  background: var(--dp-white);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--dp-charcoal);
  outline: none;
  transition: all 0.2s ease;
}
.form-group input::placeholder, .form-group textarea::placeholder {
  color: #A3A3A3;
  font-weight: 300;
}
.form-group input:focus, .form-group textarea:focus {
  border-color: var(--dp-charcoal);
  box-shadow: 0 0 0 3px rgba(34, 34, 34, 0.05);
}
.form-group textarea {
  min-height: 120px;
  resize: vertical;
}

.rating-input {
  display: flex;
  gap: 0.5rem;
}
.star-btn {
  background: none;
  border: none;
  font-size: 1.75rem;
  color: #E5E5E5;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: transform 0.2s ease, color 0.2s ease;
}
.star-btn:hover {
  transform: scale(1.1);
}
.star-btn.active, .star-btn:hover {
  color: var(--dp-gold);
}
.review-form .btn-primary {
  width: 100%;
  margin-top: 1rem;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.review-item {
  border-bottom: 1px solid var(--dp-sand);
  padding-bottom: 2rem;
}
.review-item:last-child {
  border-bottom: none;
}
.review-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.review-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-body);
  font-weight: 600;
  color: var(--dp-charcoal);
  font-size: 0.875rem;
}
.verified-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-success);
  font-size: 0.75rem;
  font-weight: 400;
}
.review-date {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--dp-ash);
}
.review-stars-small {
  display: flex;
  gap: 2px;
  color: var(--dp-sand);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}
.review-stars-small .star.filled {
  color: var(--dp-gold);
}
.review-title {
  margin: 0 0 0.5rem 0;
  font-family: var(--font-heading);
  font-size: 1.25rem;
  color: var(--dp-charcoal);
}
.review-content {
  margin: 0;
  font-family: var(--font-body);
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--dp-charcoal);
}
</style>

<style scoped>
.loading-page {
  padding: 8rem 0;
  text-align: center;
  font-family: var(--font-body);
  color: var(--dp-ash);
}
.error-page {
  padding: 8rem 0;
  text-align: center;
  font-family: var(--font-body);
  color: var(--color-error);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background-color: var(--dp-charcoal);
  color: var(--dp-white);
  border: 1px solid var(--dp-charcoal);
  border-radius: 30px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.btn-primary:hover {
  background-color: transparent;
  color: var(--dp-charcoal);
}
.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ─── Skeleton Loader ─── */
.skeleton-bone {
  display: block;
  border-radius: 3px;
}

.skeleton-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
}

.skeleton-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.skeleton-thumb {
  width: 80px;
  height: 80px;
  border-radius: 2px;
  flex-shrink: 0;
}

.skeleton-main-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 2px;
}

.skeleton-promo {
  width: 100%;
  height: 72px;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.skeleton-swatch {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.skeleton-actions {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.skeleton-badges {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.skeleton-badge {
  height: 44px;
  border-radius: 6px;
}
</style>
