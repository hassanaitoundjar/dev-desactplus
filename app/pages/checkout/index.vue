<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '~/composables/useCart'
import { useCheckoutLogic } from '~/composables/useCheckoutLogic'
import Container from '~/components/ui/Container.vue'
import { Lock, Check } from 'lucide-vue-next'

import CheckoutAddresses from '~/components/checkout/CheckoutAddresses.vue'
import CheckoutPayment from '~/components/checkout/CheckoutPayment.vue'
import CheckoutSummary from '~/components/checkout/CheckoutSummary.vue'

definePageMeta({ layout: 'default' })

const router = useRouter()
const { isEmpty } = useCart()
const { step, loadBankAccounts } = useCheckoutLogic()

onMounted(async () => {
  if (isEmpty.value) router.replace('/cart')
  await loadBankAccounts()
})
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
        <div class="progress-line" :class="{ filled: step >= 2 }"/>
        <div class="progress-step" :class="{ active: step >= 2 }">
          <span class="progress-num">2</span>
          <span class="progress-label">Paiement</span>
        </div>
        <div class="progress-line" :class="{ filled: step >= 3 }"/>
        <div class="progress-step" :class="{ active: step >= 3 }">
          <span class="progress-num">3</span>
          <span class="progress-label">Confirmation</span>
        </div>
      </div>

      <div class="checkout-grid">
        <!-- Form Column -->
        <div class="form-col">
          <CheckoutAddresses />
          <CheckoutPayment />
        </div>

        <!-- Summary Column -->
        <CheckoutSummary />
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
</style>
