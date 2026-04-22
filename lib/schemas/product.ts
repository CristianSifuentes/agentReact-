import { z } from 'zod'
import {
  ProductIdSchema,
  VariantIdSchema,
  CategoryIdSchema,
  ReviewIdSchema,
} from '@/lib/types/ids'

// ─── Sub-schemas ───────────────────────────────────────────────────────────────

export const ProductImageSchema = z.object({
  id: z.string().min(1),
  url: z.string().url(),
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
})

export const ProductVariantSchema = z.object({
  id: VariantIdSchema,
  color: z.string().min(1),
  size: z.string().min(1),
  stock: z.number().int().min(0),
  priceModifier: z.number(),
})

export const BreadcrumbItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
})

// ─── Product ───────────────────────────────────────────────────────────────────

export const ProductSchema = z.object({
  id: ProductIdSchema,
  title: z.string().min(1),
  description: z.string(),
  brand: z.string().min(1),
  category: z.string().min(1),
  categoryId: CategoryIdSchema,
  price: z.number().positive(),
  currency: z.string().length(3), // ISO 4217
  images: z.array(ProductImageSchema).min(1),
  variants: z.array(ProductVariantSchema),
  averageRating: z.number().min(0).max(5),
  reviewCount: z.number().int().min(0),
  availability: z.enum(['in_stock', 'out_of_stock', 'preorder']),
  sku: z.string().min(1),
  slug: z.string().min(1),
  breadcrumb: z.array(BreadcrumbItemSchema),
})

// ─── Review ────────────────────────────────────────────────────────────────────

export const ReviewSchema = z.object({
  id: ReviewIdSchema,
  author: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string(),
  body: z.string(),
  createdAt: z.string().datetime(),
  verified: z.boolean(),
})

export const ReviewsPageSchema = z.object({
  items: z.array(ReviewSchema),
  totalCount: z.number().int().min(0),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
})

// ─── Related product ───────────────────────────────────────────────────────────

export const RelatedProductSchema = z.object({
  id: ProductIdSchema,
  title: z.string().min(1),
  price: z.number().positive(),
  currency: z.string().length(3),
  image: ProductImageSchema,
  slug: z.string().min(1),
})

export const RelatedProductListSchema = z.array(RelatedProductSchema)

// ─── Derived types — single source of truth ────────────────────────────────────

export type ProductImage    = z.infer<typeof ProductImageSchema>
export type ProductVariant  = z.infer<typeof ProductVariantSchema>
export type BreadcrumbItem  = z.infer<typeof BreadcrumbItemSchema>
export type Product         = z.infer<typeof ProductSchema>
export type Review          = z.infer<typeof ReviewSchema>
export type ReviewsPage     = z.infer<typeof ReviewsPageSchema>
export type RelatedProduct  = z.infer<typeof RelatedProductSchema>
