import type { ApiProduct } from '~/types/api'
import type { Product, ProductDimension } from '~/types/product'

export function mapApiProductToDomain(apiProduct: ApiProduct): Product {
  // Legacy UI mappers to preserve PDP compatibility
  const colors: string[] = []
  const fabrics: string[] = []
  const dimensions: ProductDimension[] = []
  const materials: string[] = []

  // Extract from options based on title heuristics
  for (const option of apiProduct.options) {
    const lowerTitle = option.title.toLowerCase()
    
    if (lowerTitle.includes('couleur') || lowerTitle.includes('color')) {
      colors.push(...option.values.map(v => v.value))
    } else if (lowerTitle.includes('tissu') || lowerTitle.includes('fabric')) {
      fabrics.push(...option.values.map(v => v.value))
    } else if (lowerTitle.includes('dimension') || lowerTitle.includes('size')) {
      dimensions.push(...option.values.map(v => ({ label: v.label || v.value, value: v.value })))
    }
  }

  // Fallback map tags to materials (temporary mock heuristic)
  materials.push(...(apiProduct.tags || []).filter(t => ['bois', 'métal', 'velours', 'cuir', 'lin', 'coton', 'acier', 'laiton'].includes((t.value || '').toLowerCase())).map(t => t.value))


  return {
    id: apiProduct.id,
    slug: apiProduct.handle || apiProduct.slug || apiProduct.id,
    name: apiProduct.title,
    description: apiProduct.description,
    shortDescription: apiProduct.short_description,
    
    // In Medusa v2, price is often in calculated_price or we fall back to the first price in the first variant
    price: apiProduct.variants?.[0]?.calculated_price?.calculated_amount ?? apiProduct.variants?.[0]?.prices?.[0]?.amount ?? 0,
    compareAtPrice: undefined, // Requires more complex parsing or passing context if available
    currency: apiProduct.variants?.[0]?.calculated_price?.currency_code ?? apiProduct.variants?.[0]?.prices?.[0]?.currency_code ?? 'MAD',
    
    categoryId: apiProduct.categories?.[0]?.id || '',
    categoryIds: (apiProduct.categories || []).map(c => c.id),
    categories: apiProduct.categories || [],
    collectionId: apiProduct.collection?.id || apiProduct.collection_id || '',
    
    // Medusa images use url instead of src in some versions
    images: (apiProduct.images || []).map(img => ({ src: img.url || img.src, alt: img.alt || apiProduct.title })),
    
    options: (apiProduct.options || []).map(o => ({
      id: o.id,
      title: o.title,
      values: (o.values || []).map(v => ({ id: v.id, value: v.value, label: v.label || v.value }))
    })),
    variants: (apiProduct.variants || []).map(v => ({
      id: v.id,
      sku: v.sku,
      price: v.calculated_price?.calculated_amount ?? v.prices?.[0]?.amount ?? v.price ?? 0,
      compareAtPrice: undefined,
      inventoryQuantity: v.inventory_quantity ?? 0,
      options: v.options || {}
    })),

    // Legacy UI mapped properties
    materials,
    colors,
    dimensions: dimensions.length > 0 ? dimensions : undefined,
    fabrics: fabrics.length > 0 ? fabrics : undefined,
    
    tags: (apiProduct.tags || []).map(t => t.value || t.id || String(t)),
    featured: apiProduct.is_featured ?? (Number(apiProduct.id.replace(/\D/g, '') || 0) % 7 === 0 || Number(apiProduct.id.replace(/\D/g, '') || 0) <= 3),
    isNew: apiProduct.is_new ?? (Number(apiProduct.id.replace(/\D/g, '') || 0) % 5 === 0),
    available: apiProduct.is_available ?? true,
    rating: apiProduct.rating || 0,
    reviewsCount: apiProduct.reviews_count || 0,
    sku: apiProduct.sku || apiProduct.id,
    createdAt: apiProduct.created_at || new Date().toISOString(),
  }
}
