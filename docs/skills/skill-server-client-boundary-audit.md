# Skill: Server/Client Boundary Audit

## Purpose

Given a component tree, feature, or file, classify every component and concern by its correct placement in the React server/client model. Identify over-hydration, unsafe prop crossing, and refactor opportunities.

## When to invoke

- Before implementing a new feature
- When reviewing an existing route for hydration cost
- When `'use client'` feels wrong but you're not sure why
- When data fetching is happening in a component that seems too far down the tree

## Execution steps

### 1. List all components in scope
Walk the component tree from the route root. List every component by name.

### 2. Classify each component

For each component, assign one label:

| Label | Criteria |
|---|---|
| `SERVER` | No hooks, no event handlers, no browser APIs — renders on server |
| `CLIENT` | Uses `useState`, `useEffect`, event handlers, browser APIs |
| `SERVER_FUNCTION` | `'use server'` directive — callable as action from client |
| `SHARED_UTIL` | Pure function, no React, usable anywhere |
| `BOUNDARY` | Wraps a client subtree inside a server tree |
| `NEEDS_REVIEW` | Classification unclear — flag for discussion |

### 3. Audit props crossing the boundary

For every `SERVER → CLIENT` prop pass:
- Is the value serializable? (no functions, no class instances, no Dates unless stringified)
- Is more data being passed than the client component needs?
- Could the server component pass a narrower prop instead?

### 4. Identify hydration costs

- Count how many Client Components exist
- Flag large Client subtrees
- Identify components that are `CLIENT` but only have one interactive element

### 5. Identify server-fetching opportunities

- Find Client Components that fetch data via `useEffect` or TanStack Query
- Flag each one: could this fetch move to a Server Component?

### 6. Produce output

```
## Boundary audit: [feature/route]

### Component classification
| Component | Label | Reason |
|---|---|---|

### Props crossing the boundary
| From | To | Prop | Serializable? | Notes |
|---|---|---|---|---|

### Hydration cost estimate
- Total Client Components: N
- Largest client subtree: [description]

### Server-fetching opportunities
### Refactor recommendations (priority ordered)
```

## Quality checks

- [ ] Every component has a label
- [ ] Every cross-boundary prop is assessed for serializability
- [ ] Over-fetching on the client is flagged
- [ ] Recommendations are actionable, not vague
