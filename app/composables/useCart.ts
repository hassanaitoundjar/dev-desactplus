import { computed } from 'vue'
import { useCookie, useNuxtApp, useState } from '#imports'
import { useApiClient } from '~/api/apiClient'

interface CartItem {
  id: string // line item id in Medusa
  productId?: string // for frontend mapping if needed
  variantId: string
  quantity: number
  title: string
  price: number // unit price
  thumbnail?: string
}

interface MedusaCart {
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
}

const COOKIE_KEY = 'dp-cart-id'

export function useCart() {
  const cartIdCookie = useCookie<string | null>(COOKIE_KEY, { watch: true })

  // Use Nuxt's useState for globally shared reactive state across all components
  const cart = useState<MedusaCart | null>('cart', () => null)
  const items = useState<CartItem[]>('cart-items', () => [])
  const isSyncing = useState<boolean>('cart-syncing', () => false)

  const client = useApiClient()

  const count = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const isEmpty = computed(() => items.value.length === 0)
  
  // Totals from Medusa
  const cartTotal = computed(() => (cart.value?.total || 0) / 100) // Medusa uses cents
  const subtotal = computed(() => (cart.value?.subtotal || 0) / 100)
  const shippingTotal = computed(() => (cart.value?.shipping_total || 0) / 100)

  async function syncCart() {
    if (!cartIdCookie.value) return
    isSyncing.value = true
    try {
      const response = await client.get<{ cart: MedusaCart }>(`/store/carts/${cartIdCookie.value}`)
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

  function setCart(medusaCart: MedusaCart) {
    cart.value = medusaCart
    items.value = (medusaCart.items || []).map(item => ({
      id: item.id,
      variantId: item.variant_id,
      productId: item.variant?.product_id,
      quantity: item.quantity,
      title: item.title,
      price: item.unit_price / 100, // Medusa uses cents
      thumbnail: item.thumbnail
    }))
  }

  async function createCart() {
    try {
      const response = await client.post<{ cart: MedusaCart }>('/store/carts', {})
      cartIdCookie.value = response.cart.id
      setCart(response.cart)
      return response.cart
    } catch (error) {
      console.error('Failed to create cart:', error)
      throw error
    }
  }

  // Medusa explicitly requires a variantId to add to the cart
  async function add(variantId: string, quantity = 1) {
    // Prevent duplicate concurrent add calls
    if (isSyncing.value) return
    isSyncing.value = true
    try {
      if (!cartIdCookie.value) {
        await createCart()
      }
      
      const response = await client.post<{ cart: MedusaCart }>(`/store/carts/${cartIdCookie.value}/line-items`, {
        variant_id: variantId,
        quantity
      })
      setCart(response.cart)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      isSyncing.value = false
    }
  }

  async function remove(lineItemId: string) {
    if (!cartIdCookie.value) return
    isSyncing.value = true
    try {
      const response = await client.delete<{ cart: MedusaCart }>(`/store/carts/${cartIdCookie.value}/line-items/${lineItemId}`)
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
      const response = await client.post<{ cart: MedusaCart }>(`/store/carts/${cartIdCookie.value}/line-items/${lineItemId}`, {
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

  return { cart, items, count, cartTotal, subtotal, shippingTotal, isEmpty, isSyncing, add, remove, updateQuantity, clear, isInCart, syncCart }
}
