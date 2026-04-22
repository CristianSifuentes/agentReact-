import { getRelatedProducts } from '@/lib/data/products'
import type { RelatedProduct } from '@/lib/types/product'

type Props = {
  categoryId: string
  currentProductId: string
}

export async function RelatedProducts({ categoryId, currentProductId }: Props) {
  // Errors propagate to RelatedProductsErrorBoundary — no silent catch here.
  // Empty array (404 / no results) is the only graceful-degradation case.
  const all = await getRelatedProducts(categoryId)
  const products = all.filter((p) => p.id !== currentProductId)

  if (products.length === 0) return null

  return (
    <section aria-label="Related products">
      <h2>You may also like</h2>
      {/* Same class as RelatedSkeleton so grid dimensions are stable across loading → loaded */}
      <ul className="related-products-grid">
        {products.map((product) => (
          <li key={product.id}>
            <a href={`/products/${product.slug}`}>
              <img
                src={product.image.url}
                alt={product.image.alt}
                width={product.image.width}
                height={product.image.height}
              />
              <p>{product.title}</p>
              <p>
                {product.currency} {product.price.toFixed(2)}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
