# State Strategy

Canonical guide for classifying and placing state in React 2026 applications.

---

## State classification

Before writing any state, classify it:

| Type | Owner | Tool | When |
|---|---|---|---|
| `LOCAL_UI` | Component | `useState` | Ephemeral interaction (open/close, hover, focus) |
| `DERIVED` | Nowhere (computed) | Inline or `useMemo` | Value computable from other state |
| `SERVER` | Server | Server Component fetch | Data fetched at route load time |
| `CACHED_SERVER` | Server with TTL | `unstable_cache`, `revalidateTag` | Server data with revalidation strategy |
| `CLIENT_CACHED` | Client | TanStack Query | Client-side refresh, background sync |
| `OPTIMISTIC` | Transient | `useOptimistic` | Speculative UI during mutation |
| `URL` | URL | `useSearchParams`, router | Bookmarkable, shareable state |
| `FORM` | Form submission | `useActionState`, FormData | Controlled form data and submission lifecycle |
| `GLOBAL_CLIENT` | App-level client | React Context, Zustand | Truly shared client state (auth, theme, cart) |

---

## Decision rules

### Is this data from the server?
→ Fetch it in a Server Component. Don't store it in `useState`.

### Does this state need to be in the URL?
Ask: "If the user refreshes the page or shares the URL, should this state be preserved?"
- Yes → URL state (`useSearchParams`)
- No → Local state

### Is this state derived from other state?
Ask: "Can this value be computed from props or other state without storing it?"
- Yes → Compute it inline (no state needed)
- If expensive → `useMemo` with a justified cost

### Is this state shared across many components?
Ask: "Do multiple components far apart in the tree need to read or write this state?"
- Yes, and it's server data → Server Component + server cache
- Yes, and it's truly client state → Context or Zustand (minimal use)
- No → Keep it local

### Is this state during a mutation?
- Pending state → `useActionState` (isPending)
- Optimistic visual update → `useOptimistic`
- Form field values → uncontrolled form + `FormData`, or `useActionState`

---

## Anti-patterns to avoid

### Storing server data in useState
```tsx
// ❌ Wrong: fetching server data client-side
'use client'
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  useEffect(() => {
    fetch(`/api/users/${userId}`).then(r => r.json()).then(setUser)
  }, [userId])
  return user ? <div>{user.name}</div> : <Spinner />
}

// ✅ Correct: server-fetched
async function UserProfile({ userId }) {
  const user = await getUser(userId)
  return <div>{user.name}</div>
}
```

### Storing derived state
```tsx
// ❌ Wrong: storing a computed value
const [fullName, setFullName] = useState('')
useEffect(() => {
  setFullName(`${firstName} ${lastName}`)
}, [firstName, lastName])

// ✅ Correct: compute inline
const fullName = `${firstName} ${lastName}`
```

### Missing URL state for filters
```tsx
// ❌ Wrong: filter in useState — not bookmarkable
const [filter, setFilter] = useState('all')

// ✅ Correct: filter in URL
const [searchParams, setSearchParams] = useSearchParams()
const filter = searchParams.get('filter') ?? 'all'
```

### Global state for local interaction
```tsx
// ❌ Wrong: modal open state in global store
store.setModalOpen(true)

// ✅ Correct: modal open state local to the feature
const [isOpen, setIsOpen] = useState(false)
```

---

## State ownership diagram (example)

```
Route: /products/[id]
│
├─ SERVER: product data (Server Component fetch)
├─ SERVER: related products (parallel Server Component fetch, deferred)
├─ URL: selected tab (?tab=reviews)
├─ URL: image index (?img=0)
├─ LOCAL_UI: hover state on images (useState in ImageGallery client)
├─ FORM: add to cart form (useActionState)
├─ OPTIMISTIC: cart count (useOptimistic in CartButton client)
└─ GLOBAL_CLIENT: cart totals (Context, updated after mutation)
```

---

## Framework cache vs TanStack Query

### Use framework-native cache when:
- Data is fetched in Server Components
- Revalidation is triggered by server mutations (`revalidateTag`)
- No real-time background refresh is needed

### Use TanStack Query when:
- Data must refresh on the client without navigation
- Multiple client components share the same data
- The feature has polling or real-time requirements
- Optimistic updates are complex enough to need cache manipulation
