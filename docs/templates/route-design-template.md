# Route Design: [Route Path]

## Route metadata
- **Path:** `/[path]`
- **Framework:** Next.js App Router / React Router 7
- **Type:** Page / Layout / Parallel / Intercepting
- **Auth required:** Yes / No

---

## Content inventory

| Content region | Requires data? | Data source | Expected latency |
|---|---|---|---|
| Page shell / layout | No | — | 0ms |
| [region 1] | Yes/No | | |
| [region 2] | Yes/No | | |

---

## Streaming plan

| Region | Tier | Fallback |
|---|---|---|
| Page shell | Immediate | — |
| [region 1] | Critical | [skeleton name] |
| [region 2] | Deferred | [skeleton name] |

**Reveal order narrative:**
```
T=0:     User sees [description]
T=Xms:  [description]
T=Yms:  [description]
```

---

## Component tree

```
[RoutePage] (Server)
├─ [Shell] (Server, from layout)
├─ [PrimarySection] (Server) ← awaited
│  └─ [InteractiveWidget] (Client)
└─ <Suspense fallback={<SecondarySkeletons />}>
   └─ [SecondarySection] (Server) ← deferred
```

---

## Data fetching

```typescript
// Parallel fetch pattern
const primaryPromise = getPrimaryData(id)    // critical
const secondaryPromise = getSecondaryData(id) // deferred

const primary = await primaryPromise
// secondary passed as promise to deferred Server Component
```

---

## Suspense + error boundaries

| Boundary | Scope | Fallback | Error UI | Recovery |
|---|---|---|---|---|
| Route-level | Entire route | `<PageSkeleton />` | `<RouteError />` | Navigate away |
| [region] | [scope] | `<[Name]Skeleton />` | `<[Name]Error />` | Retry |

---

## Mutations on this route

| Action | Type | Optimistic? | Invalidates |
|---|---|---|---|
| [action name] | Server Action | Yes/No | [cache tag] |

---

## TypeScript contracts

```typescript
// Data types
type [RouteData] = {}

// Action types (if mutations exist)
type [ActionState] = 
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string }
```

---

## Framework-specific notes
[Any Next.js App Router or React Router 7 specific implementation notes]

---

## Open questions
- [question]
