# Suspense & Error Boundary Architecture

Reference guide for designing resilient, progressive React applications.

---

## Core mental model

Suspense and Error Boundaries divide the UI into **independently-loading, independently-failing** regions.

- Without Suspense: the entire route waits for all data before rendering anything
- With Suspense: each region renders as its data resolves
- Without Error Boundaries: one component failure crashes the entire tree
- With Error Boundaries: failures are isolated to their containing region

---

## Suspense boundaries

### Boundary granularity guide

| Level | Use when | Risk if missing |
|---|---|---|
| **Route-level** | Route has async data and needs a coherent shell | Blank page while any data loads |
| **Section-level** | Major regions (sidebar, feed) load independently | Slow section blocks fast section |
| **Component-level** | A widget has its own async data | Widget failure affects surrounding layout |
| **Never** | No async data in this subtree | Unnecessary wrapper |

### Fallback quality

The fallback must:
1. **Match the content shape** — prevents layout shift when real content replaces it
2. **Communicate purpose** — user understands what is loading
3. **Be proportional to wait time** — fast data (< 200ms) may not need a visible fallback

```tsx
// ❌ Bad fallback — doesn't match shape, causes layout shift
<Suspense fallback={<div>Loading...</div>}>
  <ProductReviews />
</Suspense>

// ✅ Good fallback — matches the list shape
<Suspense fallback={<ReviewsSkeleton count={5} />}>
  <ProductReviews />
</Suspense>
```

### Waterfall prevention

Waterfalls happen when one Suspense boundary must resolve before the next can start.

```tsx
// ❌ Waterfall: Profile fetches first, then Posts fetches (sequential)
<Suspense fallback={<ProfileSkeleton />}>
  <UserProfile userId={id}>
    {/* Inside UserProfile, it renders: */}
    <Suspense fallback={<PostsSkeleton />}>
      <UserPosts userId={id} />  {/* waits for UserProfile to render first */}
    </Suspense>
  </UserProfile>
</Suspense>

// ✅ Parallel: Both start fetching at the same time
async function UserPage({ id }) {
  const profilePromise = getProfile(id)   // start both
  const postsPromise = getPosts(id)       // in parallel
  return (
    <>
      <Suspense fallback={<ProfileSkeleton />}>
        <UserProfile promise={profilePromise} />
      </Suspense>
      <Suspense fallback={<PostsSkeleton />}>
        <UserPosts promise={postsPromise} />
      </Suspense>
    </>
  )
}
```

---

## Error boundaries

### Placement strategy

Error boundaries isolate failures. Every independently-failing region needs its own.

```tsx
// Route-level: catches catastrophic failures
<ErrorBoundary fallback={<RouteError />}>
  {/* Section-level: catches section-specific failures */}
  <ErrorBoundary fallback={<FeedError onRetry={retry} />}>
    <Feed />
  </ErrorBoundary>
  
  {/* Sidebar can still work even if Feed fails */}
  <ErrorBoundary fallback={<SidebarError />}>
    <Sidebar />
  </ErrorBoundary>
</ErrorBoundary>
```

### Recovery patterns

| Error type | Recovery |
|---|---|
| Network error | Retry button (up to N times) |
| 404 Not Found | Empty state + navigation link |
| 401/403 Auth | Redirect to login / show permission error |
| 500 Server Error | Retry with backoff + escalate after N failures |
| Validation Error | Return to form with field errors (not boundary) |

### react-error-boundary usage

```tsx
import { ErrorBoundary } from 'react-error-boundary'

<ErrorBoundary
  FallbackComponent={FeedErrorFallback}
  onError={(error, info) => telemetry.capture(error, info)}
  onReset={() => router.refresh()}
>
  <Feed />
</ErrorBoundary>
```

---

## Combined Suspense + Error pattern

Every async region should have both:

```tsx
<ErrorBoundary fallback={<ReviewsError />}>
  <Suspense fallback={<ReviewsSkeleton />}>
    <ProductReviews productId={id} />
  </Suspense>
</ErrorBoundary>
```

Pattern rule: **Error Boundary wraps Suspense** so that errors thrown during async resolution are caught.

---

## Suspense + streaming in Next.js App Router

```tsx
// page.tsx — Server Component
export default async function ProductPage({ params }) {
  // Critical data — awaited (blocks shell)
  const product = await getProduct(params.id)
  
  // Deferred data — not awaited, streamed in
  const reviewsPromise = getReviews(params.id)
  
  return (
    <main>
      <ProductHero product={product} />  {/* renders immediately */}
      
      <ErrorBoundary fallback={<ReviewsError />}>
        <Suspense fallback={<ReviewsSkeleton />}>
          <Reviews promise={reviewsPromise} />  {/* streams in */}
        </Suspense>
      </ErrorBoundary>
    </main>
  )
}
```

---

## Anti-patterns

| Anti-pattern | Problem | Fix |
|---|---|---|
| Single root-level `<Suspense>` | Entire page blocked by any async data | Add section-level boundaries |
| No error boundary | One failure crashes entire route | Add boundaries at section level |
| Error boundary with no retry | User stuck on error state forever | Add retry action |
| Nested dependent Suspense | Creates waterfall loading | Fetch in parallel, use sibling Suspense |
| Fallback with different dimensions | Layout shift when real content loads | Match fallback dimensions to content |
| Swallowing errors silently | No telemetry, no user feedback | Always log and always show user feedback |
