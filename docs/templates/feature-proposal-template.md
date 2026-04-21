# Feature Proposal: [Feature Name]

## Summary
[2-3 sentences describing what this feature does and why it is valuable.]

## User story
As a [user type], I want to [action], so that [outcome].

## Scope

### In scope
- [thing 1]
- [thing 2]

### Out of scope
- [thing 1]

---

## Architecture

### Route placement
```
app/
└─ [route path here]
```

### Component list
| Component | Server/Client | Responsibility |
|---|---|---|
| | | |

### Server/client boundary map
[Describe where the boundary sits and what crosses it]

---

## Data

### Data requirements
| Data | Source | Latency | Streaming tier |
|---|---|---|---|
| | | | |

### State ownership
| State | Type | Storage |
|---|---|---|
| | | |

### Mutations
| Action | Input | Side effects |
|---|---|---|
| | | |

---

## Loading & error strategy

### Suspense boundaries
| Region | Fallback | Tier |
|---|---|---|
| | | |

### Error boundaries
| Region | Error UI | Recovery |
|---|---|---|
| | | |

---

## TypeScript contracts

```typescript
// Key types (fill in)
type [FeatureName]Data = {}
type [FeatureName]ActionState = 
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string }
```

---

## Implementation order
1. Types and schemas
2. Server Actions
3. Server Components (data layer)
4. Client Components (interaction layer)
5. Suspense + Error boundaries
6. Review

## Open questions
- [question 1]
