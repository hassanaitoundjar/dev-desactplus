<script setup lang="ts">
import { ShoppingBag, ArrowRight } from 'lucide-vue-next'
import { useCart } from '~/composables/useCart'
import Container from '~/components/ui/Container.vue'
import CartItemList from '~/components/cart/CartItemList.vue'
import CartSummary from '~/components/cart/CartSummary.vue'

definePageMeta({ layout: 'default' })

const { isEmpty, count } = useCart()
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
        <CartItemList />

        <!-- Right: Summary -->
        <CartSummary />
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
</style>
