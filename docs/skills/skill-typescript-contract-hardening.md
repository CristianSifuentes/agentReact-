# Skill: TypeScript Contract Hardening

## Purpose

Improve the TypeScript contract quality between UI, server functions, APIs, and domain logic. Replace weak types (`any`, implicit `{}`, untyped returns) with strong, aligned contracts that catch errors at compile time.

## When to invoke

- A Server Action has an untyped or weakly typed return
- Component props use `any` or untyped object spreads
- Types are defined separately on client and server for the same data shape
- `as` casts are used to silence type errors
- A refactor revealed implicit `any` or broken inference

## Execution steps

### 1. Audit the contract chain

Map the type flow from server to UI:
```
Database/API response → Server Action return type → Component props → UI rendering
```

For each link in the chain:
- Is the type explicit?
- Is it the same type or a derived subset?
- Are there any `any`, `unknown` without narrowing, or implicit `{}`?

### 2. Identify weak type patterns

| Pattern | Problem | Fix |
|---|---|---|
| `function action(): any` | No type safety on result | Define discriminated union return type |
| `props: { [key: string]: any }` | No prop safety | Define explicit interface |
| `as SomeType` | Bypasses type checking | Fix the inference or narrow properly |
| `user!.name` | Hides undefined risk | Fix the type to reflect actual nullability |
| Duplicate types for same shape | Drift between server and client types | Extract shared type |
| `useActionState<any, any>` | Loses all action type safety | Type both state and input |

### 3. Design strong contracts

**Server Action return type:**
```typescript
type ActionResult<T> =
  | { status: 'success'; data: T }
  | { status: 'validation_error'; errors: Record<string, string> }
  | { status: 'server_error'; message: string }
```

**Branded identifiers:**
```typescript
type UserId = string & { _brand: 'UserId' }
type ProductId = string & { _brand: 'ProductId' }
```

**Schema-derived types:**
```typescript
import { z } from 'zod'
const UserSchema = z.object({ id: z.string(), name: z.string() })
type User = z.infer<typeof UserSchema>  // single source of truth
```

### 4. Align shared types

Types used on both server and client should live in a shared location:
- `src/types/` — domain types
- `src/actions/types.ts` — Server Action input/output types
- `src/lib/schemas.ts` — Zod schemas that derive both validation and types

### 5. Produce output

```
## TypeScript contract hardening: [feature or module]

### Contract chain audit
| Link | Current type | Issue | Fix |
|---|---|---|---|

### Weak type inventory
| Location | Pattern | Recommendation |
|---|---|---|

### Recommended type definitions
(ready-to-use TypeScript, complete)

### Branded type candidates
### Schema alignment opportunities
### Unsafe cast removal plan
```

## Quality checks

- [ ] No `any` in Server Action signatures
- [ ] All `useActionState` calls are typed
- [ ] No duplicate type definitions for the same shape across files
- [ ] All `as` casts are justified or removed
- [ ] Shared types live in a shared location
- [ ] Zod schemas and TypeScript types are in sync (prefer schema-derived)
