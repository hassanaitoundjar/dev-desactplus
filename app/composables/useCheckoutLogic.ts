import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '~/composables/useCart'
import { useCheckout } from '~/composables/useCheckout'
import { useApiClient } from '~/api/apiClient'

// Shared state outside the composable so it persists across components
const step = ref(1)
const isSubmitting = ref(false)
const formErrors = ref<Record<string, string>>({})
const checkoutError = ref('')
const bankAccounts = ref<Array<{id: number, bank_name: string, account_name: string, rib: string}>>([])

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

export function useCheckoutLogic() {
  const router = useRouter()
  const { items, isEmpty } = useCart()
  const { cartProducts, subtotal, shipping, discountTotal, couponCode, total, completeCheckout } = useCheckout()
  const api = useApiClient()

  const loadBankAccounts = async () => {
    try {
      const data = await api.get<any>('/store/bank-accounts')
      bankAccounts.value = data || []
    } catch (e) {
      console.error('Failed to fetch bank accounts', e)
    }
  }

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

  function copyToClipboard(text: string) {
    if (import.meta.client) {
      navigator.clipboard.writeText(text)
        .then(() => alert('Copié dans le presse-papiers !'))
        .catch(err => console.error('Failed to copy text: ', err))
    }
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

      const preCheckoutInfo = {
        email: form.value.email,
        name: `${form.value.firstName} ${form.value.lastName}`,
        city: form.value.city,
        total: total.value,
        itemCount: items.value.reduce((s, i) => s + i.quantity, 0),
      }

      const order = await completeCheckout(shippingAddress, form.value.paymentMethod, form.value.email) as { id: string; display_id?: number }
      
      if (!order || !order.id) {
        throw new Error('Commande non finalisée.')
      }
      
      const now = new Date()
      const dateStr = now.toISOString().split('T')[0]!.replace(/-/g, '')
      let displayOrderId: string = order.id
      
      if (order.display_id) {
        displayOrderId = `DP-${dateStr}-${String(order.display_id).padStart(4, '0')}`
      } else {
        displayOrderId = `DP-${dateStr}-${String(order.id).slice(-6).toUpperCase()}`
      }
      
      if (import.meta.client) {
        sessionStorage.setItem('dp-last-order', JSON.stringify({
          ...preCheckoutInfo,
          orderId: displayOrderId,
        }))
      }
      
      // Reset state for next time
      step.value = 1
      form.value = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        notes: '',
        paymentMethod: 'cod',
      }
      
      router.push(`/checkout/confirmation?order=${displayOrderId}`)
    } catch (error: any) {
      console.error('Checkout failed', error)
      checkoutError.value = error.message || 'Une erreur est survenue lors de la validation de la commande.'
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    step,
    isSubmitting,
    formErrors,
    checkoutError,
    bankAccounts,
    form,
    items,
    isEmpty,
    cartProducts,
    subtotal,
    shipping,
    discountTotal,
    couponCode,
    total,
    loadBankAccounts,
    validateStep1,
    goToPayment,
    goBack,
    copyToClipboard,
    placeOrder
  }
}
