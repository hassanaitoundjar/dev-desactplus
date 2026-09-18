<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { X } from 'lucide-vue-next'
import Drawer from '../ui/Drawer.vue'
import { useCart } from '~/composables/useCart'
import { formatPrice } from '~/utils/formatPrice'

const { isOpen, items, cartTotal, subtotal, remove } = useCart()
const router = useRouter()

const FREE_SHIPPING_THRESHOLD = 1300
const amountToFreeShipping = computed(() => {
  const diff = FREE_SHIPPING_THRESHOLD - subtotal.value
  return diff > 0 ? diff : 0
})

const freeShippingPercentage = computed(() => {
  if (subtotal.value >= FREE_SHIPPING_THRESHOLD) return 100
  return (subtotal.value / FREE_SHIPPING_THRESHOLD) * 100
})

function closeCart() {
  isOpen.value = false
}

function goToCheckout() {
  closeCart()
  router.push('/checkout')
}

function goToCart() {
  closeCart()
  router.push('/cart')
}
</script>

<template>
  <Drawer :open="isOpen" side="right" @close="closeCart">
    <!-- Custom Header -->
    <template #header>
      <h3 class="cart-drawer-title">Shopping cart</h3>
      <button class="cart-drawer-close" @click="closeCart">
        <X :size="16" :stroke-width="1.5" />
        <span>Close</span>
      </button>
    </template>

    <!-- Cart Items -->
    <div class="cart-items-container">
      <div v-if="items.length === 0" class="empty-cart">
        <p>Your cart is empty.</p>
        <button class="continue-shopping" @click="closeCart">Continue Shopping</button>
      </div>
      
      <div v-else class="cart-items-list">
        <div v-for="item in items" :key="item.id" class="cart-item">
          <div class="cart-item-image">
            <img v-if="item.thumbnail" :src="item.thumbnail" :alt="item.title" >
            <div v-else class="cart-item-placeholder"/>
          </div>
          <div class="cart-item-details">
            <div class="cart-item-header">
              <h4 class="cart-item-title">{{ item.title }}</h4>
              <button class="cart-item-remove" @click="remove(item.id)">
                <X :size="14" :stroke-width="1.5" />
              </button>
            </div>
            <div class="cart-item-price-qty">
              <span class="cart-item-qty">{{ item.quantity }} &times; </span>
              <span class="cart-item-price">{{ formatPrice(item.price) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Actions -->
    <template #footer>
      <div v-if="items.length > 0" class="cart-drawer-footer">
        <div class="cart-subtotal-row">
          <span class="cart-subtotal-label">Subtotal:</span>
          <span class="cart-subtotal-value">{{ formatPrice(subtotal) }}</span>
        </div>

        <div class="free-shipping-indicator">
          <p class="free-shipping-text">
            <template v-if="amountToFreeShipping > 0">
              Add <span class="free-shipping-amount">{{ formatPrice(amountToFreeShipping) }}</span> to cart and get free shipping!
            </template>
            <template v-else>
              You have free shipping!
            </template>
          </p>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" :style="{ width: freeShippingPercentage + '%' }"/>
          </div>
        </div>

        <div class="cart-actions">
          <button class="btn-view-cart" @click="goToCart">View cart</button>
          <button class="btn-checkout" @click="goToCheckout">Checkout</button>
        </div>
      </div>
    </template>
  </Drawer>
</template>

<style scoped>
/* Header customization */
.cart-drawer-title {
  font-family: var(--font-body);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--dp-charcoal);
  margin: 0;
}

.cart-drawer-close {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--dp-charcoal);
  cursor: pointer;
  padding: 0;
  transition: opacity 0.2s;
}

.cart-drawer-close:hover {
  opacity: 0.7;
}

/* Items container */
.cart-items-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--dp-ash);
  gap: 1rem;
}

.continue-shopping {
  padding: 0.75rem 1.5rem;
  background-color: var(--dp-charcoal);
  color: var(--dp-white);
  border: none;
  border-radius: var(--radius-full);
  font-weight: 500;
  cursor: pointer;
}

.cart-items-list {
  display: flex;
  flex-direction: column;
}

.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--dp-sand);
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-image {
  width: 70px;
  height: 70px;
  background-color: #f9f9f9;
  border-radius: var(--radius-sm);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item-placeholder {
  width: 100%;
  height: 100%;
  background-color: #eee;
}

.cart-item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.cart-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.cart-item-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--dp-charcoal);
  margin: 0 0 0.25rem 0;
}

.cart-item-remove {
  background: none;
  border: none;
  color: var(--dp-ash);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-item-remove:hover {
  color: var(--color-error);
}

.cart-item-price-qty {
  font-size: 0.875rem;
  color: var(--dp-ash);
  margin-top: auto;
}

.cart-item-price {
  color: #F89B5F;
  font-weight: 600;
}

/* Footer Section */
.cart-drawer-footer {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.cart-subtotal-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--dp-charcoal);
}

.cart-subtotal-value {
  color: #F89B5F;
}

.free-shipping-indicator {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.free-shipping-text {
  font-size: 0.875rem;
  color: var(--dp-ash);
  margin: 0;
}

.free-shipping-amount {
  color: #F89B5F;
  font-weight: 600;
}

.progress-bar-bg {
  height: 8px;
  background-color: #f0f0f0;
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: repeating-linear-gradient(
    45deg,
    #F89B5F,
    #F89B5F 10px,
    #f4af85 10px,
    #f4af85 20px
  );
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}

.cart-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-view-cart,
.btn-checkout {
  width: 100%;
  padding: 0.875rem;
  border-radius: var(--radius-full);
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  border: none;
  transition: all 0.2s;
}

.btn-view-cart {
  background-color: #f7f7f7;
  color: var(--dp-charcoal);
}

.btn-view-cart:hover {
  background-color: #e5e5e5;
}

.btn-checkout {
  background-color: #F89B5F;
  color: var(--dp-white);
}

.btn-checkout:hover {
  background-color: #e88a4c;
}
</style>
