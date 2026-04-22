import { unstable_cache } from 'next/cache'

export const getCartCount = unstable_cache(
  async (_userId: string): Promise<number> => {
    // Replace with real DB call: await db.cart.totalItems({ userId })
    return 0
  },
  ['cart-count'],
  { revalidate: 0, tags: ['cart'] }
)
