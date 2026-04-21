# Playbook: Build an Optimistic Form Flow

A step-by-step guide for building forms and mutations using Server Actions, `useActionState`, and `useOptimistic` — with a complete lifecycle design.

---

## When to use this playbook

- Building any form that submits data (create, update, delete)
- Adding optimistic UI to an existing mutation
- Migrating from `useState + fetch` to modern React 2026 patterns

---

## Phase 1: Mutation scope

**Invoke:** `actions-mutation-designer`

Define:
- What data does the user submit?
- What does success look like in the UI?
- What is the expected success rate? (helps decide on optimistic UI)
- What cache needs to be invalidated?

---

## Phase 2: Action lifecycle design

**Invoke:** `actions-mutation-designer` + `skill-action-mutation-flow-design`

Map the lifecycle:
```
IDLE → PENDING → OPTIMISTIC (if applicable) → SUCCESS | VALIDATION_ERROR | SERVER_ERROR → ROLLBACK (if optimistic)
```

Define:
- Input type (what the form sends)
- Return type (discriminated union with all states)
- Validation strategy (client and/or server)
- Cache invalidation after success

---

## Phase 3: Optimistic UI decision

**Invoke:** `skill-optimistic-ui-strategy`

Apply the four criteria:
- [ ] > 95% expected success rate
- [ ] Rollback is visually clean
- [ ] No immediate need for server-generated IDs
- [ ] Conflict strategy defined

If all pass → use `useOptimistic`
If any fail → pending state only

---

## Phase 4: Server Action implementation

```tsx
// actions.ts
'use server'

import { z } from 'zod'
import { revalidateTag } from 'next/cache'

const CreateItemSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
})

type CreateItemState =
  | { status: 'idle' }
  | { status: 'success'; item: Item }
  | { status: 'validation_error'; errors: Record<string, string> }
  | { status: 'server_error'; message: string }

export async function createItem(
  prevState: CreateItemState,
  formData: FormData
): Promise<CreateItemState> {
  const raw = {
    name: formData.get('name'),
    description: formData.get('description'),
  }

  const result = CreateItemSchema.safeParse(raw)
  if (!result.success) {
    return {
      status: 'validation_error',
      errors: result.error.flatten().fieldErrors as Record<string, string>
    }
  }

  try {
    const item = await db.items.create(result.data)
    revalidateTag('items')
    return { status: 'success', item }
  } catch {
    return { status: 'server_error', message: 'Failed to create item' }
  }
}
```

---

## Phase 5: Client form implementation

```tsx
// CreateItemForm.tsx
'use client'

import { useActionState, useOptimistic } from 'react'
import { createItem } from './actions'

export function CreateItemForm({ items }: { items: Item[] }) {
  const [state, action, isPending] = useActionState(createItem, { status: 'idle' })
  const [optimisticItems, addOptimisticItem] = useOptimistic(
    items,
    (current, newItem: Item) => [...current, newItem]
  )

  return (
    <div>
      <ItemList items={optimisticItems} />

      <form action={async (formData) => {
        // Optimistic update
        addOptimisticItem({
          id: `temp-${crypto.randomUUID()}`,
          name: formData.get('name') as string,
          description: formData.get('description') as string,
        })
        await action(formData)
      }}>
        <input name="name" required disabled={isPending} />
        {state.status === 'validation_error' && (
          <span>{state.errors.name}</span>
        )}

        <input name="description" disabled={isPending} />

        <button type="submit" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create'}
        </button>

        {state.status === 'server_error' && (
          <p>{state.message}</p>
        )}
      </form>
    </div>
  )
}
```

---

## Phase 6: TypeScript hardening

**Invoke:** `typescript-systems-engineer` + `skill-typescript-contract-hardening`

- Ensure action input/output types are shared between server and client
- Ensure Zod schema derives the TypeScript type (not duplicated)
- Ensure `useActionState` is fully typed

---

## Phase 7: Review

**Invoke:** `react-compiler-alignment-specialist`

- No unnecessary `useCallback` on the form submit handler
- No unnecessary `useMemo` on form field state

---

## Checklist

- [ ] Discriminated union return type defined for all action states
- [ ] Zod validation on server (always)
- [ ] Client-side validation for instant feedback (where beneficial)
- [ ] `isPending` disables submit button to prevent duplicate submissions
- [ ] Optimistic UI safety criteria checked
- [ ] Rollback path designed (if optimistic)
- [ ] Cache invalidation after success (`revalidateTag`)
- [ ] Error states visible to the user (never silent)
- [ ] TypeScript types aligned between action and consumer
