import type { ErrorInfo } from 'react'

export type ErrorReport = {
  boundary: string
  message: string
  stack: string | undefined
  componentStack: string | null | undefined
  url: string
  timestamp: string
}

/**
 * Central error reporting hook. Swap the body for Sentry, Datadog, etc.
 * Called from every ErrorBoundary's onError callback.
 */
export function reportError(boundary: string, error: Error, info?: ErrorInfo): void {
  const report: ErrorReport = {
    boundary,
    message: error.message,
    stack: error.stack,
    componentStack: info?.componentStack,
    url: typeof window !== 'undefined' ? window.location.href : 'server',
    timestamp: new Date().toISOString(),
  }

  // Replace with: Sentry.captureException(error, { extra: report })
  // or: datadogRum.addError(error, report)
  console.error('[ErrorBoundary]', report)
}
