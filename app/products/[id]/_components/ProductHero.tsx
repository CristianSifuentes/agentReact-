import type { Product } from '@/lib/types/product'
import { ProductImageGallery } from './ProductImageGallery'
import { ProductMeta } from './ProductMeta'

type Props = {
  product: Pick<
    Product,
    | 'id'
    | 'title'
    | 'price'
    | 'currency'
    | 'images'
    | 'availability'
    | 'sku'
    | 'averageRating'
    | 'reviewCount'
    | 'brand'
    | 'category'
    | 'breadcrumb'
  >
  selectedVariantId: string | null
}

export function ProductHero({ product, selectedVariantId }: Props) {
  const availabilityLabel: Record<Product['availability'], string> = {
    in_stock: 'In Stock',
    out_of_stock: 'Out of Stock',
    preorder: 'Pre-order',
  }

  return (
    <section aria-label="Product details">
      {/* SERVER renders the gallery shell; CLIENT handles interaction inside */}
      <ProductImageGallery
        images={product.images}
        initialIndex={0}
      />

      <div>
        <ProductMeta
          brand={product.brand}
          category={product.category}
          breadcrumb={product.breadcrumb}
        />

        <h1>{product.title}</h1>

        <p aria-label="Price">
          {product.currency} {product.price.toFixed(2)}
        </p>

        <span aria-label="Availability">
          {availabilityLabel[product.availability]}
        </span>

        <p aria-label="SKU">SKU: {product.sku}</p>

        <p aria-label={`Rating: ${product.averageRating} out of 5`}>
          {product.averageRating.toFixed(1)} / 5 ({product.reviewCount} reviews)
        </p>
      </div>
    </section>
  )
}
