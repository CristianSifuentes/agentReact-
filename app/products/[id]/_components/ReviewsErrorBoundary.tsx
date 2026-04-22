'use client'

import { useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { SectionErrorBoundary } from './SectionErrorBoundary'
import { reportError } from '@/lib/telemetry/reportError'

const MAX_RETRIES = 3

function ReviewsErrorFallback({
  onRetry,
  retries,
}: {
  onRetry: () => void
  retries: number
}) {
  const exhausted = retries >= MAX_RETRIES

  return (
    <section aria-label="Customer reviews">
      <h2>Reviews</h2>
      <p role="alert" aria-live="assertive">
        {exhausted
          ? 'Reviews are unavailable right now. Please check back later.'
          : 'Reviews failed to load.'}
      </p>
      {!exhausted && (
        <button type="button" onClick={onRetry}>
          Try again ({MAX_RETRIES - retries} attempt{MAX_RETRIES - retries !== 1 ? 's' : ''} left)
        </button>
      )}
    </section>
  )
}

type Props = {
  productId: string
  resetKeys?: unknown[]
  children: ReactNode
}

export function ReviewsErrorBoundary({ productId, resetKeys, children }: Props) {
  const router = useRouter()
  const [retries, setRetries] = useState(0)

  // Stable ref-like pattern: boundary re-mounts on key change which resets retries
  // here we keep retries in state so the fallback can read them
  function handleRetry() {
    if (retries >= MAX_RETRIES) return
    setRetries((n) => n + 1)
    router.refresh()
  }

  const fallback = (
    <ReviewsErrorFallback onRetry={handleRetry} retries={retries} />
  )

  return (
    <SectionErrorBoundary
      fallback={fallback}
      resetKeys={resetKeys}
      onError={(error, info) =>
        reportError(`reviews-section[${productId}]`, error, info)
      }
    >
      {children}
    </SectionErrorBoundary>
  )
}
