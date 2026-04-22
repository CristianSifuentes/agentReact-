'use server'

import { revalidateTag } from 'next/cache'
import { AddToCartSchema } from '@/lib/schemas/cart'
import type { AddToCartInput, CartActionState } from '@/lib/schemas/cart'

export async function addToCartAction(
  prevState: CartActionState,
  formData: FormData
): Promise<CartActionState> {
  const parsed = AddToCartSchema.safeParse({
    productId: formData.get('productId'),
    variantId: formData.get('variantId'),
    quantity: formData.get('quantity') ?? 1,
  })

  if (!parsed.success) {
    // flatten() returns { fieldErrors: Record<fieldName, string[]> } typed by the schema —
    // no manual path[0] cast needed; first message per field wins.
    const { fieldErrors } = parsed.error.flatten()
    return {
      status: 'validation_error',
      errors: {
        productId: fieldErrors.productId?.[0],
        variantId: fieldErrors.variantId?.[0],
        quantity:  fieldErrors.quantity?.[0],
      },
    }
  }

  return executeAddToCart(parsed.data)
}

async function executeAddToCart(input: AddToCartInput): Promise<CartActionState> {
  try {
    // const session = await getSession()
    // if (!session) return { status: 'server_error', message: 'You must be logged in to add items to cart' }

    // const variant = await db.productVariant.findUnique({ where: { id: input.variantId } })
    // if (!variant) return { status: 'server_error', message: 'The selected variant is no longer available' }
    // if (variant.stock < input.quantity) return { status: 'server_error', message: `Only ${variant.stock} item(s) left in stock` }

    // const cart = await db.cart.upsertItem({
    //   userId: session.userId,
    //   variantId: input.variantId,
    //   quantity: input.quantity,
    // })

    revalidateTag('cart')

    // return { status: 'success', cartCount: cart.totalItems }
    return { status: 'success', cartCount: 1 } // replace with real count from DB
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Could not add item to cart. Please try again.'
    return { status: 'server_error', message }
  }
}
