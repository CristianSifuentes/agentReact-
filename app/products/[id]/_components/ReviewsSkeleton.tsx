type Props = {
  /** Should match the pageSize used in ReviewsSection (default: 10) to prevent layout shift on reveal. */
  count?: number
  showPagination?: boolean
}

export function ReviewsSkeleton({ count = 10, showPagination = true }: Props) {
  return (
    <section aria-label="Loading reviews" aria-busy="true">
      {/* Heading row — matches <h2>Reviews (N)</h2> width approximately */}
      <div className="skeleton section-heading-skeleton" />

      <ul>
        {Array.from({ length: count }).map((_, i) => (
          <li key={i}>
            <article>
              {/* Header row: author + verified badge + stars + date */}
              <div className="review-header-skeleton">
                <div className="skeleton review-author-skeleton" />
                <div className="skeleton review-stars-skeleton" />
                <div className="skeleton review-date-skeleton" />
              </div>
              {/* Title line — matches <h3> */}
              <div className="skeleton review-title-skeleton" />
              {/* Body — 2 lines approximates a short review paragraph */}
              <div className="skeleton review-body-skeleton" />
              <div className="skeleton review-body-skeleton review-body-skeleton--short" />
            </article>
          </li>
        ))}
      </ul>

      {/* Pagination row — matches <nav> with Previous / Page N of M / Next */}
      {showPagination && (
        <div className="review-pagination-skeleton">
          <div className="skeleton review-pagination-item-skeleton" />
          <div className="skeleton review-pagination-label-skeleton" />
          <div className="skeleton review-pagination-item-skeleton" />
        </div>
      )}
    </section>
  )
}
