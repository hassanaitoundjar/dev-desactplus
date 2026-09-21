<script setup lang="ts">
import { computed } from 'vue'
import { Trash2 } from 'lucide-vue-next'
import { useCart } from '~/composables/useCart'
import { useProducts } from '~/composables/useProducts'
import { formatPrice } from '~/utils/formatPrice'

const { items, remove, updateQuantity, clear } = useCart()
const { products: allProducts } = useProducts()

const cartProducts = computed(() => {
  if (!allProducts.value) return []
  return items.value.map(item => ({
    cartItem: item,
    product: allProducts.value.find(p => p.id === item.productId)
  })).filter(p => p.product)
})

const itemLineTotal = (price: number, qty: number) => formatPrice(price * qty)
</script>

<template>
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
</template>

<style scoped>
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
</style>
