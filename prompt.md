# Disact Plus — Medusa Backend Integration

The frontend refactoring phase is already complete.

Do NOT repeat the previous refactoring work unless you discover a real blocking issue.

The following work has already been completed:

* Deduplication
* Component cleanup
* Loading/Empty state standardization
* Composable boundary cleanup
* Async fixes
* Component → Composable → Repository flow
* Repository documentation
* Medusa backend contracts documentation
* API DTO / Domain Model separation
* Mapper improvements
* CSS refactoring
* Cart/Checkout error color standardization
* SEO verification
* Performance cleanup
* Development file cleanup
* TypeScript verification
* Production build verification

Current status:

```text
vue-tsc --noEmit → 0 errors
npm run build → successful
```

---

## Your Mission

Now move the project from:

```text
Medusa-ready frontend
```

to:

```text
Frontend fully prepared for real Medusa integration
```

The goal is to integrate the existing Disact Plus frontend with Medusa without redesigning or unnecessarily rewriting the application.

---

# 1. First Understand the Existing Code

Before changing anything, inspect:

```text
app/api/
app/api/mappers/
app/repositories/
app/composables/
app/types/
app/pages/
app/components/
app/config/
app/utils/
```

Read the existing repository interfaces and mapper implementations.

Understand the existing contracts before implementing anything.

Do NOT create a second architecture.

---

# 2. Preserve the Existing Architecture

The final data flow must remain:

```text
Vue Components
      ↓
Composables
      ↓
Repositories
      ↓
API Client
      ↓
Medusa API
      ↓
DTO
      ↓
Mapper
      ↓
Domain Model
      ↓
Composable / UI
```

Vue components must not directly depend on Medusa response objects.

Avoid putting Medusa-specific logic inside:

```text
pages/
components/
```

Keep backend-specific logic inside the API/repository/mapper layer.

---

# 3. Medusa Configuration

Create or verify a clean configuration for the Medusa backend.

Use environment variables for values such as:

```text
MEDUSA_BACKEND_URL
MEDUSA_PUBLISHABLE_KEY
```

Do not hardcode backend URLs or credentials.

Do not expose secret server-side credentials to the browser.

Review `nuxt.config.ts` and the existing `.env` handling before making changes.

---

# 4. Product Integration

Connect the existing:

```text
product.repository.ts
useProducts.ts
useProduct.ts
```

to the real Medusa product API.

Support the existing frontend requirements for:

* Product listing
* Product detail
* Slugs
* Categories
* Collections
* Images
* Prices
* Variants
* Options
* Availability
* Product metadata

Do not change the Product UI just to accommodate the API.

Instead, adapt the Medusa response through the mapper.

Expected flow:

```text
Medusa Product
      ↓
ApiProduct
      ↓
product.mapper.ts
      ↓
Product
      ↓
Existing Product UI
```

---

# 5. Product Variants and Options

Pay special attention to:

```text
product options
product option values
variants
variant options
prices
currency
availability
```

Medusa uses backend-specific structures.

Do not leak those structures into the Vue components.

The mapper should normalize them into the existing frontend models.

For example:

```text
Medusa snake_case
      ↓
Mapper
      ↓
Frontend camelCase
```

Keep the current frontend naming conventions.

---

# 6. Categories

Connect:

```text
category.repository.ts
useCategories.ts
```

to Medusa.

Support:

```text
get categories
get category
category products
category slug
```

Reuse the existing domain models.

Do not create duplicate category types.

---

# 7. Collections

Connect:

```text
collection.repository.ts
useCollections.ts
```

to Medusa where appropriate.

Make sure collection data is mapped into the existing frontend models.

---

# 8. Search

Review:

```text
useSearch.ts
search.vue
```

and determine how search should work with Medusa.

Avoid implementing a second search system if Medusa already provides the required functionality.

Keep search logic inside the appropriate repository/composable layer.

---

# 9. Cart Integration

This is one of the most important parts.

Review:

```text
useCart.ts
cart.vue
```

Replace mock/local-only cart behavior with the real backend cart flow where required.

The frontend should be able to:

```text
create cart
retrieve cart
add line item
update line item
remove line item
clear cart
retrieve totals
```

Do not calculate authoritative prices on the frontend.

Backend should remain the source of truth for:

```text
product price
variant price
discount
tax
shipping
cart total
```

The frontend should display the values returned by the backend.

---

# 10. Checkout Integration

Review:

```text
useCheckout.ts
pages/checkout/index.vue
pages/checkout/confirmation.vue
```

Connect checkout to the appropriate Medusa workflow.

Keep customer information, shipping information, payment information, and order creation separated.

Do not fake successful payments.

Do not create a confirmation page before the backend confirms the order/payment state.

---

# 11. Shipping

Prepare the frontend for real shipping options.

Do not hardcode shipping prices.

Shipping methods and prices should come from the backend.

The frontend should:

```text
retrieve shipping options
select shipping method
update cart
display shipping cost
display updated total
```

---

# 12. Payment

Do not invent a payment integration.

First inspect the current project and determine what payment provider/backend contract is expected.

Implement the integration through the backend.

The frontend should only handle the required payment UI/state.

Payment confirmation must come from the backend/payment provider.

---

# 13. Orders

After successful checkout/payment:

```text
Cart
 ↓
Checkout
 ↓
Payment
 ↓
Order
 ↓
Confirmation
```

Make sure the confirmation page receives reliable order information from the backend.

Do not rely on localStorage alone for order confirmation.

---

# 14. Error Handling

Continue using:

```text
app/api/errors.ts
```

Normalize Medusa API errors into the application's existing error system.

The UI should receive predictable errors such as:

```text
NetworkError
ApiError
ValidationError
NotFound
PaymentError
```

Do not expose raw Medusa errors directly to customers.

---

# 15. Mock Data

Inspect:

```text
mockProducts.json
test-medusa.vue
```

and all other mock/demo code.

Do not blindly delete anything.

Determine which mock data is still required for development/testing and which should be removed because the real Medusa API now replaces it.

The production application should not accidentally depend on mock product data.

---

# 16. Keep the Existing UI

This is critical.

Do NOT redesign:

* Homepage
* Product cards
* Product page
* Cart
* Checkout
* Navigation
* Typography
* Layout
* Colors
* Animations

The goal is backend integration, not a visual redesign.

---

# 17. Keep Native CSS

Do NOT introduce Tailwind.

Continue using:

```text
tokens.css
main.css
animations.css
scoped CSS
CSS variables
```

Do not replace the current CSS architecture.

---

# 18. SSR and Nuxt 3 Compatibility

Check every new integration for:

* SSR compatibility
* hydration issues
* browser-only APIs
* localStorage/sessionStorage usage
* server/client boundaries
* runtime configuration

Make sure the production build remains successful.

---

# 19. TypeScript

Maintain strict typing.

Do not solve Medusa typing problems using:

```ts
any
as any
```

unless absolutely unavoidable.

Prefer proper DTO types and mapper transformations.

---

# 20. Testing

After implementation, run:

```bash
npm run build
```

and:

```bash
npx vue-tsc --noEmit
```

Also test the main flows manually:

```text
Homepage
Products
Product detail
Category
Collection
Search
Product variant selection
Add to cart
Update cart
Remove from cart
Checkout
Shipping
Payment
Order confirmation
```

---

# 21. Important: Do Not Guess Medusa APIs

Before implementing an endpoint, verify the actual Medusa version and API structure used by the project.

Do not assume an endpoint exists because it existed in another Medusa version.

If something depends on backend configuration, clearly mark it as:

```text
NEEDS BACKEND CONFIGURATION
```

rather than creating fake behavior.

---

# 22. Backend Contract Report

After integration, create/update:

```text
AGENT_HANDOFF.md
```

Document:

### Products

```text
Repository method
→ Medusa endpoint/workflow
→ Request
→ Response
→ Mapper
```

### Categories

Same structure.

### Collections

Same structure.

### Cart

Document:

```text
create cart
add item
update item
remove item
get cart
```

### Checkout

Document:

```text
shipping
payment
order creation
confirmation
```

For every backend dependency, clearly state what the backend developer needs to configure.

---

# 23. Final Architecture

The final architecture should remain approximately:

```text
                    DISACT PLUS
                         │
                 ┌───────▼───────┐
                 │   Nuxt Pages  │
                 │  Components   │
                 └───────┬───────┘
                         │
                 ┌───────▼───────┐
                 │  Composables  │
                 └───────┬───────┘
                         │
                 ┌───────▼───────┐
                 │ Repositories  │
                 └───────┬───────┘
                         │
                 ┌───────▼───────┐
                 │   API Client  │
                 └───────┬───────┘
                         │
                 ┌───────▼───────┐
                 │     Medusa    │
                 └───────┬───────┘
                         │
                 ┌───────▼───────┐
                 │    Mappers    │
                 └───────┬───────┘
                         │
                 ┌───────▼───────┐
                 │ Domain Models │
                 └───────────────┘
```

---

# Final Deliverables

When finished, provide a concise report containing:

## Changed Files

List every important modified/created/deleted file.

## Medusa Integration

List every successfully integrated resource:

```text
Products
Categories
Collections
Search
Cart
Checkout
Shipping
Payment
Orders
```

Mark each:

```text
CONNECTED
PARTIAL
NEEDS BACKEND
```

## Backend Requirements

List exactly what the backend developer still needs to configure.

## Tests

Report:

```text
TypeScript
Build
Lint
Products
Cart
Checkout
Payment
Orders
```

with:

```text
PASS
WARNING
NEEDS BACKEND
```

## Important

Do not stop after changing files.

Actually inspect the resulting code and verify that:

```text
npm run build
```

and:

```text
npx vue-tsc --noEmit
```

still pass.

Do not claim something is integrated unless you actually verified the implementation.

The objective is to leave **Disact Plus clean, maintainable, production-oriented, and straightforward for a backend developer to connect and maintain with Medusa.**
