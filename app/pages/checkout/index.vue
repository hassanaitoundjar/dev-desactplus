<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCheckout } from '~/composables/useCheckout'
import { useCart } from '~/composables/useCart'
import Container from '~/components/ui/Container.vue'
import { formatPrice } from '~/utils/formatPrice'
import { Lock, Truck, ShieldCheck, ChevronDown, CreditCard, ArrowLeft, Check } from 'lucide-vue-next'

definePageMeta({ layout: 'default' })

const router = useRouter()
const { items, isEmpty, clear } = useCart()
const { cartProducts, subtotal, shipping, total, completeCheckout } = useCheckout()

// Redirect if empty
onMounted(() => {
  if (isEmpty.value) router.replace('/cart')
})

// Form
const step = ref(1)
const isSubmitting = ref(false)
const formErrors = ref<Record<string, string>>({})
const checkoutError = ref('')

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  notes: '',
  paymentMethod: 'cod',
})

const cities = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger',
  'Agadir', 'Meknès', 'Oujda', 'Kénitra', 'Tétouan', 'Autre'
]

function validateStep1(): boolean {
  const errors: Record<string, string> = {}
  if (!form.value.firstName.trim()) errors.firstName = 'Requis'
  if (!form.value.lastName.trim()) errors.lastName = 'Requis'
  if (!form.value.email.trim() || !form.value.email.includes('@')) errors.email = 'E-mail invalide'
  if (!form.value.phone.trim()) errors.phone = 'Requis'
  if (!form.value.address.trim()) errors.address = 'Requis'
  if (!form.value.city) errors.city = 'Requis'
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

function goToPayment() {
  if (validateStep1()) step.value = 2
}

function goBack() {
  step.value = 1
}

async function placeOrder() {
  isSubmitting.value = true
  checkoutError.value = ''
  try {
    const shippingAddress = {
      first_name: form.value.firstName,
      last_name: form.value.lastName,
      address_1: form.value.address,
      city: form.value.city,
      postal_code: form.value.postalCode,
      phone: form.value.phone,
      country_code: 'ma'
    }

    // Save order info BEFORE checkout clears the cart (clear() zeros totals & items)
    const preCheckoutInfo = {
      email: form.value.email,
      name: `${form.value.firstName} ${form.value.lastName}`,
      city: form.value.city,
      total: total.value,
      itemCount: items.value.reduce((s, i) => s + i.quantity, 0),
    }

    const order = await completeCheckout(shippingAddress, form.value.paymentMethod, form.value.email)
    
    if (!order?.id) {
      throw new Error('Commande non finalisée.')
    }
    
    const now = new Date()
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '') // e.g. 20260914
    let displayOrderId = order.id
    
    if (order.display_id) {
      displayOrderId = `DP-${dateStr}-${String(order.display_id).padStart(4, '0')}`
    } else {
      // Fallback if display_id is not present
      displayOrderId = `DP-${dateStr}-${order.id.slice(-6).toUpperCase()}`
    }
    
    // Persist with the real orderId now that checkout succeeded
    if (import.meta.client) {
      sessionStorage.setItem('dp-last-order', JSON.stringify({
        ...preCheckoutInfo,
        orderId: displayOrderId,
      }))
    }
    
    router.push(`/checkout/confirmation?order=${displayOrderId}`)
  } catch (error: any) {
    console.error('Checkout failed', error)
    checkoutError.value = error.message || 'Une erreur est survenue lors de la validation de la commande.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="checkout-page">
    <Container>
      <!-- Top bar -->
      <div class="checkout-topbar">
        <NuxtLink to="/" class="checkout-logo">
          <span class="logo-main">DESACT</span>
          <span class="logo-sub">Plus</span>
        </NuxtLink>
        <div class="secure-badge">
          <Lock :size="12" />
          <span>Paiement sécurisé</span>
        </div>
      </div>

      <!-- Progress -->
      <div class="progress-bar">
        <div class="progress-step" :class="{ active: step >= 1, done: step > 1 }">
          <span class="progress-num"><Check v-if="step > 1" :size="12" /><span v-else>1</span></span>
          <span class="progress-label">Livraison</span>
        </div>
        <div class="progress-line" :class="{ filled: step >= 2 }"></div>
        <div class="progress-step" :class="{ active: step >= 2 }">
          <span class="progress-num">2</span>
          <span class="progress-label">Paiement</span>
        </div>
        <div class="progress-line" :class="{ filled: step >= 3 }"></div>
        <div class="progress-step" :class="{ active: step >= 3 }">
          <span class="progress-num">3</span>
          <span class="progress-label">Confirmation</span>
        </div>
      </div>

      <div class="checkout-grid">
        <!-- Form Column -->
        <div class="form-col">

          <!-- Step 1: Shipping -->
          <div v-show="step === 1" class="form-card">
            <h2 class="form-heading">Adresse de livraison</h2>

            <div class="field-row">
              <div class="field" :class="{ error: formErrors.firstName }">
                <label for="fn">Prénom *</label>
                <input id="fn" v-model="form.firstName" type="text" placeholder="Votre prénom" />
                <span v-if="formErrors.firstName" class="field-error">{{ formErrors.firstName }}</span>
              </div>
              <div class="field" :class="{ error: formErrors.lastName }">
                <label for="ln">Nom *</label>
                <input id="ln" v-model="form.lastName" type="text" placeholder="Votre nom" />
                <span v-if="formErrors.lastName" class="field-error">{{ formErrors.lastName }}</span>
              </div>
            </div>

            <div class="field-row">
              <div class="field" :class="{ error: formErrors.email }">
                <label for="em">E-mail *</label>
                <input id="em" v-model="form.email" type="email" placeholder="votre@email.com" />
                <span v-if="formErrors.email" class="field-error">{{ formErrors.email }}</span>
              </div>
              <div class="field" :class="{ error: formErrors.phone }">
                <label for="ph">Téléphone *</label>
                <input id="ph" v-model="form.phone" type="tel" placeholder="+212 6XX XXX XXX" />
                <span v-if="formErrors.phone" class="field-error">{{ formErrors.phone }}</span>
              </div>
            </div>

            <div class="field" :class="{ error: formErrors.address }">
              <label for="addr">Adresse complète *</label>
              <input id="addr" v-model="form.address" type="text" placeholder="Numéro, rue, quartier" />
              <span v-if="formErrors.address" class="field-error">{{ formErrors.address }}</span>
            </div>

            <div class="field-row">
              <div class="field" :class="{ error: formErrors.city }">
                <label for="city">Ville *</label>
                <div class="select-wrap">
                  <select id="city" v-model="form.city">
                    <option value="" disabled>Sélectionner</option>
                    <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
                  </select>
                  <ChevronDown :size="14" class="select-chevron" />
                </div>
                <span v-if="formErrors.city" class="field-error">{{ formErrors.city }}</span>
              </div>
              <div class="field">
                <label for="zip">Code postal</label>
                <input id="zip" v-model="form.postalCode" type="text" placeholder="20000" />
              </div>
            </div>

            <div class="field">
              <label for="notes">Notes de livraison <span class="optional">(optionnel)</span></label>
              <textarea id="notes" v-model="form.notes" rows="3" placeholder="Instructions spéciales..."></textarea>
            </div>

            <button class="btn-next" @click="goToPayment">
              Continuer vers le paiement
              <ArrowLeft :size="14" style="transform: rotate(180deg)" />
            </button>
          </div>

          <!-- Step 2: Payment -->
          <div v-show="step === 2" class="form-card">
            <button class="btn-back" @click="goBack">
              <ArrowLeft :size="14" />
              Retour aux informations
            </button>

            <h2 class="form-heading">Mode de paiement</h2>

            <div class="pay-options">
              <label class="pay-option" :class="{ selected: form.paymentMethod === 'cod' }">
                <input type="radio" v-model="form.paymentMethod" value="cod" />
                <span class="radio-dot"></span>
                <div class="pay-text">
                  <strong>Paiement à la livraison</strong>
                  <span>Payez en espèces lors de la réception.</span>
                </div>
              </label>

              <label class="pay-option" :class="{ selected: form.paymentMethod === 'transfer' }">
                <input type="radio" v-model="form.paymentMethod" value="transfer" />
                <span class="radio-dot"></span>
                <div class="pay-text">
                  <strong>Virement bancaire</strong>
                  <span>Expédition après réception du virement.</span>
                </div>
              </label>

              <label class="pay-option" :class="{ selected: form.paymentMethod === 'card' }">
                <input type="radio" v-model="form.paymentMethod" value="card" />
                <span class="radio-dot"></span>
                <div class="pay-text">
                  <div class="pay-title-row">
                    <CreditCard :size="14" class="card-icon" />
                    <strong>Carte bancaire</strong>
                  </div>
                  <span>Visa, Mastercard — paiement sécurisé CMI.</span>
                </div>
              </label>
            </div>

            <!-- Address recap -->
            <div class="addr-recap">
              <div class="recap-label">LIVRÉ À</div>
              <div class="recap-body">
                <p>{{ form.firstName }} {{ form.lastName }}</p>
                <p>{{ form.address }}</p>
                <p>{{ form.postalCode ? form.postalCode + ' ' : '' }}{{ form.city }}, Maroc</p>
                <p>{{ form.phone }}</p>
              </div>
              <button class="recap-edit" @click="goBack">Modifier</button>
            </div>

            <div v-if="checkoutError" class="checkout-error-message">
              {{ checkoutError }}
            </div>

            <button class="btn-next btn-place" :disabled="isSubmitting" @click="placeOrder">
              <span v-if="isSubmitting" class="spinner"></span>
              {{ isSubmitting ? 'Traitement...' : 'Confirmer la commande' }}
            </button>
          </div>
        </div>

        <!-- Summary Column -->
        <aside class="summary-col">
          <div class="summary-card">
            <h3 class="sum-title">Votre commande <span class="sum-count">({{ items.reduce((s, i) => s + i.quantity, 0) }})</span></h3>

            <div class="sum-items">
              <div v-for="{ cartItem, product } in cartProducts" :key="cartItem.productId" class="sum-item">
                <div class="sum-img-wrap">
                  <img :src="product?.images?.[0]?.src || '/images/collection-lighting.png'" :alt="product?.name" class="sum-img" />
                  <span class="sum-qty-badge">{{ cartItem.quantity }}</span>
                </div>
                <div class="sum-item-info">
                  <span class="sum-item-name">{{ product?.name }}</span>
                  <span class="sum-item-sku">{{ product?.sku }}</span>
                </div>
                <span class="sum-item-price">{{ formatPrice((product?.price || 0) * cartItem.quantity) }}</span>
              </div>
            </div>

            <div class="sum-lines">
              <div class="sum-line"><span>Sous-total</span><span>{{ formatPrice(subtotal) }}</span></div>
              <div class="sum-line">
                <span>Livraison</span>
                <span :class="{ 'free-shipping-text': shipping === 0 }">{{ shipping === 0 ? 'Gratuite' : formatPrice(shipping) }}</span>
              </div>
            </div>

            <div class="sum-total">
              <span>Total</span>
              <span>{{ formatPrice(total) }}</span>
            </div>

            <div class="sum-trust">
              <Lock :size="12" /> <span>Données chiffrées SSL</span>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  </div>
</template>

<style scoped>
.checkout-page {
  padding: 1.5rem 0 6rem;
  background: var(--dp-ivory);
  min-height: 100vh;
}

/* ─── Topbar ─── */
.checkout-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--dp-sand);
  margin-bottom: 2rem;
}

.checkout-logo {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: var(--dp-charcoal);
}

.logo-main {
  font-family: var(--font-heading);
  font-size: 1.375rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  line-height: 1;
}

.logo-sub {
  font-family: var(--font-body);
  font-size: 0.5625rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--dp-gold);
}

.secure-badge {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-family: var(--font-body);
  font-size: 0.6875rem;
  color: var(--dp-ash);
}

/* ─── Progress ─── */
.progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2.5rem;
}

.progress-step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.3;
  transition: opacity 0.3s;
}

.progress-step.active { opacity: 1; }

.progress-num {
  width: 1.625rem;
  height: 1.625rem;
  border-radius: 50%;
  border: 1.5px solid var(--dp-charcoal);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: 700;
  color: var(--dp-charcoal);
  transition: all 0.3s;
}

.progress-step.active .progress-num {
  background: var(--dp-charcoal);
  color: var(--dp-white);
}

.progress-step.done .progress-num {
  background: var(--dp-gold);
  border-color: var(--dp-gold);
  color: var(--dp-white);
}

.progress-label {
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  display: none;
}

@media (min-width: 640px) {
  .progress-label { display: block; }
}

.progress-line {
  width: 3.5rem;
  height: 1px;
  background: var(--dp-sand);
  margin: 0 0.75rem;
  transition: background 0.3s;
}

.progress-line.filled { background: var(--dp-charcoal); }

/* ─── Grid ─── */
.checkout-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
}

@media (min-width: 1024px) {
  .checkout-grid {
    grid-template-columns: 1fr 400px;
    gap: 3.5rem;
  }
}

/* ─── Form Card ─── */
.form-card {
  background: var(--dp-white);
  border: 1px solid var(--dp-sand);
  padding: 2rem;
}

@media (min-width: 768px) {
  .form-card { padding: 2.5rem; }
}

.form-heading {
  font-family: var(--font-heading);
  font-size: 1.375rem;
  font-weight: 400;
  color: var(--dp-charcoal);
  margin: 0 0 2rem 0;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

@media (min-width: 640px) {
  .field-row { grid-template-columns: 1fr 1fr; }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 1.25rem;
}

.field-row .field { margin-bottom: 0; }

.field label {
  font-family: var(--font-body);
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--dp-charcoal);
}

.optional {
  font-weight: 400;
  color: var(--dp-stone);
  text-transform: none;
  letter-spacing: 0;
}

.field input,
.field textarea,
.field select {
  width: 100%;
  padding: 0.8125rem 0.875rem;
  border: 1px solid var(--dp-sand);
  background: var(--dp-white);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--dp-charcoal);
  outline: none;
  transition: border-color 0.2s;
}

.field input:focus,
.field textarea:focus,
.field select:focus {
  border-color: var(--dp-charcoal);
}

.field input::placeholder,
.field textarea::placeholder {
  color: var(--dp-stone);
}

.field textarea { resize: vertical; }

.field.error input,
.field.error select {
  border-color: var(--dp-error);
}

.field-error {
  font-family: var(--font-body);
  font-size: 0.6875rem;
  color: var(--dp-error);
}

.checkout-error-message {
  padding: 1rem;
  background-color: #fee2e2;
  color: #ef4444;
  border-radius: 4px;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  margin-bottom: 1rem;
  text-align: center;
}

.select-wrap {
  position: relative;
}

.select-wrap select {
  appearance: none;
  cursor: pointer;
  padding-right: 2.5rem;
}

.select-chevron {
  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--dp-ash);
  pointer-events: none;
}

/* ─── Buttons ─── */
.btn-next {
  width: 100%;
  padding: 1.125rem;
  background: var(--dp-gold);
  color: var(--dp-white);
  border: none;
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn-next:hover { opacity: 0.9; }
.btn-next:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-place {
  background: var(--dp-charcoal);
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: none;
  border: none;
  padding: 0;
  margin-bottom: 2rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--dp-ash);
  cursor: pointer;
  transition: color 0.2s;
}

.btn-back:hover { color: var(--dp-charcoal); }

/* ─── Payment ─── */
.pay-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.pay-option {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 1.125rem;
  border: 1px solid var(--dp-sand);
  cursor: pointer;
  transition: all 0.2s;
}

.pay-option.selected {
  border-color: var(--dp-charcoal);
}

.pay-option input { display: none; }

.radio-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--dp-sand);
  flex-shrink: 0;
  margin-top: 2px;
  transition: all 0.2s;
}

.pay-option.selected .radio-dot {
  border-color: var(--dp-charcoal);
  background: var(--dp-charcoal);
  box-shadow: inset 0 0 0 3px var(--dp-white);
}

.pay-text {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.pay-text strong {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--dp-charcoal);
}

.pay-text span {
  font-family: var(--font-body);
  font-size: 0.6875rem;
  color: var(--dp-ash);
}

.pay-title-row {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.card-icon { color: var(--dp-gold); }

/* ─── Address Recap ─── */
.addr-recap {
  padding: 1.25rem;
  background: var(--dp-ivory);
  margin-bottom: 2rem;
  position: relative;
}

.recap-label {
  font-family: var(--font-body);
  font-size: 0.5625rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: var(--dp-ash);
  margin-bottom: 0.625rem;
}

.recap-body p {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--dp-charcoal);
  margin: 0;
  line-height: 1.5;
}

.recap-edit {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: none;
  border: none;
  font-family: var(--font-body);
  font-size: 0.6875rem;
  color: var(--dp-gold);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* ─── Spinner ─── */
.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: var(--dp-white);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ─── Summary ─── */
.summary-card {
  background: var(--dp-white);
  border: 1px solid var(--dp-sand);
  padding: 1.75rem;
  position: sticky;
  top: 2rem;
}

.sum-title {
  font-family: var(--font-heading);
  font-size: 1.125rem;
  font-weight: 400;
  color: var(--dp-charcoal);
  margin: 0 0 1.25rem 0;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--dp-sand);
}

.sum-count {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--dp-ash);
}

.sum-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 1.25rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid var(--dp-sand);
}

.sum-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.sum-img-wrap {
  width: 50px;
  height: 50px;
  background: var(--dp-ivory);
  position: relative;
  flex-shrink: 0;
  border: 1px solid var(--dp-sand);
}

.sum-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sum-qty-badge {
  position: absolute;
  top: -7px;
  right: -7px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--dp-charcoal);
  color: var(--dp-white);
  font-family: var(--font-body);
  font-size: 0.5625rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sum-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.sum-item-name {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--dp-charcoal);
}

.sum-item-sku {
  font-family: var(--font-body);
  font-size: 0.625rem;
  color: var(--dp-stone);
}

.sum-item-price {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--dp-charcoal);
  white-space: nowrap;
}

.sum-lines {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--dp-sand);
}

.sum-line {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--dp-ash);
}

.text-green {
  color: var(--dp-success);
  font-weight: 600;
}

.sum-total {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 700;
  color: var(--dp-charcoal);
  margin-bottom: 1.25rem;
}

.sum-trust {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  font-family: var(--font-body);
  font-size: 0.625rem;
  color: var(--dp-stone);
  padding-top: 1rem;
  border-top: 1px solid var(--dp-sand);
}

.sum-trust svg { color: var(--dp-gold); }

.free-shipping-text {
  color: var(--color-success);
}
</style>
