'use client'

import { type ReactNode } from 'react'
import { SectionErrorBoundary } from './SectionErrorBoundary'
import { reportError } from '@/lib/telemetry/reportError'

type Props = {
  categoryId: string
  children: ReactNode
}

/**
 * Silent degradation — related products disappearing is better UX than an error
 * message in a non-critical section. Telemetry still fires via onError.
 */
export function RelatedProductsErrorBoundary({ categoryId, children }: Props) {
  return (
    <SectionErrorBoundary
      fallback={null}
      onError={(error, info) =>
        reportError(`related-products[${categoryId}]`, error, info)
      }
    >
      {children}
    </SectionErrorBoundary>
  )
}
