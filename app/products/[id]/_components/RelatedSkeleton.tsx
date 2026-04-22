type Props = {
  /** Should match the limit used in getRelatedProducts (default: 6) to prevent layout shift on reveal. */
  count?: number
}

export function RelatedSkeleton({ count = 6 }: Props) {
  return (
    <section aria-label="Loading related products" aria-busy="true">
      {/* Heading — matches <h2>You may also like</h2> */}
      <div className="skeleton section-heading-skeleton" />

      {/*
       * Use the same list + grid class as RelatedProducts so the grid container
       * dimensions are identical before and after the skeleton is replaced.
       */}
      <ul className="related-products-grid">
        {Array.from({ length: count }).map((_, i) => (
          <li key={i}>
            {/* Image slot — explicit aspect-ratio in CSS matches <img width height> */}
            <div className="skeleton related-image-skeleton" />
            {/* Title line */}
            <div className="skeleton related-title-skeleton" />
            {/* Price line */}
            <div className="skeleton related-price-skeleton" />
          </li>
        ))}
      </ul>
    </section>
  )
}
