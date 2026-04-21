# Skill: Selective State Placement

## Purpose

Classify every piece of state in a feature by its correct type and owner, then recommend the right storage mechanism. Prevent client state from holding data that belongs on the server, and prevent server state from being duplicated in client stores.

## When to invoke

- Designing a new feature's data architecture
- State is "leaking" between server and client (duplication, sync issues)
- A feature has too many `useState` calls for data that comes from the server
- Deciding between `useState`, `useReducer`, TanStack Query, URL state, or server caching

## State classification system

| Type | Description | Storage |
|---|---|---|
| `LOCAL_UI` | Component-scoped, ephemeral, no persistence needed | `useState`, `useReducer` |
| `DERIVED` | Computed from other state/props, no storage needed | Inline calculation or `useMemo` (if expensive) |
| `SERVER` | Owned by the server, fetched and rendered server-side | Server Component fetch, `cache()` |
| `CACHED_SERVER` | Server data with client-accessible caching and revalidation | `unstable_cache`, `revalidateTag`, TanStack Query |
| `OPTIMISTIC` | Speculative UI state ahead of server confirmation | `useOptimistic` |
| `URL` | State that should be shareable, bookmarkable, or navigable | `useSearchParams`, `router.push` |
| `FORM` | Controlled form input and submission lifecycle | `useActionState`, uncontrolled + `FormData` |
| `GLOBAL_CLIENT` | Shared across many client components, truly client-owned | React Context, Zustand (if complex) |

## Execution steps

### 1. List all state in the feature

Walk through the component tree. For each piece of state:
- Name it
- Describe what it represents
- Identify where it originates (user input, server, URL, derived)
- Identify where it is consumed (which components read it)

### 2. Classify each state

Apply the classification table above. Ask:
- Does this need to persist beyond a single session? → URL or server
- Does this come from the server? → Server or Cached Server
- Does this represent user input? → Form state
- Does this exist only during a mutation? → Optimistic
- Does this need to be shared across many client components? → Global Client
- Is this a simple toggle or ephemeral interaction? → Local UI
- Can this be computed? → Derived

### 3. Flag misplacements

Common misplacements:
- Server data stored in `useState` with a `useEffect` fetch (should be server-fetched)
- UI toggle stored in a global store (should be local)
- Filter/sort preferences not in the URL (should be URL state)
- Loading state managed manually when `useActionState.isPending` exists

### 4. Produce output

```
## State placement audit: [feature]

### State inventory
| State | Current type | Correct type | Current storage | Recommended storage |
|---|---|---|---|---|

### Misplacements
| State | Problem | Fix |
|---|---|---|

### State ownership map (diagram)
### Migration steps (if refactoring)
```

## Quality checks

- [ ] No server data stored in client `useState`
- [ ] No filter/sort/tab state missing from URL when it should be bookmarkable
- [ ] No global state for data that is component-local
- [ ] Derived state is computed inline, not stored
- [ ] Optimistic state uses `useOptimistic`, not manual rollback logic
