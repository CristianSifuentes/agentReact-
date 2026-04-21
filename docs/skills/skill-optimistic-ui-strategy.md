# Skill: Optimistic UI Strategy

## Purpose

Assess whether optimistic UI is appropriate for a given mutation, design the rollback strategy, and produce a complete implementation plan using `useOptimistic`.

## When to invoke

- Before adding optimistic UI to any mutation
- When an existing optimistic update causes visual bugs on failure
- When a mutation feels slow and optimistic UI might improve perceived speed

## Execution steps

### 1. Assess optimistic UI safety

Answer all four questions:

| Question | Threshold | If not met |
|---|---|---|
| Success rate | > 95% expected success | Use pending state only |
| Rollback cleanliness | Revert is visually clean | Design a smoother rollback UI |
| Server ID dependency | Result does not need server-generated ID immediately | Use temporary IDs or delay optimism |
| Conflict strategy | Concurrent updates handled | Define merge/last-write-wins strategy |

### 2. Choose optimistic model

**Model A: Full optimistic (instant visual update)**
- Use when: creating or updating with local data only
- Example: toggling a like, adding to cart
- Risk: low (local data, clean rollback)

**Model B: Partial optimistic (update some parts, wait for others)**
- Use when: creation needs server-generated ID for deeper features
- Example: adding a comment — show it instantly, get real ID from server
- Risk: medium (temporary ID management)

**Model C: Pending only (no optimistic)**
- Use when: success rate is lower, rollback would be confusing
- Example: payment submission, destructive delete
- Risk: accepted slower UX in exchange for accuracy

### 3. Design temporary ID strategy (for creation)

If creating a new item:
- Generate a temporary client-side ID: `crypto.randomUUID()` or `'temp-' + Date.now()`
- Use the temporary ID for rendering only
- Replace with server ID on success
- Remove the item on failure

```typescript
const tempId = `temp-${crypto.randomUUID()}`
```

### 4. Design rollback

```typescript
useOptimistic(state, (currentState, optimisticValue) => {
  // apply optimistic update
  return updatedState
})

// On failure: state reverts automatically when the action settles
// Ensure the user understands what happened — show an error message
```

Rollback checklist:
- [ ] State reverts to previous value on failure
- [ ] Error message is shown after rollback (not silent failure)
- [ ] No orphaned UI artifacts after rollback

### 5. Handle concurrent updates

If multiple optimistic updates can occur simultaneously:
- Last write wins: simple, good for toggles
- Merge: complex, good for lists or counters
- Queue: sequential processing, good for ordered operations

### 6. Produce output

```
## Optimistic UI strategy: [action name]

### Safety assessment
| Criterion | Passes? | Notes |
|---|---|---|

### Chosen model (A / B / C)
### Temporary ID strategy (if applicable)
### useOptimistic implementation sketch
### Rollback behavior
### Concurrent update handling
### Error message on rollback
```

## Quality checks

- [ ] Optimistic update only applied when all 4 safety criteria pass
- [ ] Rollback is never silent
- [ ] Temporary IDs are replaced with real IDs on success
- [ ] Concurrent updates have a defined resolution strategy
- [ ] Pending state still shown during optimistic flight (user knows action is in progress)
