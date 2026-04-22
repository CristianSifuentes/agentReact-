// Re-exports from the canonical schema file.
// Import from here OR from @/lib/schemas/product — both resolve to the same type.
// Schemas (Zod) are the source of truth; types are derived via z.infer<>.
export type {
  ProductImage,
  ProductVariant,
  BreadcrumbItem,
  Product,
  Review,
  ReviewsPage,
  RelatedProduct,
} from '@/lib/schemas/product'
