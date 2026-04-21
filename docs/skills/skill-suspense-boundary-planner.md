# Skill: Suspense Boundary Planner

## Purpose

Define where Suspense boundaries should be placed in a component tree, what fallbacks they should show, and how they interact with each other. Prevent both under-bounding (entire screen blocked) and over-bounding (too many fragmented loading states).

## When to invoke

- Designing a new route with async data
- A page shows a blank screen or spinner for too long
- Loading states feel fragmented and inconsistent
- Multiple async regions need independent loading behavior

## Execution steps

### 1. Map the component tree

Sketch the component hierarchy for the route. Identify:
- Which components are async (Server Components with `await`, or Client Components with suspending hooks)
- Which regions of the UI are logically independent

### 2. Apply boundary granularity rules

Choose the right granularity for each boundary:

| Level | Use when | Example |
|---|---|---|
| **Route-level** | The entire route is async and a single meaningful fallback covers it | Full-page skeleton for a dashboard |
| **Section-level** | A major region (sidebar, feed, panel) can fail or load independently | Feed loads independently of sidebar |
| **Component-level** | A specific widget is async and can be replaced by its own skeleton | A chart widget with its own loading state |
| **Inline-level** | A small piece of async data resolves independently | A user avatar or count that streams in |

### 3. Design each fallback

For every boundary, define:
- **Shape match:** Does the fallback match the real content's layout? (prevents layout shift on resolve)
- **Meaningful content:** Does the fallback tell the user what is loading?
- **Duration expectation:** Is this fallback appropriate for fast (< 200ms), medium (200ms–1s), or slow (> 1s) data?

Fallback guide:
- Fast data: minimal indicator or nothing (avoid flicker)
- Medium data: skeleton matching content shape
- Slow data: skeleton + optional progress indicator

### 4. Check for nesting interactions

Nested Suspense boundaries resolve independently — but:
- If inner boundaries depend on outer data, they create a waterfall
- If too many boundaries show simultaneously, the UI feels fragmented

Rule: Sibling Suspense boundaries are fine. Dependent-nested boundaries are a waterfall risk.

### 5. Produce output

```
## Suspense boundary plan: [route or feature]

### Boundary tree
[Route]
├─ <Suspense fallback={<PageSkeleton />}>    ← route-level
│  ├─ [Primary content] (no boundary needed — inside route boundary)
│  └─ <Suspense fallback={<FeedSkeleton />}> ← section-level
│     └─ [Feed]
│        └─ <Suspense fallback={<CardSkeleton />}> ← component-level
│           └─ [Card with slow data]

### Fallback rationale
| Boundary | Fallback component | Shape match? | Timing |
|---|---|---|---|

### Waterfall risks
### Over-bounding risks (too many fragmented states)
### Recommended boundary count: [N]
```

## Quality checks

- [ ] Every async region has a boundary
- [ ] Every fallback matches the shape of the real content
- [ ] No dependent-nested boundaries that create waterfalls
- [ ] Not so many boundaries that the UI flickers with 10 simultaneous loading states
- [ ] Route-level boundary provides a coherent page skeleton
