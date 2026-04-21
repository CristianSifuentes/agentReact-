# Framework Decisions

Guidance for choosing and implementing with Next.js App Router and React Router 7.

---

## Framework comparison

| Concern | Next.js App Router | React Router 7 |
|---|---|---|
| Server Components | Native, first-class | Experimental / opt-in |
| Streaming | Native via Suspense | `defer()` + `<Await>` |
| Server mutations | Server Actions (`'use server'`) | `action` in route module |
| Server data loading | `async` Server Components | `loader` in route module |
| Loading UI | `loading.tsx` | `HydrateFallback` in route module |
| Error UI | `error.tsx` | `ErrorBoundary` in route module |
| Layouts | Nested `layout.tsx` | Nested routes with `<Outlet>` |
| Route typing | Limited built-in | Strong with `Route.LoaderArgs` |
| Deployment | Vercel-optimized | Platform-agnostic |
| Runtime | Node.js / Edge | Node.js / Edge |
| Bundle | Framework overhead | Smaller runtime |
| Community | Largest React ecosystem | Growing, Remix heritage |

---

## When to choose Next.js App Router

- Project leans into Server Components heavily
- Streaming and server-first architecture are core requirements
- Team is Vercel-deployed or edge-optimized
- SEO and metadata management are important
- Project benefits from Next.js ecosystem (image optimization, font optimization)

---

## When to choose React Router 7

- Strong preference for explicit, typed loaders and actions
- Platform-agnostic deployment is required
- Team comes from Remix and values the file-based loader/action pattern
- Project does not require deep Server Component integration
- Bundle size is a priority concern

---

## Next.js App Router conventions

### Route structure
```
app/
├─ layout.tsx              ← root layout (always rendered)
├─ page.tsx                ← index route
├─ loading.tsx             ← route-level Suspense fallback
├─ error.tsx               ← route-level error boundary
├─ not-found.tsx           ← 404 handler
└─ [segment]/
   ├─ layout.tsx           ← segment layout
   ├─ page.tsx             ← segment route
   └─ _components/        ← feature-local components (not routes)
```

### Data loading
```tsx
// Server Component — fetch directly
export default async function Page({ params }) {
  const data = await getData(params.id)
  return <Component data={data} />
}
```

### Server Actions
```tsx
// actions.ts
'use server'
export async function updateItem(prevState, formData) {
  // validate, mutate, revalidate
  revalidateTag('items')
  return { status: 'success' }
}
```

### Parallel data fetching
```tsx
export default async function Page({ params }) {
  // both start in parallel
  const [product, reviews] = await Promise.all([
    getProduct(params.id),
    getReviews(params.id)
  ])
  return <ProductView product={product} reviews={reviews} />
}
```

---

## React Router 7 conventions

### Route structure
```
app/
├─ root.tsx                ← root layout with <Outlet>
└─ routes/
   ├─ _index.tsx           ← index route
   └─ products.$id.tsx     ← product route
      ├─ export loader     ← server data loading
      ├─ export action     ← server mutation
      ├─ export default    ← component
      └─ export ErrorBoundary
```

### Data loading
```tsx
// products.$id.tsx
export async function loader({ params }: Route.LoaderArgs) {
  const product = await getProduct(params.id)
  return { product }
}

export default function ProductPage({ loaderData }: Route.ComponentProps) {
  const { product } = loaderData
  return <ProductView product={product} />
}
```

### Mutations
```tsx
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  await updateProduct(formData)
  return redirect('/products')
}
```

### Streaming (deferred data)
```tsx
export async function loader({ params }: Route.LoaderArgs) {
  return {
    product: await getProduct(params.id),        // critical
    reviews: getReviews(params.id),               // deferred promise
  }
}

export default function ProductPage({ loaderData }) {
  return (
    <>
      <ProductHero product={loaderData.product} />
      <Suspense fallback={<ReviewsSkeleton />}>
        <Await resolve={loaderData.reviews}>
          {(reviews) => <Reviews reviews={reviews} />}
        </Await>
      </Suspense>
    </>
  )
}
```

---

## Decision record

See `docs/adrs/` for ADRs documenting specific framework choices for this project.
