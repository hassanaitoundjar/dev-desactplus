# Disact Plus - Backend Integration Handoff

This document outlines the Medusa backend requirements and configurations necessary for the Disact Plus frontend to fully function. The frontend has been audited for **Medusa correctness**, ensuring it uses standard Medusa data shapes and sequences.

## Current Implementation Status
- **Frontend Framework:** Nuxt 3 (Vue 3 Composition API)
- **Styling:** Native CSS Variables (No Tailwind)
- **API Client:** `app/api/apiClient.ts`
- **Medusa Integration Phase:** FRONTEND IMPLEMENTATION READY

## 1. Medusa Backend Required Configuration

To make this frontend work with a Medusa backend, you must configure the following in the backend environment and settings.

### 1.1 Store Configuration
- **Currencies:** The store must support `MAD` (Moroccan Dirham). The UI assumes Medusa returns financial amounts in minor units (e.g., centimes) and divides by 100 for `formatPrice`.
- **Regions:** Ensure at least one region is created that covers Morocco (`ma`) and provides shipping options for it.

### 1.2 Publishable API Key
The frontend expects a publishable API key to authenticate requests.
1. Generate a publishable API key in your Medusa admin dashboard.
2. Ensure the key is scoped to the relevant sales channels.
3. Update the frontend `.env` file with this key:
   ```env
   NUXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_your_publishable_key
   NUXT_PUBLIC_MEDUSA_URL=http://localhost:9000
   ```

### 1.3 CORS Configuration
Your Medusa backend must allow requests from the frontend origin (e.g., `http://localhost:3000`). Update your `medusa-config.js` `STORE_CORS` environment variable.

---

## 2. API Contract & Readiness Status

The frontend uses standard Medusa Store API endpoints. The following endpoints are actively called:

### CONNECTED / READY (Tested or Structurally Complete)
| Feature | Endpoint | Method |
| :--- | :--- | :--- |
| **Products** | `/store/products` | GET |
| **Products by ID** | `/store/products/{id}` | GET |
| **Categories** | `/store/product-categories` | GET |
| **Collections** | `/store/collections` | GET |
| **Search** | `/store/products` (with `q` query) | GET |
| **Create Cart** | `/store/carts` | POST |
| **Get Cart** | `/store/carts/{id}` | GET |
| **Add Line Item (Variant)** | `/store/carts/{id}/line-items` | POST |
| **Update Line Item** | `/store/carts/{id}/line-items/{line_id}` | POST |
| **Remove Line Item** | `/store/carts/{id}/line-items/{line_id}` | DELETE |

### NEEDS BACKEND CONFIGURATION / VERIFICATION
The following sequence in `app/composables/useCheckout.ts` uses real Medusa endpoints but relies heavily on backend configuration being accurate. If it fails, the frontend will display the error.

| Feature | Endpoint | Method | Note |
| :--- | :--- | :--- | :--- |
| **Update Address** | `/store/carts/{id}` | POST | Requires valid address fields |
| **Get Shipping Options** | `/store/shipping-options/{cart_id}` | GET | Requires region `ma` to have options |
| **Set Shipping Method** | `/store/carts/{id}/shipping-methods` | POST | |
| **Init Payment Sessions** | `/store/carts/{id}/payment-sessions` | POST | Requires payment providers to be installed |
| **Set Payment Session** | `/store/carts/{id}/payment-session` | POST | Expects providers `manual` or `stripe` |
| **Complete Cart** | `/store/carts/{id}/complete` | POST | Generates the real Order |

> **Important Checkout Note:** The mock checkout has been completely removed. The UI will naturally fail (and show an error message) during checkout until shipping options and payment sessions are correctly configured on the backend.

---

## 3. Metadata Contract

The frontend domain model maps certain values from Medusa's metadata field (if present) to populate UI features not natively supported by standard Medusa DTOs.

If you wish to fully utilize the UI, consider enriching your Medusa Products, Categories, and Collections with these exact metadata fields.

### Collections & Categories Metadata
| Field Name | Expected Type | Required | Usage | Fallback |
| :--- | :--- | :--- | :--- | :--- |
| `metadata.image` | string (URL/Path) | Optional | Banner/Cover image in lists | `'/images/collection-salon.png'` |
| `metadata.description` | string | Optional | Subtitle text in UI | `"Collection [Title]"` |
| `metadata.productCount` | number | Optional | Display item count in UI | `0` |
| `metadata.featured` | boolean | Optional | Highlights category in grid | `true` for first 4 items |
| `metadata.order` | number | Optional | Sorting | Array index |

---

## 4. Product Variants & Cart Flow

Medusa requires a `variant_id` to add an item to the cart.
- On the product details page, the UI dynamically resolves the user's selected dimensions, colors, and fabrics to an exact `variant.id`.
- If a product does not have variants (or the combination doesn't exist), the Add to Cart button is disabled.
- The UI *never* falls back to passing the `product.id` to the cart API.

---

## 5. Next Steps for Full Launch
1. Boot up the Medusa backend.
2. Apply the `NUXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` and `NUXT_PUBLIC_MEDUSA_URL` to `.env`.
3. Configure Shipping options for Morocco and install Payment providers (e.g., `manual`) in Medusa.
4. Attempt a real checkout flow to ensure the API sequence succeeds and creates a real order.
