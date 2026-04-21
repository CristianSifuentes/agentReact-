# Skill: Framework Translation

## Purpose

Translate a React feature or architecture from Next.js App Router to React Router 7 (or vice versa). Produce a side-by-side comparison showing both implementations, the trade-offs, and a migration checklist.

## When to invoke

- Evaluating whether to switch frameworks for a feature or project
- Migrating an existing implementation between frameworks
- Teaching or comparing React patterns across frameworks
- A team is considering adopting a second framework and needs to understand the delta

## Framework equivalence map

| Concern | Next.js App Router | React Router 7 |
|---|---|---|
| Server data loading | `async` Server Component | `loader` in route module |
| Route mutation | Server Action (`'use server'`) | `action` in route module |
| Client data loading | `'use client'` + TanStack Query | `clientLoader` |
| Client mutation | `'use client'` + Server Action | `clientAction` |
| Loading UI | `loading.tsx` | `HydrateFallback` in route module |
| Error UI | `error.tsx` | `ErrorBoundary` in route module |
| Layouts | Nested `layout.tsx` | Nested routes with `<Outlet>` |
| Streaming | `<Suspense>` in Server Components | `defer()` + `<Await>` in loader |
| Metadata | `export const metadata` | `<title>` / `react-helmet-async` |
| Parallel routes | Parallel route segments | Multiple loaders / split components |
| Route groups | `(group)` folders | Nested route file organization |
| Middleware | `middleware.ts` | Route loader guards |
| Static generation | `generateStaticParams` | Pre-rendering config |

## Execution steps

### 1. Define the feature to translate

Describe:
- What the feature does
- Current framework
- Key data loading and mutation requirements
- Route structure

### 2. Map each concern to the target framework

For each concern (data loading, mutation, streaming, error handling, layout), identify the equivalent in the target framework and note differences.

### 3. Produce side-by-side implementation

For both frameworks, show:
- Route/file structure
- Key code outline (not full implementation — structural outline)
- Data loading pattern
- Mutation pattern
- Streaming approach

### 4. Compare trade-offs

| Concern | Next.js | React Router 7 | Winner for this case |
|---|---|---|---|
| Server Components | Native | Not supported (RSC opt-in experimental) | Next.js |
| Streaming | Native `<Suspense>` | `defer()` + `<Await>` | Next.js |
| Data loading | Server Component | Typed `loader` function | RR7 (explicit typing) |
| Mutation | Server Action | `action` function | Similar |
| Bundle size | Framework overhead | Smaller runtime | RR7 |
| Deployment | Vercel-optimized | Platform-agnostic | Depends on deployment |

### 5. Produce output

```
## Framework translation: [feature]

### Next.js App Router
#### File structure
#### Key code outline
#### Streaming approach
#### Notes

### React Router 7
#### File structure
#### Key code outline
#### Streaming approach
#### Notes

### Comparison table
| Concern | Next.js | React Router 7 | Notes |
|---|---|---|---|

### Recommendation for this feature/project
### Migration checklist (if applicable)
```

## Quality checks

- [ ] Both implementations use idiomatic framework conventions (no workarounds)
- [ ] Trade-offs are honest — not biased toward either framework
- [ ] Streaming and error handling are covered for both
- [ ] Migration checklist is actionable
