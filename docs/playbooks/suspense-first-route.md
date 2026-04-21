# Playbook: Design a Suspense-First Route

A step-by-step guide for building a route where streaming and progressive loading are designed in from the start — not bolted on later.

---

## When to use this playbook

- Designing a new route with async data
- An existing route shows a blank screen until all data loads
- Multiple data sources with different latencies are needed

---

## Phase 1: Content inventory

List every piece of content on the route:

```
Route: /products/[id]
Content:
- Product hero (image, title, price)
- Product description
- Inventory status
- Reviews section
- Related products
- Breadcrumb navigation
```

For each, note:
- Does it require data?
- If so, what data and what is the expected latency?
- Can it render without its data? (shell vs content)

---

## Phase 2: Reveal order design

**Invoke:** `streaming-ux-engineer` + `skill-streaming-route-design`

Assign each piece of content to a tier:

```
Immediate (0ms):
- Layout chrome (header, nav)
- Breadcrumb (static)
- Product skeleton container

Critical (fast data):
- Product hero (image, title, price)
- Product description
- Inventory status badge

Deferred (slow data):
- Reviews section
- Related products
```

Write the user experience narrative:
```
T=0:    User sees the page layout and a product skeleton
T=200ms: Product hero fills in — title, price, images are visible
T=800ms: Reviews stream in below the fold
T=1s:   Related products appear
```

---

## Phase 3: Suspense boundary tree

**Invoke:** `suspense-recovery-architect` + `skill-suspense-boundary-planner`

```tsx
<ErrorBoundary fallback={<RouteError />}>
  {/* Critical: awaited before page renders */}
  <ProductHero product={product} />

  {/* Deferred: streams in */}
  <ErrorBoundary fallback={<ReviewsError />}>
    <Suspense fallback={<ReviewsSkeleton count={5} />}>
      <ReviewsSection promise={reviewsPromise} />
    </Suspense>
  </ErrorBoundary>

  <ErrorBoundary fallback={<RelatedError />}>
    <Suspense fallback={<RelatedSkeleton count={4} />}>
      <RelatedProducts promise={relatedPromise} />
    </Suspense>
  </ErrorBoundary>
</ErrorBoundary>
```

Verify:
- [ ] All deferred fetches start in parallel (not sequential awaits)
- [ ] No nested-dependent Suspense (waterfall risk)
- [ ] Every `<Suspense>` has an `<ErrorBoundary>` parent

---

## Phase 4: Skeleton design

For each Suspense fallback:
- Does the skeleton match the real content's approximate dimensions?
- Does the skeleton communicate what is loading?

Skeleton checklist:
- [ ] Same height/width as real content (prevents CLS)
- [ ] Uses animated shimmer to communicate loading
- [ ] Does not use a spinner for content with a known shape

---

## Phase 5: Framework implementation

**Invoke:** `framework-navigator`

Next.js App Router:
```tsx
// app/products/[id]/page.tsx
export default async function ProductPage({ params }) {
  // Critical: awaited
  const product = await getProduct(params.id)

  // Deferred: not awaited — passed as promises
  const reviewsPromise = getReviews(params.id)
  const relatedPromise = getRelatedProducts(params.id)

  return (
    <main>
      <ProductHero product={product} />
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews promise={reviewsPromise} />
      </Suspense>
      <Suspense fallback={<RelatedSkeleton />}>
        <RelatedProducts promise={relatedPromise} />
      </Suspense>
    </main>
  )
}
```

---

## Phase 6: Perceived performance review

**Invoke:** `performance-perception-analyst` + `skill-perceived-performance-audit`

Walk through the user experience:
- Is the shell visible at T=0? (yes, from layout)
- Is product hero critical content? (yes, awaited)
- Do skeletons match real content? (verify dimensions)
- No layout shift on resolve? (verify)

---

## Checklist

- [ ] Content inventory complete
- [ ] Reveal tiers assigned
- [ ] User experience narrative written
- [ ] All deferred fetches start in parallel
- [ ] Every async region has `<Suspense>` + `<ErrorBoundary>`
- [ ] Skeletons match content dimensions
- [ ] No Suspense waterfalls
- [ ] Framework-specific implementation correct
- [ ] Perceived performance reviewed
