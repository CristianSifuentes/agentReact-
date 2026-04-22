import { z } from 'zod'

// ─── Brand utility ─────────────────────────────────────────────────────────────
// Branded types are assignable to their base type (ProductId → string) but
// not the other way around (string ↛ ProductId). This prevents passing a
// CategoryId where a ProductId is expected at compile time.

type Brand<T, B extends string> = T & { readonly _brand: B }

// ─── Domain ID types ───────────────────────────────────────────────────────────

export type ProductId  = Brand<string, 'ProductId'>
export type VariantId  = Brand<string, 'VariantId'>
export type CategoryId = Brand<string, 'CategoryId'>
export type ReviewId   = Brand<string, 'ReviewId'>
export type UserId     = Brand<string, 'UserId'>

// ─── Zod schemas that produce branded types ────────────────────────────────────
// Use these at system entry points (API responses, form inputs, URL params).
// The transform applies the brand; downstream code receives the branded type.

export const ProductIdSchema  = z.string().min(1).transform((s): ProductId  => s as ProductId)
export const VariantIdSchema  = z.string().min(1).transform((s): VariantId  => s as VariantId)
export const CategoryIdSchema = z.string().min(1).transform((s): CategoryId => s as CategoryId)
export const ReviewIdSchema   = z.string().min(1).transform((s): ReviewId   => s as ReviewId)
export const UserIdSchema     = z.string().min(1).transform((s): UserId     => s as UserId)
