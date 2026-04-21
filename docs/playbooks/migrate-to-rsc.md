# Playbook: Migrate Client-Fetching to Server Components

A step-by-step guide for moving `useEffect + fetch` data fetching from Client Components to Server Components, reducing client bundle size and improving perceived performance.

---

## When to use this playbook

- A Client Component fetches data via `useEffect` that doesn't require real-time updates
- A component is `'use client'` only because it needs data — not because of interactivity
- Migrating a pages-router or older React app to modern RSC patterns

---

## Phase 1: Identify migration candidates

**Invoke:** `rsc-boundary-engineer` + `skill-server-client-boundary-audit`

For each Client Component that fetches data, ask:
- Does the fetch result change based on user interaction after initial load?
- Does the fetch require browser-only APIs (auth tokens in localStorage, etc.)?
- Does the fetch require client-side state to construct the request?

If all answers are **no** → strong migration candidate.

---

## Phase 2: Before/after pattern

**Before (client-fetching pattern):**
```tsx
'use client'

function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <Spinner />
  return <ul>{products.map(p => <ProductCard key={p.id} product={p} />)}</ul>
}
```

**After (Server Component pattern):**
```tsx
// No 'use client' directive
async function ProductList() {
  const products = await getProducts()  // direct DB/cache access
  return <ul>{products.map(p => <ProductCard key={p.id} product={p} />)}</ul>
}
```

The `loading.tsx` or a `<Suspense>` boundary handles the loading state — not `useState`.

---

## Phase 3: Handle interactivity correctly

After migrating the data-fetching to a Server Component, the Client Component is only needed for interactivity.

**Pattern: Server Component owns data, Client Component owns interaction**

```tsx
// Server Component — fetches data
async function ProductListPage() {
  const products = await getProducts()
  return <ProductListClient initialProducts={products} />
}

// Client Component — only handles interaction
'use client'
function ProductListClient({ initialProducts }: { initialProducts: Product[] }) {
  const [filter, setFilter] = useState('all')
  const filtered = initialProducts.filter(p => filter === 'all' || p.category === filter)

  return (
    <div>
      <FilterBar value={filter} onChange={setFilter} />
      <ul>{filtered.map(p => <ProductCard key={p.id} product={p} />)}</ul>
    </div>
  )
}
```

---

## Phase 4: Caching strategy

**Invoke:** `server-state-cache-strategist`

After migrating to Server Components, decide on caching:

| Need | Approach |
|---|---|
| No caching needed | Plain `async` Server Component with direct fetch |
| Cache with revalidation | `unstable_cache` with `revalidateTag` |
| Cache invalidation after mutation | `revalidateTag('products')` in Server Action |

---

## Phase 5: Handle remaining client state needs

Some state legitimately stays client-side after migration:
- Filters and sort preferences → migrate to URL state
- UI toggles (expanded/collapsed) → keep as `useState` in Client Component
- Real-time data → keep as TanStack Query in Client Component

**Invoke:** `skill-selective-state-placement` to classify remaining state.

---

## Phase 6: Verify boundary correctness

**Invoke:** `skill-server-client-boundary-audit`

After migration, verify:
- [ ] No `useEffect` fetching data that is now server-fetched
- [ ] `'use client'` only on components with genuine client needs
- [ ] Props crossing the boundary are serializable
- [ ] Suspense boundaries cover the async Server Components

---

## Checklist

- [ ] Identified all `useEffect + fetch` patterns in the target
- [ ] Classified each: candidate vs must-stay-client
- [ ] Migrated candidates to `async` Server Components
- [ ] Moved loading state to `<Suspense>` boundaries (removed `useState` loading)
- [ ] Caching strategy defined for server-fetched data
- [ ] Remaining client state classified and placed correctly
- [ ] Boundary audit completed after migration
- [ ] TypeScript types updated (no longer need to handle loading/null states in client)
