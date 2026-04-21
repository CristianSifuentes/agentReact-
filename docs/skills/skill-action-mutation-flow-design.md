# Skill: Action Mutation Flow Design

## Purpose

Model the complete lifecycle of a mutation — from user input through server response — including pending state, optimistic update, success, validation errors, server errors, and rollback. Produce an implementation-ready design.

## When to invoke

- Designing any form submission, button action, or data mutation
- Adding optimistic UI to an existing mutation
- An existing mutation has no pending state or error handling
- Migrating from `useState + fetch` to Server Actions + `useActionState`

## Execution steps

### 1. Define the mutation

Answer:
- What data does the user submit?
- What Server Action or API endpoint handles it?
- What changes in the UI after success?
- What invalidation is required after success?

### 2. Map the full lifecycle

| State | Description | UI behavior |
|---|---|---|
| `IDLE` | No action in flight | Form is interactive |
| `PENDING` | Action submitted, awaiting response | Submit button disabled, loading indicator |
| `OPTIMISTIC` | UI updated before server confirms | Immediate visual update |
| `SUCCESS` | Server confirmed success | UI reflects server response, cache invalidated |
| `VALIDATION_ERROR` | Input failed validation | Field-level errors, form re-enabled |
| `SERVER_ERROR` | Server returned error | Error message, form re-enabled, no rollback |
| `ROLLBACK` | Optimistic update reversed | UI returns to previous state |

### 3. Design the useActionState model

```typescript
type ActionState =
  | { status: 'idle' }
  | { status: 'success'; data: T }
  | { status: 'validation_error'; errors: Record<string, string> }
  | { status: 'server_error'; message: string }

const [state, action, isPending] = useActionState(serverAction, { status: 'idle' })
```

### 4. Decide on optimistic UI

Apply optimistic UI only when:
- [ ] High confidence this action will succeed (> 95%)
- [ ] Rollback is visually clean (no jarring layout shift)
- [ ] No server-generated data is needed immediately in the UI
- [ ] There is a clear conflict resolution strategy

If all four are true: use `useOptimistic`.
If any are false: use pending state only.

### 5. Design validation strategy

| Validation type | When | Why |
|---|---|---|
| **Client-side** | On blur or submit | Instant feedback, no network needed |
| **Server-side** | Always on submission | Authoritative, handles race conditions |
| **Both** | When client validation improves UX | Client for speed, server as truth |

### 6. Produce output

```
## Mutation design: [action name]

### Input schema
type Input = { ... }

### Server Action signature
async function actionName(prevState: ActionState, formData: FormData): Promise<ActionState>

### useActionState setup
### Optimistic UI decision (Y/N + reasoning)
### Optimistic rollback strategy (if applicable)
### Validation schema (Zod / Valibot)
### Pending UI spec
### Success behavior + cache invalidation
### Error handling per error type
### TypeScript types (complete)
```

## Quality checks

- [ ] All 7 lifecycle states are accounted for
- [ ] Pending state prevents duplicate submissions
- [ ] Validation errors surface at field level
- [ ] Optimistic UI has a rollback path
- [ ] Success triggers correct cache invalidation
- [ ] Server Action return type is a discriminated union
