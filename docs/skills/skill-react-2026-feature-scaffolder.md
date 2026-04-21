# Skill: React 2026 Feature Scaffolder

## Purpose

Take a feature idea and produce a complete, production-ready blueprint covering server/client split, action design, Suspense boundaries, TypeScript contracts, route placement, and loading/error states. The output should be usable directly to start implementation.

## When to invoke

- Starting a significant new feature from scratch
- A feature request needs to be decomposed before any code is written
- A feature spans multiple layers (route, server, client, mutations, types)
- You want to validate the architecture before committing to implementation

## Execution steps

### 1. Understand the feature

Gather (or assume if not given):
- What does the user do? (core interaction)
- What data is required?
- What mutations exist?
- Which route does it live on?
- What framework is in use (Next.js App Router / React Router 7)?
- Are there real-time or optimistic UX requirements?

### 2. Define the route structure

```
app/
└─ [route segment]/
   ├─ page.tsx          ← Server Component (primary route)
   ├─ loading.tsx       ← Route-level Suspense fallback
   ├─ error.tsx         ← Route-level error boundary
   └─ _components/      ← Feature-local components
      ├─ [Feature].tsx  ← Server Component (data owner)
      ├─ [Feature]Client.tsx  ← Client Component (interactivity)
      └─ [Feature]Actions.ts  ← Server Actions
```

### 3. Server/client split

For each component, assign SERVER or CLIENT and explain why.

### 4. Suspense boundary plan

List every async region, its fallback, and its tier (Immediate / Critical / Deferred).

### 5. Action design

For each mutation, define:
- Input type
- Server Action signature
- `useActionState` model
- Optimistic UI decision
- Validation strategy

### 6. TypeScript contracts

Define all types:
- Data shapes (from server)
- Action input/output types (discriminated union)
- Component props
- Shared types location

### 7. Produce output

```
## Feature blueprint: [feature name]

### Summary
(2-3 sentence description of what this implements)

### Route structure
(file tree)

### Component list
| Component | Server/Client | Responsibility |
|---|---|---|

### Server/client boundary map
(which components cross the boundary and what crosses with them)

### Suspense boundary plan
| Region | Tier | Fallback |
|---|---|---|

### Actions
| Action | Input type | Returns | Optimistic? |
|---|---|---|---|

### TypeScript contracts
(key type definitions, ready to use)

### Loading states
(one line per loading region)

### Error states
(one line per error boundary)

### Implementation order
1. [first step]
2. [second step]
...

### Open questions
```

## Quality checks

- [ ] Every component has a justified Server/Client label
- [ ] Every async region has a Suspense boundary and fallback
- [ ] Every mutation has a complete lifecycle design
- [ ] TypeScript types are explicit and non-overlapping
- [ ] Implementation order starts with types and server layer, then UI
- [ ] Loading and error states are explicit, not assumed
