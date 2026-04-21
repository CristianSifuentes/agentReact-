# React 2026 Principles

Core principles that govern every architecture and implementation decision in this system.

---

## 1. Server-first by default

The default for any new component is a Server Component. Adding `'use client'` requires a justification:
- The component uses browser APIs
- The component has user interaction (event handlers, controlled inputs)
- The component needs React state or effects

If none of these apply, it stays server-side.

**Why:** Server Components eliminate hydration cost, reduce bundle size, and allow direct data fetching without an API layer.

---

## 2. Data belongs on the server

Fetch data in Server Components. Avoid `useEffect + fetch` for data that can be loaded server-side.

Exceptions where client fetching is appropriate:
- Data that must refresh in real-time without navigation
- Data that depends on client-only state (e.g., live user presence)
- Complex mutation result states that need background sync

**Why:** Server-fetched data eliminates client-side loading states, reduces bundle size, and gives you the full power of your server environment (credentials, databases, caches).

---

## 3. Suspense is intentional architecture

Every `<Suspense>` boundary is an architectural decision, not a performance hack. Each boundary has:
- A meaningful fallback that matches the real content shape
- A defined reason for the boundary's granularity
- No waterfall relationship with sibling boundaries

**Why:** Accidental Suspense boundaries lead to fragmented loading states, layout shift on resolve, and confusing UX. Intentional boundaries create coherent progressive reveal.

---

## 4. Perceived speed over measured speed

Optimize for what users feel, not what Lighthouse reports. A page that reveals content progressively feels faster than a page that loads in one shot.

Priorities:
1. Shell renders immediately (zero data dependency)
2. Critical content streams first
3. Secondary content defers
4. Background data fetches are invisible

**Why:** Milliseconds on a benchmark don't map directly to user experience. Reveal order and visual stability matter more than raw load time.

---

## 5. No cargo-cult memoization

Never add `useMemo`, `useCallback`, or `React.memo` without:
- Profiling evidence of a real performance cost
- A downstream consumer that requires a stable reference
- The React Compiler being unavailable for this code

The React Compiler handles most memoization automatically for pure components. Manual memoization on top of it adds noise and can interfere with optimization.

**Why:** Premature memoization increases code complexity, makes components harder to read, and often doesn't help because the bottleneck is elsewhere.

---

## 6. Explicit state ownership

Every piece of state has an owner. Before writing any state, classify it:

| Type | Storage |
|---|---|
| Server data | Server Component fetch |
| Cached server data | `unstable_cache` + `revalidateTag` |
| Optimistic | `useOptimistic` |
| Form | `useActionState` |
| URL state | `useSearchParams` / router |
| Local UI | `useState` |
| Derived | Inline computation |

**Why:** Unclassified state ends up in the wrong layer — client state holding server data, global state holding local UI state. Explicit ownership prevents sync bugs and unnecessary complexity.

---

## 7. Mutations have full lifecycles

Every action — form submission, button click, data write — has a designed lifecycle:

`IDLE → PENDING → (OPTIMISTIC) → SUCCESS | ERROR → ROLLBACK`

Mutations with no pending state allow duplicate submissions. Mutations with no error state leave users confused. Optimistic mutations with no rollback path corrupt state silently.

**Why:** Users interact with mutations under poor network conditions, race conditions, and errors. A mutation without a full lifecycle is an incomplete feature.

---

## 8. Types are contracts

TypeScript types between layers are contracts, not decorations. The type from a Server Action return must align with the component prop that consumes it. Schema validation (Zod) derives types — it doesn't duplicate them.

No `any`. No `as` casts to silence errors. No duplicate type definitions.

**Why:** Type misalignment between server and client is one of the hardest bugs to catch. Treating types as contracts surfaces these mismatches at compile time.

---

## 9. Framework conventions before custom abstractions

When Next.js App Router or React Router 7 provides a convention for a problem, use it. Don't build custom solutions for:
- Loading states → `loading.tsx` / `HydrateFallback`
- Error handling → `error.tsx` / `ErrorBoundary` in route module
- Data fetching → Server Components / `loader`
- Mutations → Server Actions / `action`

Custom abstractions are warranted when framework conventions are genuinely insufficient — not when they require learning a new API.

**Why:** Framework conventions are documented, maintained, and understood by the community. Custom abstractions are a maintenance burden and a knowledge silo.

---

## 10. Accessibility is not an afterthought

Interactive components use semantic HTML elements. Event handlers have keyboard equivalents. ARIA roles are explicit when native semantics are insufficient. `forwardRef` is used when wrapping DOM elements.

**Why:** Accessibility is correctness. A button that isn't keyboard-navigable is a broken button.
