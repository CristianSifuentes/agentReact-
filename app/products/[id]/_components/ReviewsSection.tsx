import { getReviews } from '@/lib/data/reviews'
import type { Review } from '@/lib/types/product'

type Props = {
  productId: string
  page: number
}

export async function ReviewsSection({ productId, page }: Props) {
  const reviews = await getReviews(productId, page)

  if (reviews.items.length === 0) {
    return (
      <section aria-label="Customer reviews">
        <h2>Reviews</h2>
        <p>No reviews yet. Be the first to review this product.</p>
      </section>
    )
  }

  return (
    <section aria-label="Customer reviews">
      <h2>
        Reviews ({reviews.totalCount})
      </h2>

      <ul>
        {reviews.items.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </ul>

      <ReviewsPagination
        page={reviews.page}
        pageSize={reviews.pageSize}
        totalCount={reviews.totalCount}
      />
    </section>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <li>
      <article aria-label={`Review by ${review.author}`}>
        <header>
          <strong>{review.author}</strong>
          {review.verified && <span aria-label="Verified purchase">Verified</span>}
          <span aria-label={`${review.rating} out of 5 stars`}>
            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
          </span>
          <time dateTime={review.createdAt}>
            {new Date(review.createdAt).toLocaleDateString()}
          </time>
        </header>
        <h3>{review.title}</h3>
        <p>{review.body}</p>
      </article>
    </li>
  )
}

function ReviewsPagination({
  page,
  pageSize,
  totalCount,
}: {
  page: number
  pageSize: number
  totalCount: number
}) {
  const totalPages = Math.ceil(totalCount / pageSize)
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Review pages">
      {page > 1 && (
        <a href={`?reviewPage=${page - 1}`} aria-label="Previous page">
          Previous
        </a>
      )}
      <span>
        Page {page} of {totalPages}
      </span>
      {page < totalPages && (
        <a href={`?reviewPage=${page + 1}`} aria-label="Next page">
          Next
        </a>
      )}
    </nav>
  )
}
