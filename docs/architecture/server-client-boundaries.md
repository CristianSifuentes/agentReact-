# Server/Client Boundaries

Reference guide for placing components correctly in the React server/client model.

---

## The boundary model

```
Server                          │  Client
────────────────────────────────┼──────────────────────────────────
Server Components               │  Client Components
Server Functions ('use server') │  Browser APIs
Direct DB / cache access        │  useState, useEffect, event handlers
Secrets, auth tokens            │  useOptimistic, useActionState
No JS sent to browser           │  Hydrated in browser
```

The boundary is a one-way membrane: server components can import and render client components, but client components cannot import server components (only pass them as `children` or props).

---

## Decision flowchart

```
Does it need interactivity (event handlers, controlled input)?
├─ YES → Client Component
└─ NO
   Does it need browser APIs (localStorage, window, document)?
   ├─ YES → Client Component
   └─ NO
      Does it need React state (useState, useReducer)?
      ├─ YES → Client Component
      └─ NO
         Does it need React effects (useEffect, useLayoutEffect)?
         ├─ YES → Client Component
         └─ NO → Server Component ✓
```

---

## Boundary placement patterns

### Pattern 1: Push 'use client' as far down the tree as possible

```tsx
// ❌ Entire section goes client because of one interactive element
'use client'
export function ProductSection({ product }) {
  return (
    <div>
      <ProductImage src={product.image} />    {/* no interactivity needed */}
      <ProductTitle title={product.title} />  {/* no interactivity needed */}
      <AddToCartButton productId={product.id} /> {/* needs client */}
    </div>
  )
}

// ✅ Only the interactive leaf is client
export function ProductSection({ product }) {
  return (
    <div>
      <ProductImage src={product.image} />
      <ProductTitle title={product.title} />
      <AddToCartButton productId={product.id} /> {/* 'use client' only here */}
    </div>
  )
}
```

### Pattern 2: Server Component passes data, Client Component handles interaction

```tsx
// Server Component (fetches data, no client directive)
export async function ProductDetail({ id }: { id: string }) {
  const product = await getProduct(id)
  return <AddToCartForm product={product} /> // client component below
}

// Client Component (only interactivity)
'use client'
export function AddToCartForm({ product }: { product: Product }) {
  const [state, action] = useActionState(addToCartAction, { status: 'idle' })
  // ...
}
```

### Pattern 3: Children pattern (pass server tree through client boundary)

```tsx
// Client Component that accepts server-rendered children
'use client'
export function AnimatedPanel({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={open ? 'open' : 'closed'}>
      {children} {/* server-rendered, not re-rendered by this client component */}
    </div>
  )
}

// Server Component using the client wrapper
export async function ServerPage() {
  const data = await fetchData()
  return (
    <AnimatedPanel>
      <ServerDataDisplay data={data} /> {/* stays server-rendered */}
    </AnimatedPanel>
  )
}
```

---

## Props crossing the boundary

Only serializable values can cross the server → client boundary:

| Allowed | Not allowed |
|---|---|
| `string`, `number`, `boolean` | Functions (not callbacks) |
| Plain objects (`{}`) | Class instances |
| Arrays of serializable values | `Date` (use `.toISOString()`) |
| `null`, `undefined` | `Map`, `Set` (use arrays/objects) |
| `BigInt` | Symbols |

---

## Common boundary violations

| Violation | Problem | Fix |
|---|---|---|
| Passing a function as prop across boundary | Not serializable | Move the function into the Client Component |
| Importing a Client Component in another Client Component unnecessarily | Unnecessary client code | Check if the inner component could be server-side |
| `'use client'` on a shared layout | Forces entire subtree client-side | Move to a leaf component |
| `useEffect + fetch` in a Client Component for server data | Data that should be server-fetched | Move to a Server Component |
| Context provider wrapping the entire app | Can force everything client | Scope context to the feature that needs it |

---

## Server Functions

Server Functions (`'use server'`) are callable from Client Components via form `action` or direct invocation. They run on the server.

```tsx
'use server'

export async function addToCart(prevState: CartState, formData: FormData): Promise<CartState> {
  const productId = formData.get('productId') as string
  await db.cart.add({ productId, userId: await getSession() })
  revalidateTag('cart')
  return { status: 'success' }
}
```

Rules for Server Functions:
- Must return serializable values
- Can access server resources (DB, session, secrets)
- Should validate all input (FormData is untyped)
- Should return a typed discriminated union, not raw data
