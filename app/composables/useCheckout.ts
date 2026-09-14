import { computed } from 'vue'
import { useCart } from './useCart'
import { useProducts } from './useProducts'
import { useApiClient } from '~/api/apiClient'

export function useCheckout() {
  const { cart, items, subtotal, shippingTotal, cartTotal, clear } = useCart()
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

  // Complete checkout flow according to Medusa v2 Store API
  async function completeCheckout(shippingAddress: any, paymentMethod: string, email?: string) {
    if (!cart.value?.id) throw new Error('No active cart')
    
    try {
      // 1. Update Cart Email & Address
      await client.post(`/store/carts/${cart.value.id}`, {
        email: email || shippingAddress.email,
        shipping_address: shippingAddress,
        billing_address: shippingAddress
      })

      // 2. Select Shipping Method (Medusa v2 uses ?cart_id query param)
      const { shipping_options } = await client.get<{ shipping_options: any[] }>(
        `/store/shipping-options?cart_id=${cart.value.id}`
      )
      if (shipping_options && shipping_options.length > 0) {
        await client.post(`/store/carts/${cart.value.id}/shipping-methods`, {
          option_id: shipping_options[0].id
        })
      } else {
        console.warn('No shipping options returned for cart')
      }

      // 3. Initialize Payment Collection & Payment Session (Medusa v2 architecture)
      try {
        const { payment_collection } = await client.post<{ payment_collection: { id: string } }>(
          '/store/payment-collections',
          { cart_id: cart.value.id }
        )

        if (payment_collection?.id) {
          let providerId = 'pp_system_default'
          try {
            const regionId = cart.value.region_id
            if (regionId) {
              const { payment_providers } = await client.get<{ payment_providers: { id: string }[] }>(
                `/store/payment-providers?region_id=${regionId}`
              )
              if (payment_providers && payment_providers.length > 0) {
                const matched = payment_providers.find(p => 
                  paymentMethod === 'cod' 
                    ? p.id.includes('default') || p.id.includes('manual') 
                    : p.id.includes('stripe')
                )
                providerId = matched?.id || payment_providers[0].id
              }
            }
          } catch (e) {
            console.warn('Using default payment provider:', providerId, e)
          }

          // Create payment session
          await client.post(`/store/payment-collections/${payment_collection.id}/payment-sessions`, {
            provider_id: providerId
          })
        }
      } catch (paymentErr) {
        console.warn('Payment collection step error:', paymentErr)
      }

      // 4. Complete Cart into Order
      const data = await client.post<{ type: string; order?: any; cart?: any; error?: any }>(
        `/store/carts/${cart.value.id}/complete`,
        {}
      )
      
      if (data.type === 'order' && data.order) {
        clear()
        return data.order
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
    total: cartTotal,
    completeCheckout
  }
}
