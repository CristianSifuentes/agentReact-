import { z } from 'zod'
import { ProductIdSchema, VariantIdSchema } from '@/lib/types/ids'

// ─── Action input schema ───────────────────────────────────────────────────────
// Single source of truth for both runtime validation and TypeScript input type.
// Branded IDs applied here so downstream code works with ProductId / VariantId.

export const AddToCartSchema = z.object({
  productId: ProductIdSchema,
  variantId: VariantIdSchema,
  quantity: z.coerce
    .number({ invalid_type_error: 'Quantity must be a number' })
    .int('Quantity must be a whole number')
    .min(1, 'Minimum quantity is 1')
    .max(10, 'Maximum quantity is 10'),
})

export type AddToCartInput = z.output<typeof AddToCartSchema>

// ─── Field errors ──────────────────────────────────────────────────────────────
// Keyed by the schema's own input field names — can never drift from the schema.
// Uses z.input (pre-transform) because error paths reference the raw field names.

export type CartFieldErrors = Partial<Record<keyof z.input<typeof AddToCartSchema>, string>>

// ─── Action result ─────────────────────────────────────────────────────────────

export type CartActionState =
  | { status: 'idle' }
  | { status: 'success'; cartCount: number }
  | { status: 'validation_error'; errors: CartFieldErrors }
  | { status: 'server_error'; message: string }
