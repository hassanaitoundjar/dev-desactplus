import { computed } from 'vue'
import { useCart } from './useCart'
import { useProducts } from './useProducts'
import { useApiClient } from '~/api/apiClient'

export function useCheckout() {
  const { cart, items, subtotal, shippingTotal, cartTotal, discountTotal, couponCode, clear } = useCart()
  const { products } = useProducts()
  const client = useApiClient()

  const cartProducts = computed(() => {
    const prodList = products.value
    if (!prodList) return []
    return items.value.map(item => ({
      cartItem: item,
      product: prodList.find(p => p.id === item.productId)
    })).filter(p => p.product)
  })

  // Complete checkout flow according to API v2 Store API
  async function completeCheckout(shippingAddress: any, paymentMethod: string, email?: string) {
    if (!cart.value?.id) throw new Error('No active cart')
    
    try {
      // 1. Complete Cart into Order
      const data = await client.post<{ type: string; data?: any; error?: any }>(
        `/store/carts/${cart.value.id}/complete`,
        {
          email: email || shippingAddress.email,
          shipping_address: shippingAddress,
          payment_method: paymentMethod
        }
      )
      
      if (data.type === 'order' && data.data) {
        clear()
        return data.data
      }

      if (data.error) {
        throw new Error(data.error.message || 'La commande n\'a pas pu être validée.')
      }

      throw new Error('Failed to complete cart, order not created')

    } catch (error) {
      console.error('Checkout failed:', error)
      throw error
    }
  }

  return {
    cartProducts,
    subtotal,
    shipping: shippingTotal,
    discountTotal,
    couponCode,
    total: cartTotal,
    completeCheckout
  }
}
