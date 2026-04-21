# Performance Audit: [Route or Feature Name]

## Audit metadata
- **Route:** `[/path]`
- **Date:** [YYYY-MM-DD]
- **Auditor:** [agent or person]
- **Scope:** Perceived performance / Metrics / Bundle / Hydration

---

## User experience timeline

Describe what the user sees at each moment:

```
T=0ms:    Navigation starts
T=Xms:   First byte received (TTFB)
T=Yms:   First visible content (FCP) — [describe what]
T=Zms:   Critical content visible (LCP) — [describe what]
T=Wms:   Page interactive (hydration complete)
T=Vms:   All secondary content visible
```

---

## Perceived performance issues

| # | Issue | Type | User impact | Root cause |
|---|---|---|---|---|
| 1 | [description] | [blank screen / layout shift / lag / wrong order] | High/Medium/Low | [root cause] |

---

## Metrics snapshot (if available)

| Metric | Current | Target | Status |
|---|---|---|---|
| FCP | | < 1.8s | ✓ / ✗ |
| LCP | | < 2.5s | ✓ / ✗ |
| INP | | < 200ms | ✓ / ✗ |
| CLS | | < 0.1 | ✓ / ✗ |
| TTFB | | < 800ms | ✓ / ✗ |

---

## Streaming assessment

| Region | Current behavior | Correct tier | Issue |
|---|---|---|---|
| [region] | [blocks / streams / lazy] | Immediate/Critical/Deferred | [if wrong] |

---

## Skeleton quality

| Skeleton | Matches content shape? | CLS risk | Fix needed |
|---|---|---|---|
| `<[Name]Skeleton />` | Yes / No | Yes / No | [fix if needed] |

---

## Hydration cost

| Client Component | Size estimate | Hydrates on | Avoidable? |
|---|---|---|---|
| [component] | Small/Medium/Large | Page load / User interaction | Yes / No |

---

## Recommended fixes (priority order)

| Priority | Fix | Expected impact | Effort |
|---|---|---|---|
| 1 | [fix] | [impact on user experience] | Small/Medium/Large |
| 2 | | | |

---

## Waterfall risks

| Location | Type | Status |
|---|---|---|
| [component or data fetch] | Suspense waterfall / Data fetch waterfall | Found / Clear |

---

## Post-fix verification checklist

- [ ] Shell renders at T=0 (no data dependency)
- [ ] Critical content visible before 300ms
- [ ] No layout shift on async content resolve (CLS < 0.1)
- [ ] All deferred fetches start in parallel
- [ ] Interactions respond within 200ms after hydration
- [ ] No unnecessary hydration of non-interactive components
