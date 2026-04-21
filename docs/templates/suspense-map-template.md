# Suspense Map: [Route or Feature Name]

## Route: `[/path]`

---

## Boundary tree

```
[RouteRoot]
├─ <ErrorBoundary fallback={<RouteError />}>          ← route-level
│  ├─ [ImmediateShell]                               ← no boundary (no data)
│  │
│  ├─ <ErrorBoundary fallback={<SectionAError />}>   ← section-level
│  │  └─ <Suspense fallback={<SectionASkeleton />}>
│  │     └─ [SectionA]                               ← async
│  │
│  └─ <ErrorBoundary fallback={<SectionBError />}>   ← section-level
│     └─ <Suspense fallback={<SectionBSkeleton />}>
│        └─ [SectionB]                               ← async, independent
```

---

## Boundary detail

| Boundary | Type | Wraps | Fallback component | Error component | Tier |
|---|---|---|---|---|---|
| Route | Error + Suspense | Entire route | `<PageSkeleton />` | `<RouteError />` | Critical |
| Section A | Error + Suspense | [description] | `<SectionASkeleton />` | `<SectionAError />` | Critical |
| Section B | Error + Suspense | [description] | `<SectionBSkeleton />` | `<SectionBError />` | Deferred |

---

## Fallback specifications

| Skeleton component | Dimensions | Content | Animation |
|---|---|---|---|
| `<SectionASkeleton />` | [height] | [what it represents] | shimmer |
| `<SectionBSkeleton />` | [height] | [what it represents] | shimmer |

**CLS check:** Every skeleton must match the real content dimensions to prevent layout shift on resolve.

---

## Data fetch parallelism

```typescript
// All deferred fetches start in parallel — none await each other
const sectionAPromise = getSectionAData(id)
const sectionBPromise = getSectionBData(id)

// Only critical data is awaited
const critical = await getCriticalData(id)
```

---

## Waterfall risk assessment

| Risk | Boundary pair | Mitigation |
|---|---|---|
| [risk description] | A → B | [mitigation] |

---

## Recovery flows

| Boundary | Error type | Recovery action |
|---|---|---|
| Section A | Network error | Retry button |
| Section B | 404 | Show empty state, no retry |

---

## Streaming reveal order

```
T=0:    [Immediate] shell visible
T=Xms: [Critical] SectionA resolves
T=Yms: [Deferred] SectionB resolves
```
