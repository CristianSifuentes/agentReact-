'use client'

import { useActionState, useOptimistic, useState, useEffect, useRef, useId } from 'react'
import { useRouter } from 'next/navigation'
import type { ProductVariant } from '@/lib/types/product'
import type { CartActionState } from '@/lib/types/cart'
import { addToCartAction } from '../_actions/cart'

type Props = {
  productId: string
  variants: ProductVariant[]
  initialVariantId: string | null
  currentCartCount: number
}

// ─── Client-side validation ────────────────────────────────────────────────────

function validateSelection(variantId: string | null, quantity: number) {
  const errors: { variantId?: string; quantity?: string } = {}
  if (!variantId) errors.variantId = 'Please select a size and color'
  if (quantity < 1 || quantity > 10) errors.quantity = 'Quantity must be between 1 and 10'
  return errors
}

// ─── Component ─────────────────────────────────────────────────────────────────

const IDLE: CartActionState = { status: 'idle' }

export function AddToCartForm({
  productId,
  variants,
  initialVariantId,
  currentCartCount,
}: Props) {
  const router = useRouter()
  const quantityId = useId()

  const [state, formAction, isPending] = useActionState(addToCartAction, IDLE)

  // Optimistic cart count — incremented immediately on submit, reconciled on success
  const [optimisticCartCount, incrementOptimistic] = useOptimistic(
    currentCartCount,
    (current: number, increment: number) => current + increment
  )

  // Derive unique color/size options from variants
  const colors = [...new Set(variants.map((v) => v.color))]
  const sizes = [...new Set(variants.map((v) => v.size))]

  // Controlled variant selection — source of truth for variantId and out-of-stock state
  const initialVariant = variants.find((v) => v.id === initialVariantId)
  const [selectedColor, setSelectedColor] = useState(initialVariant?.color ?? colors[0] ?? '')
  const [selectedSize, setSelectedSize] = useState(initialVariant?.size ?? sizes[0] ?? '')
  const [quantity, setQuantity] = useState(1)
  const [clientErrors, setClientErrors] = useState<{ variantId?: string; quantity?: string }>({})

  const selectedVariant =
    variants.find((v) => v.color === selectedColor && v.size === selectedSize) ?? null

  const isOutOfStock = selectedVariant ? selectedVariant.stock === 0 : false
  const isDisabled = isPending || isOutOfStock

  // Skip the mount fire: the URL already reflects the server-resolved variant.
  // Firing router.replace on mount triggers an unnecessary soft navigation that
  // re-evaluates server components and can cause a visible loading flash.
  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    const params = new URLSearchParams(window.location.search)
    if (selectedColor) params.set('color', selectedColor)
    if (selectedSize) params.set('size', selectedSize)
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [selectedColor, selectedSize, router])

  // Surface server validation errors as field errors too
  const variantError =
    clientErrors.variantId ??
    (state.status === 'validation_error' ? state.errors.variantId : undefined)
  const quantityError =
    clientErrors.quantity ??
    (state.status === 'validation_error' ? state.errors.quantity : undefined)

  function handleSubmit(formData: FormData) {
    // Client-side guard before sending to server
    const errors = validateSelection(selectedVariant?.id ?? null, quantity)
    if (Object.keys(errors).length > 0) {
      setClientErrors(errors)
      return
    }
    setClientErrors({})
    incrementOptimistic(quantity)
    formAction(formData)
  }

  return (
    <form action={handleSubmit} noValidate>
      <input type="hidden" name="productId" value={productId} />
      {/* P2 fix — variantId derived from controlled color + size selection */}
      <input type="hidden" name="variantId" value={selectedVariant?.id ?? ''} />

      <fieldset disabled={isPending}>
        <legend>Select variant</legend>

        {/* Color selector */}
        <div role="group" aria-label="Color" aria-describedby={variantError ? 'variant-error' : undefined}>
          {colors.map((color) => {
            const available = variants.some(
              (v) => v.color === color && v.size === selectedSize && v.stock > 0
            )
            return (
              <label key={color} data-unavailable={!available || undefined}>
                <input
                  type="radio"
                  name="color"
                  value={color}
                  checked={selectedColor === color}
                  onChange={() => setSelectedColor(color)}
                  aria-label={`${color}${!available ? ' (unavailable in selected size)' : ''}`}
                />
                {color}
              </label>
            )
          })}
        </div>

        {/* Size selector */}
        <div role="group" aria-label="Size">
          {sizes.map((size) => {
            const available = variants.some(
              (v) => v.size === size && v.color === selectedColor && v.stock > 0
            )
            return (
              <label key={size} data-unavailable={!available || undefined}>
                <input
                  type="radio"
                  name="size"
                  value={size}
                  checked={selectedSize === size}
                  onChange={() => setSelectedSize(size)}
                  aria-label={`Size ${size}${!available ? ' (out of stock)' : ''}`}
                />
                {size}
              </label>
            )
          })}
        </div>

        {variantError && (
          <p id="variant-error" role="alert" aria-live="assertive">
            {variantError}
          </p>
        )}

        {/* Stock indicator */}
        {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 5 && (
          <p aria-live="polite">Only {selectedVariant.stock} left in stock</p>
        )}
        {isOutOfStock && <p role="status">This combination is out of stock</p>}

        {/* Quantity */}
        <label htmlFor={quantityId}>Quantity</label>
        <input
          id={quantityId}
          type="number"
          name="quantity"
          value={quantity}
          min={1}
          max={Math.min(10, selectedVariant?.stock ?? 10)}
          onChange={(e) => setQuantity(Number(e.target.value))}
          aria-describedby={quantityError ? 'quantity-error' : undefined}
          aria-invalid={quantityError ? true : undefined}
        />
        {quantityError && (
          <p id="quantity-error" role="alert" aria-live="assertive">
            {quantityError}
          </p>
        )}
      </fieldset>

      {/* Submit */}
      <button
        type="submit"
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={isPending}
      >
        {isPending
          ? 'Adding…'
          : isOutOfStock
          ? 'Out of Stock'
          : 'Add to Cart'}
      </button>

      {/* Optimistic cart count feedback */}
      {optimisticCartCount > 0 && (
        <p aria-live="polite" aria-atomic="true">
          {optimisticCartCount} item{optimisticCartCount !== 1 ? 's' : ''} in cart
        </p>
      )}

      {/* Success state */}
      {state.status === 'success' && (
        <p role="status" aria-live="polite">
          Added to cart. You now have {state.cartCount} item{state.cartCount !== 1 ? 's' : ''}.
        </p>
      )}

      {/* Server error with retry affordance */}
      {state.status === 'server_error' && (
        <p role="alert" aria-live="assertive">
          {state.message}
        </p>
      )}
    </form>
  )
}
