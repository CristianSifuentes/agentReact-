# Performance Strategy

How RSC Forge thinks about performance: perceived speed first, architectural bottlenecks second, micro-optimization last.

---

## Performance hierarchy

```
1. Perceived speed       ← what users feel
2. Architectural scale   ← what the system can sustain
3. Measured metrics      ← what tools report
4. Micro-optimization    ← what benchmarks show
```

Most performance problems that users notice are in layers 1 and 2. Most developer time spent on performance is in layer 4. Fix that inversion.

---

## Perceived speed strategy

### Principle: Show something useful as fast as possible

The user's experience of speed is determined by:

1. **Time to first content** — how long is the screen blank?
2. **Time to critical content** — how long until they see what they came for?
3. **Time to interactive** — how long until they can do something?
4. **Visual stability** — does layout shift after content loads?

### Shell-first architecture

The route shell (navigation, layout, page header skeleton) must render with zero data dependencies:

```tsx
// page.tsx
export default async function ProductPage({ params }) {
  // ✅ Shell renders immediately from layout.tsx
  // ✅ Critical data — awaited before page content renders
  const product = await getProduct(params.id)
  // ✅ Deferred — starts fetching but doesn't block
  const reviewsPromise = getReviews(params.id)
  
  return (
    <>
      {/* renders at critical tier */}
      <ProductHero product={product} />
      {/* streams in at deferred tier */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews promise={reviewsPromise} />
      </Suspense>
    </>
  )
}
```

### Content reveal tiers

| Tier | Target time | What belongs here |
|---|---|---|
| Immediate | 0ms | Layout, nav, static headings, skeleton containers |
| Critical | < 300ms | Primary content, above-the-fold hero |
| Deferred | 300ms–1s | Feeds, recommendations, secondary panels |
| Lazy | On interaction | Off-screen content, secondary tabs, modals |

---

## Architectural performance

### Reduce hydration cost

Every Client Component adds hydration cost. Strategies:
- Use Server Components for non-interactive UI
- Push `'use client'` to leaf components
- Avoid large Client contexts that force subtrees to hydrate
- Use `React.lazy` for large Client Components not in the critical path

### Parallel data fetching

Never await sequentially when you can start both fetches in parallel:

```tsx
// ❌ Sequential — total time = A + B
const user = await getUser(id)
const posts = await getPosts(id)

// ✅ Parallel — total time = max(A, B)
const [user, posts] = await Promise.all([getUser(id), getPosts(id)])

// ✅ Also parallel — starts both, uses streaming
const userPromise = getUser(id)
const postsPromise = getPosts(id)
// ... pass both as promises to child Server Components
```

### Avoid client-side waterfalls

Client-side data waterfalls happen when a child component can't start fetching until a parent renders:
- Move data fetching to the route level (Server Component)
- Use parallel fetching at the route level
- Pass data down as props, not fetched independently at each level

---

## Metrics that matter

| Metric | What it measures | Target |
|---|---|---|
| FCP (First Contentful Paint) | Time to first visible content | < 1.8s |
| LCP (Largest Contentful Paint) | Time to main content visible | < 2.5s |
| INP (Interaction to Next Paint) | Responsiveness to user input | < 200ms |
| CLS (Cumulative Layout Shift) | Visual stability | < 0.1 |
| TTFB (Time to First Byte) | Server response time | < 800ms |

### What to watch for streaming

- Does the shell render before TTFB completes? (it should, via streaming)
- Does critical content appear within the LCP budget?
- Do deferred sections cause CLS? (skeletons must match content size)

---

## What NOT to optimize (without evidence)

| Premature optimization | Why to skip it |
|---|---|
| `useMemo` on cheap calculations | Compiler handles it; cost of memo > cost of calculation |
| `React.memo` on every component | Only helps when parent re-renders with stable props |
| `useCallback` on all event handlers | Compiler handles it; rarely the actual bottleneck |
| Bundle splitting every small component | HTTP/2 + modern bundlers make this less impactful |
| Virtualization for short lists (< 100 items) | Adds complexity without measurable user benefit |

Profile first. Optimize the thing the profiler identifies.

---

## Bundle size strategy

1. Keep `'use client'` boundaries small and explicit
2. Use `React.lazy` for large Client Components not needed immediately
3. Avoid large third-party libraries in Client Components (date-fns, chart libraries)
4. Prefer tree-shakeable imports: `import { format } from 'date-fns'` not `import dateFns from 'date-fns'`
5. Monitor bundle with Next.js `@next/bundle-analyzer` or equivalent
