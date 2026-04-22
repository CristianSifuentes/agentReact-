import { unstable_cache } from 'next/cache'
import { ProductSchema, RelatedProductListSchema } from '@/lib/schemas/product'
import type { Product, RelatedProduct } from '@/lib/schemas/product'

export const getProduct = unstable_cache(
  async (id: string): Promise<Product> => {
    const res = await fetch(`${process.env.API_URL}/products/${id}`, {
      next: { tags: [`product-${id}`] },
    })
    if (!res.ok) throw new Error(`Product not found: ${id}`)
    // Runtime validation — catches API shape drift at the boundary, not silently at render time
    return ProductSchema.parse(await res.json())
  },
  ['product'],
  { revalidate: 60, tags: [] }
)

export const getRelatedProducts = unstable_cache(
  async (categoryId: string): Promise<RelatedProduct[]> => {
    const res = await fetch(
      `${process.env.API_URL}/products?category=${categoryId}&limit=6`,
      { next: { tags: [`category-${categoryId}`] } }
    )
    // 404 = category has no results → silent empty (no error boundary needed)
    if (res.status === 404) return []
    // 5xx / network = service degradation → throw so RelatedProductsErrorBoundary fires
    if (!res.ok) throw new Error(`Related products service error: ${res.status} ${res.statusText}`)
    return RelatedProductListSchema.parse(await res.json())
  },
  ['related-products'],
  { revalidate: 300, tags: [] }
)
