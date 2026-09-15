import { computed } from 'vue'
import { useCookie, useNuxtApp, useState } from '#imports'
import { useApiClient } from '~/api/apiClient'

interface CartItem {
  id: string // line item id in API
  productId?: string // for frontend mapping if needed
  variantId: string
  quantity: number
  title: string
  price: number // unit price
  thumbnail?: string
}

interface APICart {
  id: string
  items: any[]
  subtotal: number
  tax_total: number
  shipping_total: number
  total: number
  shipping_address?: any
  billing_address?: any
  payment_sessions?: any[]
  shipping_methods?: any[]
  region_id?: string
  discount_total?: number
  coupon_code?: string
}

const COOKIE_KEY = 'dp-cart-id'

export function useCart() {
  const cartIdCookie = useCookie<string | null>(COOKIE_KEY, { watch: true })

  // Use Nuxt's useState for globally shared reactive state across all components
  const cart = useState<APICart | null>('cart', () => null)
  const items = useState<CartItem[]>('cart-items', () => [])
  const isSyncing = useState<boolean>('cart-syncing', () => false)

  const client = useApiClient()

  const count = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const isEmpty = computed(() => items.value.length === 0)
  
  // Totals from API
  const subtotal = computed(() => (cart.value?.subtotal || 0) / 100)
  const shippingTotal = computed(() => {
    return (cart.value?.shipping_total || 0) / 100
  })
  const discountTotal = computed(() => (cart.value?.discount_total || 0) / 100)
  const cartTotal = computed(() => {
    const total = subtotal.value - discountTotal.value + shippingTotal.value
    return Math.max(0, total)
  })
  const couponCode = computed(() => cart.value?.coupon_code || null)

  async function syncCart() {
    if (!cartIdCookie.value) return
    isSyncing.value = true
    try {
      const response = await client.get<{ cart: APICart }>(`/store/carts/${cartIdCookie.value}`)
      setCart(response.cart)
    } catch (error) {
      console.error('Failed to sync cart:', error)
      cartIdCookie.value = null
      cart.value = null
      items.value = []
    } finally {
      isSyncing.value = false
    }
  }

  function setCart(apiCart: APICart) {
    cart.value = apiCart
    items.value = (apiCart.items || []).map(item => ({
      id: item.id,
      variantId: item.variant_id,
      productId: item.variant?.product_id,
      quantity: item.quantity,
      title: item.title,
      price: item.unit_price / 100, // API uses cents
      thumbnail: item.thumbnail
    }))
  }

  async function createCart() {
    try {
      const response = await client.post<{ cart: APICart }>('/store/carts', {})
      cartIdCookie.value = response.cart.id
      setCart(response.cart)
      return response.cart
    } catch (error) {
      console.error('Failed to create cart:', error)
      throw error
    }
  }

  // API explicitly requires a variantId to add to the cart
  async function add(variantId: string, quantity = 1) {
    // Prevent duplicate concurrent add calls
    if (isSyncing.value) return
    isSyncing.value = true
    try {
      if (!cartIdCookie.value) {
        await createCart()
      }
      
      const response = await client.post<{ cart: APICart }>(`/store/carts/${cartIdCookie.value}/line-items`, {
        variant_id: variantId,
        quantity
      })
      setCart(response.cart)
    } catch (error: any) {
      if (error?.status === 404 || error?.name === 'NotFoundError') {
        cartIdCookie.value = null
        isSyncing.value = false // release lock
        return add(variantId, quantity)
      }
      console.error('Failed to add to cart:', error)
    } finally {
      isSyncing.value = false
    }
  }

  async function remove(lineItemId: string) {
    if (!cartIdCookie.value) return
    isSyncing.value = true
    try {
      const response = await client.delete<{ cart: APICart }>(`/store/carts/${cartIdCookie.value}/line-items/${lineItemId}`)
      setCart(response.cart)
    } catch (error) {
      console.error('Failed to remove from cart:', error)
    } finally {
      isSyncing.value = false
    }
  }

  async function updateQuantity(lineItemId: string, quantity: number) {
    if (!cartIdCookie.value) return
    if (quantity === 0) return remove(lineItemId)
    
    isSyncing.value = true
    try {
      const response = await client.post<{ cart: APICart }>(`/store/carts/${cartIdCookie.value}/line-items/${lineItemId}`, {
        quantity
      })
      setCart(response.cart)
    } catch (error) {
      console.error('Failed to update quantity:', error)
    } finally {
      isSyncing.value = false
    }
  }

  function clear() {
    cartIdCookie.value = null
    cart.value = null
    items.value = []
  }

  function isInCart(variantId: string): boolean {
    return items.value.some((i) => i.variantId === variantId)
  }

  // Initial sync on client side if cookie exists
  const nuxtApp = useNuxtApp()
  if (import.meta.client && cartIdCookie.value && !cart.value) {
    // Prevent blocking hydration
    nuxtApp.hook('app:mounted', () => {
      syncCart()
    })
  }

  async function applyCoupon(code: string) {
    if (!cartIdCookie.value) return
    isSyncing.value = true
    try {
      const response = await client.post<{ cart: APICart, message: string }>(`/store/carts/${cartIdCookie.value}/coupons`, {
        coupon_code: code
      })
      setCart(response.cart)
      return response.message
    } catch (error: any) {
      console.error('Failed to apply coupon:', error)
      throw error
    } finally {
      isSyncing.value = false
    }
  }

  async function removeCoupon() {
    if (!cartIdCookie.value) return
    isSyncing.value = true
    try {
      const response = await client.delete<{ cart: APICart, message: string }>(`/store/carts/${cartIdCookie.value}/coupons`)
      setCart(response.cart)
      return response.message
    } catch (error: any) {
      console.error('Failed to remove coupon:', error)
      throw error
    } finally {
      isSyncing.value = false
    }
  }

  return {
    cart,
    items,
    isSyncing,
    count,
    isEmpty,
    cartTotal,
    subtotal,
    shippingTotal,
    discountTotal,
    couponCode,
    syncCart,
    add,
    updateQuantity,
    remove,
    clear,
    isInCart,
    applyCoupon,
    removeCoupon
  }
}
