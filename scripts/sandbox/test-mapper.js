"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapApiProductToDomain = void 0;
function mapApiProductToDomain(apiProduct) {
    var _a, _b, _c;
    // Legacy UI mappers to preserve PDP compatibility
    var colors = [];
    var fabrics = [];
    var dimensions = [];
    var materials = [];
    // Extract from options based on title heuristics
    for (var _i = 0, _d = apiProduct.options; _i < _d.length; _i++) {
        var option = _d[_i];
        var lowerTitle = option.title.toLowerCase();
        if (lowerTitle.includes('couleur') || lowerTitle.includes('color')) {
            colors.push.apply(colors, option.values.map(function (v) { return v.value; }));
        }
        else if (lowerTitle.includes('tissu') || lowerTitle.includes('fabric')) {
            fabrics.push.apply(fabrics, option.values.map(function (v) { return v.value; }));
        }
        else if (lowerTitle.includes('dimension') || lowerTitle.includes('size')) {
            dimensions.push.apply(dimensions, option.values.map(function (v) { return ({ label: v.label || v.value, value: v.value }); }));
        }
    }
    // Fallback map tags to materials (temporary mock heuristic)
    materials.push.apply(materials, (apiProduct.tags || []).filter(function (t) { return ['bois', 'métal', 'velours', 'cuir', 'lin', 'coton', 'acier', 'laiton'].includes(t.toLowerCase()); }));
    return {
        id: apiProduct.id,
        slug: apiProduct.slug,
        name: apiProduct.title,
        description: apiProduct.description,
        shortDescription: apiProduct.short_description,
        price: apiProduct.base_price,
        compareAtPrice: apiProduct.variants.length > 0 ? apiProduct.variants[0].compare_at_price : undefined,
        currency: apiProduct.currency,
        categoryId: apiProduct.category_id,
        collectionId: apiProduct.collection_id,
        images: apiProduct.images,
        // New backend architecture
        options: apiProduct.options,
        variants: apiProduct.variants,
        // Legacy UI mapped properties
        materials: materials,
        colors: colors,
        dimensions: dimensions.length > 0 ? dimensions : undefined,
        fabrics: fabrics.length > 0 ? fabrics : undefined,
        tags: apiProduct.tags || [],
        featured: (_a = apiProduct.is_featured) !== null && _a !== void 0 ? _a : (Number(apiProduct.id) % 7 === 0 || Number(apiProduct.id) <= 3),
        isNew: (_b = apiProduct.is_new) !== null && _b !== void 0 ? _b : (Number(apiProduct.id) % 5 === 0),
        available: (_c = apiProduct.is_available) !== null && _c !== void 0 ? _c : true,
        rating: apiProduct.rating || 0,
        reviewsCount: apiProduct.reviews_count || 0,
        sku: apiProduct.sku || apiProduct.id,
        createdAt: apiProduct.created_at || new Date().toISOString(),
    };
}
exports.mapApiProductToDomain = mapApiProductToDomain;
