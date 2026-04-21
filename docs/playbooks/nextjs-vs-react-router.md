# Playbook: Next.js App Router vs React Router 7

A decision framework and side-by-side implementation guide for choosing and using either framework.

---

## When to use this playbook

- Starting a new React project and choosing a framework
- Evaluating whether to migrate from one framework to the other
- Building a feature and wanting to see both approaches before committing

---

## Decision criteria

Answer each question and tally:

| Question | Points to Next.js | Points to RR7 |
|---|---|---|
| Do you need deep Server Component integration? | ✓ | |
| Is Vercel your primary deployment platform? | ✓ | |
| Is platform-agnostic deployment required? | | ✓ |
| Do you want strongly typed `loader`/`action`? | | ✓ |
| Is bundle size a top priority? | | ✓ |
| Does your team have Remix experience? | | ✓ |
| Do you need edge runtime on Vercel? | ✓ | |
| Is SEO/metadata management critical? | ✓ | |
| Do you want a smaller framework runtime? | | ✓ |
| Are Server Components a core feature requirement? | ✓ | |

**Tiebreaker:** In 2026, Next.js App Router has a larger ecosystem and more mature RSC tooling. Choose RR7 when deployment flexibility or team familiarity are decisive.

---

## Side-by-side: Product detail page

### Feature requirements
- Load product data from a database
- Show reviews (streamed, deferred)
- Mutation: add to cart (Server Action / route action)
- Error handling for missing product
- TypeScript throughout

---

### Next.js App Router

**File structure:**
```
app/
├─ products/
│  └─ [id]/
│     ├─ page.tsx         ← Server Component
│     ├─ loading.tsx      ← Suspense fallback
│     ├─ error.tsx        ← Error boundary
│     └─ _components/
│        ├─ Reviews.tsx   ← Server Component (deferred)
│        └─ AddToCart.tsx ← Client Component
└─ actions/
   └─ cart.ts             ← Server Actions
```

**page.tsx:**
```tsx
import { notFound } from 'next/navigation'

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)
  if (!product) notFound()

  const reviewsPromise = getReviews(params.id)

  return (
    <main>
      <ProductHero product={product} />
      <AddToCart productId={product.id} />
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews promise={reviewsPromise} />
      </Suspense>
    </main>
  )
}
```

**cart.ts (Server Action):**
```tsx
'use server'
export async function addToCart(prevState, formData) {
  await db.cart.add({ productId: formData.get('productId') })
  revalidateTag('cart')
  return { status: 'success' }
}
```

---

### React Router 7

**File structure:**
```
app/
└─ routes/
   └─ products.$id.tsx    ← Route module (loader + action + component)
      ├─ export loader
      ├─ export action
      ├─ export default
      └─ export ErrorBoundary
```

**products.$id.tsx:**
```tsx
import { data, redirect } from 'react-router'
import type { Route } from './+types/products.$id'

export async function loader({ params }: Route.LoaderArgs) {
  const product = await getProduct(params.id)
  if (!product) throw data('Not found', { status: 404 })
  return {
    product,
    reviews: getReviews(params.id),  // deferred
  }
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  await db.cart.add({ productId: formData.get('productId') })
  return redirect('/cart')
}

export default function ProductPage({ loaderData }: Route.ComponentProps) {
  const { product, reviews } = loaderData
  return (
    <main>
      <ProductHero product={product} />
      <AddToCartForm />
      <Suspense fallback={<ReviewsSkeleton />}>
        <Await resolve={reviews}>
          {(data) => <Reviews reviews={data} />}
        </Await>
      </Suspense>
    </main>
  )
}

export function ErrorBoundary() {
  return <ProductError />
}
```

---

## Key differences

| Concern | Next.js App Router | React Router 7 |
|---|---|---|
| Data loading | `async` Server Component | `loader` function |
| Mutations | `'use server'` + `useActionState` | `action` function + `<Form>` |
| Streaming | `<Suspense>` on Server Component | `defer()` + `<Await>` |
| Error handling | `error.tsx` | `ErrorBoundary` in route module |
| Type safety | Manual typing | `Route.LoaderArgs`, `Route.ComponentProps` |
| Server Components | Full support | Experimental |
| Bundle | Larger framework | Smaller runtime |

---

## Migration checklist (Next.js → React Router 7)

- [ ] Convert `async` Server Components to `loader` functions
- [ ] Convert Server Actions to `action` functions
- [ ] Replace `loading.tsx` with `HydrateFallback` + `<Suspense>`
- [ ] Replace `error.tsx` with `ErrorBoundary` export in route module
- [ ] Replace `useActionState` with `useFetcher` or `<Form>` + `useNavigation`
- [ ] Replace `revalidateTag` with `redirect` or targeted refetch
- [ ] Add `Route.LoaderArgs` / `Route.ComponentProps` types
