# Skill: Streaming Route Design

## Purpose

Design how a route progressively reveals content to users. Assign every piece of content to a streaming tier, define Suspense fallbacks, and produce a reveal-order plan that maximizes perceived speed.

## When to invoke

- Designing a new route with async data
- A route feels slow because it waits for all data before showing anything
- Loading states need to be designed (not just "add a spinner")
- A feature requires streaming with multiple independent data sources

## Execution steps

### 1. Identify all content regions on the route

List every distinct region of the page:
- Navigation / layout chrome
- Page header
- Primary content area(s)
- Secondary panels
- Related content / recommendations
- User-specific sections

### 2. Identify data dependencies for each region

For each region:
- Does it require data? What data?
- What is the expected latency for that data? (fast/medium/slow)
- Can this region render without data, or only with it?

### 3. Assign streaming tiers

| Tier | Renders when | Belongs here |
|---|---|---|
| **Immediate** | No data required | Layout shell, nav, static headers, skeleton containers |
| **Critical** | Fastest data resolves | Primary content, above-the-fold hero |
| **Deferred** | Secondary data resolves | Related content, recommendations, feeds |
| **Lazy** | User action / scroll | Modals, off-screen panels, secondary tabs |

### 4. Design Suspense boundaries

For each async region:
- Where does the `<Suspense>` boundary wrap?
- What is the fallback? (skeleton, spinner, nothing, partial content)
- Can this boundary resolve independently without waiting for siblings?

### 5. Check for waterfall risks

A waterfall happens when Suspense boundary B cannot start resolving until boundary A resolves. Common causes:
- Nested `<Suspense>` where inner fetch depends on outer data
- Sequential `await` inside a Server Component instead of parallel

Fix: start all independent promises in parallel before any `await`.

### 6. Produce output

```
## Streaming plan: [route]

### Reveal order timeline
T=0: [what the user sees immediately]
T=fast: [what streams in first]
T=medium: [what streams in second]
T=slow: [what streams in last or lazy-loads]

### Content tier assignment
| Region | Tier | Data dependency | Latency |
|---|---|---|---|

### Suspense boundary map
| Boundary | Wraps | Fallback | Notes |
|---|---|---|---|

### Waterfall risks identified
### Parallel fetch opportunities
### Perceived experience description
```

## Quality checks

- [ ] Every async region has a Suspense boundary
- [ ] Every Suspense boundary has a meaningful fallback
- [ ] No sequential fetches that could be parallel
- [ ] The shell (Tier: Immediate) renders with zero data dependencies
- [ ] The user sees meaningful content in the first paint
