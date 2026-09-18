<script setup lang="ts">
import { useCart } from '~/composables/useCart'
import { useProducts } from '~/composables/useProducts'
import Container from '~/components/ui/Container.vue'
import { formatPrice } from '~/utils/formatPrice'
import { Trash2, ArrowRight, ShoppingBag, Truck, ShieldCheck, RotateCcw, X } from 'lucide-vue-next'

definePageMeta({ layout: 'default' })

const router = useRouter()
const { items, isEmpty, remove, updateQuantity, count, clear, subtotal, shippingTotal, cartTotal, discountTotal, couponCode, applyCoupon, removeCoupon } = useCart()
const { products: allProducts } = useProducts()

const cartProducts = computed(() => {
  if (!allProducts.value) return []
  return items.value.map(item => ({
    cartItem: item,
    product: allProducts.value.find(p => p.id === item.productId)
  })).filter(p => p.product)
})

const itemLineTotal = (price: number, qty: number) => formatPrice(price * qty)

const couponInput = ref('')
const couponError = ref('')
const isApplyingCoupon = ref(false)

const handleApplyCoupon = async () => {
  if (!couponInput.value.trim() || isApplyingCoupon.value) return
  isApplyingCoupon.value = true
  couponError.value = ''
  
  try {
    await applyCoupon(couponInput.value.trim())
    couponInput.value = ''
  } catch (e: any) {
    if (e.data && e.data.message) {
      couponError.value = e.data.message
    } else {
      couponError.value = 'Code promo invalide'
    }
  } finally {
    isApplyingCoupon.value = false
  }
}

const handleRemoveCoupon = async () => {
  if (isApplyingCoupon.value) return
  isApplyingCoupon.value = true
  couponError.value = ''
  
  try {
    await removeCoupon()
  } catch (e) {
    console.error('Failed to remove coupon:', e)
  } finally {
    isApplyingCoupon.value = false
  }
}
</script>

<template>
  <div class="cart-page">
    <Container>

      <!-- Header -->
      <div class="cart-header">
        <div class="cart-header-text">
          <span class="cart-eyebrow">Votre sélection</span>
          <h1 class="cart-title">Mon Panier</h1>
        </div>
        <span v-if="!isEmpty" class="cart-count">{{ count }} article{{ count > 1 ? 's' : '' }}</span>
      </div>

      <!-- Empty State -->
      <div v-if="isEmpty" class="empty-state">
        <div class="empty-icon">
          <ShoppingBag :size="48" :stroke-width="1" />
        </div>
        <h2 class="empty-title">Votre panier est vide</h2>
        <p class="empty-desc">Parcourez notre collection pour découvrir des pièces d'exception.</p>
        <NuxtLink to="/products" class="empty-btn">
          Découvrir la boutique
          <ArrowRight :size="16" />
        </NuxtLink>
      </div>

      <!-- Cart Content -->
      <div v-else class="cart-layout">

        <!-- Left: Items -->
        <div class="cart-items-col">
          <!-- Table Header (desktop) -->
          <div class="cart-table-head">
            <span class="th-product">Produit</span>
            <span class="th-price">Prix</span>
            <span class="th-qty">Quantité</span>
            <span class="th-total">Total</span>
            <span class="th-action"/>
          </div>

          <!-- Items -->
          <div class="cart-items">
            <div v-for="{ cartItem, product } in cartProducts" :key="product!.id" class="cart-item">
              <!-- Main Product Info (Image + Details) -->
              <div class="item-main">
                <!-- Image -->
                <NuxtLink :to="`/products/${product!.slug}`" class="item-img-link">
                  <img :src="product!.images[0]?.src || '/images/collection-lighting.png'" :alt="product!.name" class="item-img" >
                </NuxtLink>
  
                <!-- Info -->
                <div class="item-info">
                  <span class="item-category">{{ product!.categoryId }}</span>
                  <NuxtLink :to="`/products/${product!.slug}`" class="item-name">{{ product!.name }}</NuxtLink>
                  <span class="item-sku">Réf: {{ product!.sku }}</span>
                  <!-- Mobile price -->
                  <span class="item-price-mobile">{{ formatPrice(product!.price) }}</span>
                </div>
              </div>

              <!-- Price (desktop) -->
              <span class="item-price">{{ formatPrice(product!.price) }}</span>

              <!-- Quantity -->
              <div class="item-qty-wrap">
                <div class="qty-selector">
                  <button class="qty-btn" @click="updateQuantity(cartItem.id, cartItem.quantity - 1)">−</button>
                  <span class="qty-val">{{ cartItem.quantity }}</span>
                  <button class="qty-btn" @click="updateQuantity(cartItem.id, cartItem.quantity + 1)">+</button>
                </div>
              </div>

              <!-- Line total (desktop) -->
              <span class="item-total">{{ itemLineTotal(cartItem.price, cartItem.quantity) }}</span>

              <!-- Remove -->
              <button class="item-remove" aria-label="Supprimer" @click="remove(cartItem.id)">
                <Trash2 :size="16" />
              </button>
            </div>
          </div>

          <!-- Actions -->
          <div class="cart-bottom-actions">
            <NuxtLink to="/products" class="continue-shopping">
              ← Continuer mes achats
            </NuxtLink>
            <button class="clear-cart" @click="clear">
              Vider le panier
            </button>
          </div>
        </div>

        <!-- Right: Summary -->
        <aside class="cart-summary-col">
          <div class="summary-box">
            <h3 class="summary-title">Récapitulatif</h3>

            <div class="summary-lines">
              <div class="summary-line">
                <span>Sous-total</span>
                <span class="summary-val">{{ formatPrice(subtotal) }}</span>
              </div>
              <div v-if="discountTotal > 0" class="summary-line summary-line--discount">
                <span>Remise {{ couponCode ? `(${couponCode})` : '' }}</span>
                <span class="summary-val discount-val">-{{ formatPrice(discountTotal) }}</span>
              </div>
              <div class="summary-line">
                <span>Livraison</span>
                <span :class="shippingTotal === 0 ? 'free' : ''">{{ shippingTotal === 0 ? 'Gratuite' : formatPrice(shippingTotal) }}</span>
              </div>
            </div>

            <div class="coupon-section">
              <div v-if="couponCode && discountTotal > 0" class="coupon-applied">
                <span class="coupon-applied-text">✓ Code promo : <strong>{{ couponCode }}</strong></span>
                <button :disabled="isApplyingCoupon" class="coupon-remove-btn" aria-label="Supprimer le code promo" @click="handleRemoveCoupon">
                  <X :size="14" />
                </button>
              </div>
              <div v-else>
                <div class="coupon-input-row">
                  <input 
                    v-model="couponInput" 
                    type="text" 
                    placeholder="Code promo" 
                    class="coupon-input"
                    @keyup.enter="handleApplyCoupon"
                  >
                  <button 
                    :disabled="!couponInput || isApplyingCoupon" 
                    class="coupon-apply-btn"
                    @click="handleApplyCoupon"
                  >
                    {{ isApplyingCoupon ? '...' : 'Appliquer' }}
                  </button>
                </div>
                <p v-if="couponError" class="coupon-error">{{ couponError }}</p>
              </div>
            </div>

            <div v-if="subtotal < 50" class="free-ship-note">
              <Truck :size="14" />
              <span>Plus que <strong>{{ formatPrice(50 - subtotal) }}</strong> pour la livraison gratuite</span>
            </div>

            <div class="summary-total-row">
              <span class="total-label">Total</span>
              <span class="total-value">{{ formatPrice(cartTotal) }}</span>
            </div>

            <button class="btn-checkout" @click="$router.push('/checkout')">
              Passer la commande
              <ArrowRight :size="16" />
            </button>

            <!-- Trust -->
            <div class="summary-trust">
              <div class="trust-item">
                <ShieldCheck :size="14" />
                <span>Paiement sécurisé</span>
              </div>
              <div class="trust-item">
                <Truck :size="14" />
                <span>Livraison partout au Maroc</span>
              </div>
              <div class="trust-item">
                <RotateCcw :size="14" />
                <span>Retours sous 14 jours</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

    </Container>
  </div>
</template>

<style scoped>
.cart-page {
  padding: 3rem 0 6rem;
  background: var(--dp-white);
  min-height: 70vh;
}

/* ─── Header ─── */
.cart-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--dp-sand);
}

.cart-eyebrow {
  display: block;
  font-family: var(--font-body);
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--dp-gold);
  margin-bottom: 0.5rem;
}

.cart-title {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 400;
  color: var(--dp-charcoal);
  margin: 0;
  line-height: 1.1;
}

.cart-count {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--dp-ash);
}

/* ─── Empty State ─── */
.empty-state {
  text-align: center;
  padding: 5rem 0;
}

.empty-icon {
  color: var(--dp-sand);
  margin-bottom: 1.5rem;
}

.empty-title {
  font-family: var(--font-heading);
  font-size: 1.75rem;
  font-weight: 400;
  color: var(--dp-charcoal);
  margin: 0 0 0.75rem 0;
}

.empty-desc {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--dp-ash);
  margin: 0 0 2rem 0;
}

.empty-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: var(--dp-gold);
  color: var(--dp-white);
  text-decoration: none;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: opacity 0.2s;
}

.empty-btn:hover { opacity: 0.9; }

/* ─── Layout ─── */
.cart-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}

@media (min-width: 1024px) {
  .cart-layout {
    grid-template-columns: 1fr 380px;
    gap: 4rem;
  }
}

/* ─── Table Head ─── */
.cart-table-head {
  display: none;
}

@media (min-width: 768px) {
  .cart-table-head {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 40px;
    gap: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--dp-sand);
    margin-bottom: 0;
    font-family: var(--font-body);
    font-size: 0.625rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--dp-ash);
  }
}

/* ─── Cart Items ─── */
.cart-items {
  display: flex;
  flex-direction: column;
}

.cart-item {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  align-items: center;
}

@media (min-width: 768px) {
  .cart-item {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 40px;
    gap: 1rem;
    flex-wrap: nowrap;
    padding: 1.5rem 0;
  }
}

/* Item main wrapper */
.item-main {
  display: flex;
  gap: 1rem;
  width: 100%;
}

@media (min-width: 768px) {
  .item-main {
    width: auto;
  }
}

/* Item image */
.item-img-link {
  width: 80px;
  height: 100px;
  background: var(--dp-ivory);
  flex-shrink: 0;
  overflow: hidden;
}

.item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.item-img-link:hover .item-img {
  transform: scale(1.05);
}

/* Item info */
.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

@media (min-width: 768px) {
  .item-info {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 0;
  }

  .item-info .item-category,
  .item-info .item-name,
  .item-info .item-sku {
    width: 100%;
  }
}

.item-category {
  font-family: var(--font-body);
  font-size: 0.5625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--dp-gold);
}

.item-name {
  font-family: var(--font-heading);
  font-size: 1.125rem;
  color: var(--dp-charcoal);
  text-decoration: none;
  transition: color 0.2s;
}

.item-name:hover { color: var(--dp-gold); }

.item-sku {
  font-family: var(--font-body);
  font-size: 0.6875rem;
  color: var(--dp-stone);
}

.item-price-mobile {
  font-family: var(--font-heading);
  font-size: 1rem;
  color: var(--dp-charcoal);
  margin-top: 0.25rem;
}

@media (min-width: 768px) {
  .item-price-mobile { display: none; }
}

/* Desktop price */
.item-price {
  display: none;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--dp-charcoal);
}

@media (min-width: 768px) {
  .item-price { display: block; }
}

/* Quantity */
.item-qty-wrap {
  display: flex;
  align-items: center;
}

.qty-selector {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--dp-sand);
}

.qty-btn {
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  font-size: 1rem;
  color: var(--dp-charcoal);
  cursor: pointer;
  transition: background 0.2s;
}

.qty-btn:hover { background: var(--dp-ivory); }

.qty-val {
  width: 2.25rem;
  text-align: center;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--dp-charcoal);
}

/* Line total */
.item-total {
  display: none;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--dp-charcoal);
}

@media (min-width: 768px) {
  .item-total { display: block; }
}

/* Remove */
.item-remove {
  background: none;
  border: none;
  color: var(--dp-stone);
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-remove:hover { color: var(--dp-error); }

/* ─── Bottom Actions ─── */
.cart-bottom-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  margin-top: 0.5rem;
}

.continue-shopping {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--dp-ash);
  text-decoration: none;
  transition: color 0.2s;
}

.continue-shopping:hover { color: var(--dp-charcoal); }

.clear-cart {
  background: none;
  border: none;
  font-family: var(--font-body);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--dp-stone);
  cursor: pointer;
  transition: color 0.2s;
}

.clear-cart:hover { color: var(--dp-error); }

/* ─── Summary ─── */
.summary-box {
  background: var(--dp-ivory);
  border: 1px solid var(--dp-sand);
  padding: 2rem;
  position: sticky;
  top: 6rem;
}

.summary-title {
  font-family: var(--font-heading);
  font-size: 1.375rem;
  font-weight: 400;
  color: var(--dp-charcoal);
  margin: 0 0 1.5rem 0;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--dp-sand);
}

.summary-lines {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--dp-sand);
}

.summary-line {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--dp-ash);
}

.summary-val { color: var(--dp-charcoal); }

.free {
  color: var(--dp-success);
  font-weight: 600;
}

.free-ship-note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-body);
  font-size: 0.6875rem;
  color: var(--dp-gold);
  padding: 0.75rem 1rem;
  background: rgba(193, 154, 91, 0.06);
  margin-bottom: 1.25rem;
}

.free-ship-note strong {
  font-weight: 700;
}

.summary-total-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1.5rem;
}

.total-label {
  font-family: var(--font-heading);
  font-size: 1.125rem;
  color: var(--dp-charcoal);
}

.total-value {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--dp-charcoal);
}

.btn-checkout {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.125rem;
  background: var(--dp-gold);
  color: var(--dp-white);
  border: none;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-checkout:hover { opacity: 0.9; }

.summary-trust {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--dp-sand);
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-body);
  font-size: 0.6875rem;
  color: var(--dp-ash);
}

.trust-item svg { color: var(--dp-gold); }

/* ─── Coupon Section ─── */
.coupon-section {
  margin: 1.25rem 0;
  padding-top: 1.25rem;
  border-top: 1px solid var(--dp-sand);
}

.coupon-input-row {
  display: flex;
  gap: 0.5rem;
}

.coupon-input {
  flex: 1;
  padding: 0.625rem 0.875rem;
  border: 1px solid var(--dp-sand);
  background: var(--dp-white);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--dp-charcoal);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  outline: none;
  transition: border-color 0.2s;
}

.coupon-input::placeholder {
  color: var(--dp-ash);
  text-transform: none;
  letter-spacing: normal;
}

.coupon-input:focus {
  border-color: var(--dp-gold);
}

.coupon-apply-btn {
  padding: 0.625rem 1.25rem;
  background: var(--dp-charcoal);
  color: var(--dp-white);
  border: none;
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity 0.2s;
  white-space: nowrap;
}

.coupon-apply-btn:hover { opacity: 0.85; }
.coupon-apply-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.coupon-applied {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.coupon-applied-text {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: #166534;
}

.coupon-applied-text strong {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.coupon-remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background: none;
  border: 1px solid #bbf7d0;
  color: #166534;
  cursor: pointer;
  transition: all 0.2s;
}

.coupon-remove-btn:hover {
  background: #dcfce7;
  border-color: #86efac;
}

.coupon-error {
  margin-top: 0.5rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: #dc2626;
}

.discount-val {
  color: #16a34a;
  font-weight: 600;
}

.summary-line--discount span:first-child {
  color: #16a34a;
}
</style>
