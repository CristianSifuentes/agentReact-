# Skill: Architecture Decision Record Writer

## Purpose

Write concise, durable Architecture Decision Records (ADRs) for significant technical decisions. Each ADR captures what was decided, why, what was rejected, and what the consequences are — so future developers (and future AI agents) understand the context behind the code.

## When to invoke

- A significant architectural choice is made (framework, state strategy, caching approach)
- A pattern is established that others should follow
- A trade-off was made that future developers might question
- A decision was made that is non-obvious from the code

## ADR template

```markdown
# ADR [number]: [title]

## Status
[Proposed | Accepted | Deprecated | Superseded by ADR-XXX]

## Date
[YYYY-MM-DD]

## Context
[What situation prompted this decision? What are the forces at play?
What constraints exist? Keep this to 2-4 sentences.]

## Decision
[What was decided? State it clearly and directly. One clear statement.]

## Reasoning
[Why was this the right choice given the context? What made it better than
the alternatives? Be specific.]

## Alternatives considered
| Alternative | Why rejected |
|---|---|
| [Option A] | [Reason] |
| [Option B] | [Reason] |

## Consequences
### Positive
- [benefit]

### Negative / trade-offs
- [cost or limitation]

### Neutral
- [side effect that is neither good nor bad]

## Related decisions
- [ADR-XXX: related decision]
```

## Common ADR topics for React apps

- Next.js App Router vs React Router 7
- Server Actions vs REST API endpoints for mutations
- TanStack Query vs framework-native caching
- Form strategy (progressive enhancement vs controlled)
- State management approach (Context vs Zustand vs server state only)
- TypeScript strictness level and type strategy
- Component library choice
- Error monitoring approach
- Testing strategy (unit vs integration vs E2E ratio)
- Monorepo vs polyrepo for shared packages

## Execution steps

1. Identify the decision being documented
2. Write the Context (forces, constraints, why this decision was necessary)
3. State the Decision clearly
4. Write the Reasoning (not just what — why this over alternatives)
5. List alternatives and why they were rejected
6. List consequences honestly (positive, negative, neutral)
7. Number the ADR and add to `docs/architecture/` or `docs/adrs/`

## ADR quality criteria

- [ ] The decision statement is one clear sentence
- [ ] Context explains the forces — not just background facts
- [ ] At least two alternatives are listed with rejection reasons
- [ ] Consequences include at least one trade-off or cost
- [ ] The ADR would help a new team member understand the choice without asking
- [ ] No implementation details — decisions only
