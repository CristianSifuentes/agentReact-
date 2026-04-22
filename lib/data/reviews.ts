import { unstable_cache } from 'next/cache'
import { ReviewsPageSchema } from '@/lib/schemas/product'
import type { ReviewsPage } from '@/lib/schemas/product'

const EMPTY_PAGE = (page: number): ReviewsPage =>
  ({ items: [], totalCount: 0, page, pageSize: 10 })

export const getReviews = unstable_cache(
  async (productId: string, page = 1): Promise<ReviewsPage> => {
    const res = await fetch(
      `${process.env.API_URL}/products/${productId}/reviews?page=${page}`,
      { next: { tags: [`reviews-${productId}`] } }
    )
    // 404 = product exists but has no reviews yet → graceful empty
    if (res.status === 404) return EMPTY_PAGE(page)
    // 5xx = service degradation → let ErrorBoundary handle and offer retry
    if (!res.ok) throw new Error(`Reviews service error: ${res.status} ${res.statusText}`)
    return ReviewsPageSchema.parse(await res.json())
  },
  ['reviews'],
  { revalidate: 120, tags: [] }
)
