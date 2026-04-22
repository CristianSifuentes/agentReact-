import { ReviewsSkeleton } from './_components/ReviewsSkeleton'
import { RelatedSkeleton } from './_components/RelatedSkeleton'

/**
 * Shown during navigation to this route (before the Server Component resolves).
 * Must structurally match the streamed page so users see no layout shift when
 * loading.tsx is replaced by the real content + streaming skeleton fallbacks.
 *
 * Rule: every section here uses the same component that Suspense will show
 * while that section's data is still in flight.
 */
export default function ProductLoading() {
  return (
    <main aria-busy="true" aria-label="Loading product">

      {/* ── Hero ── */}
      <section aria-label="Product details">
        {/* Image gallery placeholder — aspect-ratio class keeps dimensions stable */}
        <div className="product-image-container skeleton image-gallery-skeleton" />

        <div className="product-info-skeleton">
          {/* Breadcrumb + brand row */}
          <div className="skeleton meta-skeleton" />
          {/* <h1> title */}
          <div className="skeleton title-skeleton" />
          {/* Price */}
          <div className="skeleton price-skeleton" />
          {/* Availability badge */}
          <div className="skeleton availability-skeleton" />
        </div>
      </section>

      {/* ── Add-to-cart form ── */}
      {/*
       * Variant selectors must be in the skeleton — their presence pushes
       * the button down. Omitting them causes the CTA to jump when the form hydrates.
       */}
      <div className="add-to-cart-skeleton" aria-hidden="true">
        <div className="skeleton variant-group-label-skeleton" />
        <div className="variant-radios-skeleton">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton variant-radio-skeleton" />
          ))}
        </div>
        <div className="skeleton variant-group-label-skeleton" />
        <div className="variant-radios-skeleton">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton variant-radio-skeleton" />
          ))}
        </div>
        <div className="skeleton quantity-skeleton" />
        <div className="skeleton button-skeleton" />
      </div>

      {/* ── Reviews (uses same component as the Suspense fallback) ── */}
      <ReviewsSkeleton count={10} showPagination={true} />

      {/* ── Related products (uses same component as the Suspense fallback) ── */}
      <RelatedSkeleton count={6} />

    </main>
  )
}
