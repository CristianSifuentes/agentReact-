'use client'

import { useEffect } from 'react'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ProductError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main>
      <h1>Something went wrong</h1>
      <p>We could not load this product. Please try again.</p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </main>
  )
}
