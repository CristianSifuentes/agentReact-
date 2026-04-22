import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/data/products'
import { ProductHero } from './_components/ProductHero'
import { AddToCartForm } from './_components/AddToCartForm'
import { ReviewsSection } from './_components/ReviewsSection'
import { ReviewsSkeleton } from './_components/ReviewsSkeleton'
import { RelatedProducts } from './_components/RelatedProducts'
import { RelatedSkeleton } from './_components/RelatedSkeleton'
import { ReviewsErrorBoundary } from './_components/ReviewsErrorBoundary'
import { RelatedProductsErrorBoundary } from './_components/RelatedProductsErrorBoundary'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ color?: string; size?: string; reviewPage?: string }>
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { id } = await params
  const { color, size, reviewPage } = await searchParams

  const product = await getProduct(id)
  if (!product) notFound()

  // Cart count intentionally omitted from the critical path.
  // getCartCount() is non-critical — it only seeds the optimistic counter in
  // AddToCartForm. Defaulting to 0 avoids blocking the hero on a cart API call;
  // the real count reconciles from state.cartCount after the first mutation.
  const currentCartCount = 0

  const initialVariant =
    product.variants.find((v) => v.color === color && v.size === size) ??
    product.variants[0]

  return (
    <main>
      <ProductHero product={product} selectedVariantId={initialVariant?.id ?? null} />

      <AddToCartForm
        productId={product.id}
        variants={product.variants}
        initialVariantId={initialVariant?.id ?? null}
        currentCartCount={currentCartCount}
      />

      {/* ErrorBoundary wraps Suspense — catches errors thrown during streaming */}
      <ReviewsErrorBoundary
        productId={product.id}
        resetKeys={[reviewPage]}
      >
        <Suspense fallback={<ReviewsSkeleton />}>
          <ReviewsSection
            productId={product.id}
            page={reviewPage ? Number(reviewPage) : 1}
          />
        </Suspense>
      </ReviewsErrorBoundary>

      <RelatedProductsErrorBoundary categoryId={product.categoryId}>
        <Suspense fallback={<RelatedSkeleton />}>
          <RelatedProducts categoryId={product.categoryId} currentProductId={product.id} />
        </Suspense>
      </RelatedProductsErrorBoundary>
    </main>
  )
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) return {}
  return {
    title: product.title,
    description: product.description,
  }
}
