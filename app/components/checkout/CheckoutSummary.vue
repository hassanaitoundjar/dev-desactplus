<script setup lang="ts">
import { Lock } from 'lucide-vue-next'
import { useCheckoutLogic } from '~/composables/useCheckoutLogic'
import { formatPrice } from '~/utils/formatPrice'

const { items, cartProducts, subtotal, shipping, discountTotal, couponCode, total } = useCheckoutLogic()
</script>

<template>
  <aside class="summary-col">
    <div class="summary-card">
      <h3 class="sum-title">Votre commande <span class="sum-count">({{ items.reduce((s, i) => s + i.quantity, 0) }})</span></h3>

      <div class="sum-items">
        <div v-for="{ cartItem, product } in cartProducts" :key="cartItem.productId" class="sum-item">
          <div class="sum-img-wrap">
            <img :src="product?.images?.[0]?.src || '/images/collection-lighting.png'" :alt="product?.name" class="sum-img" >
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
        <div v-if="discountTotal > 0" class="sum-line text-green-600">
          <span>Remise {{ couponCode ? `(${couponCode})` : '' }}</span>
          <span>-{{ formatPrice(discountTotal) }}</span>
        </div>
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
</template>

<style scoped>
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
  margin: 0 0 1.5rem 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--dp-sand);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sum-count {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--dp-ash);
}

.sum-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--dp-sand);
}

.sum-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sum-img-wrap {
  position: relative;
  width: 48px;
  height: 60px;
  background: var(--dp-ivory);
  flex-shrink: 0;
}

.sum-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sum-qty-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: var(--dp-charcoal);
  color: var(--dp-white);
  font-family: var(--font-body);
  font-size: 0.625rem;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sum-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.sum-item-name {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--dp-charcoal);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sum-item-sku {
  font-family: var(--font-body);
  font-size: 0.625rem;
  color: var(--dp-stone);
}

.sum-item-price {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--dp-charcoal);
}

.sum-lines {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--dp-sand);
}

.sum-line {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--dp-ash);
}

.text-green-600 {
  color: #16a34a;
}

.free-shipping-text {
  color: #16a34a;
  font-weight: 600;
}

.sum-total {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1.5rem;
}

.sum-total span:first-child {
  font-family: var(--font-heading);
  font-size: 1.125rem;
  color: var(--dp-charcoal);
}

.sum-total span:last-child {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--dp-charcoal);
}

.sum-trust {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  font-family: var(--font-body);
  font-size: 0.6875rem;
  color: var(--dp-ash);
}

.sum-trust svg {
  color: var(--dp-stone);
}
</style>
