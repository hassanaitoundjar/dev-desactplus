<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Truck, ShieldCheck, RotateCcw, X } from 'lucide-vue-next'
import { useCart } from '~/composables/useCart'
import { formatPrice } from '~/utils/formatPrice'

const router = useRouter()
const { subtotal, discountTotal, couponCode, shippingTotal, cartTotal, applyCoupon, removeCoupon } = useCart()

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

      <button class="btn-checkout" @click="router.push('/checkout')">
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
</template>

<style scoped>
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
  color: var(--dp-error);
  font-size: 0.75rem;
  margin-top: 0.5rem;
}
</style>
