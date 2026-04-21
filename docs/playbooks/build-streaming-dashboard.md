# Playbook: Build a Streaming Dashboard

A step-by-step operational guide for building a dashboard route that loads progressively, streams independent sections, and handles failure gracefully.

---

## When to use this playbook

- Building any dashboard, analytics, or multi-section data page
- A page has 3+ independent data sources that should load in parallel
- Users need to see useful content immediately while slower sections load

---

## Phase 1: Architecture decision

**Invoke:** `react-chief-architect`

Decisions to make:
- Which sections are independent? (can load and fail independently)
- Which sections are critical? (user cannot do their job without them)
- Which sections are optional? (enhance the experience but aren't blocking)
- What is the data latency for each section? (fast / medium / slow)

**Output:** Section map with independence and criticality ratings.

---

## Phase 2: Streaming plan

**Invoke:** `streaming-ux-engineer` + `skill-streaming-route-design`

For each section, assign a streaming tier:

| Tier | Target | What belongs here |
|---|---|---|
| Immediate | 0ms | Page chrome, nav, skeleton containers |
| Critical | < 300ms | Primary KPI / hero stat |
| Deferred | 300ms–1s | Secondary stats, charts |
| Lazy | User interaction | Drill-down panels, modals |

Define what the user sees at each moment.

**Output:** Streaming map with reveal order.

---

## Phase 3: Suspense and error boundaries

**Invoke:** `suspense-recovery-architect` + `skill-suspense-boundary-planner` + `skill-error-boundary-containment-plan`

Rules:
- Every deferred section gets its own `<Suspense>` + `<ErrorBoundary>`
- All deferred data fetches start in parallel (no sequential `await`)
- Each skeleton matches the real section dimensions
- Each error state has a retry button

**Output:** Boundary tree with fallback specs.

---

## Phase 4: Data fetching implementation

**Invoke:** `server-state-cache-strategist` + `skill-selective-state-placement`

Pattern for parallel deferred fetching in Next.js App Router:

```tsx
// page.tsx
export default async function DashboardPage() {
  // Start all fetches in parallel — do NOT await here
  const kpiPromise = getKpiData()
  const chartPromise = getChartData()
  const feedPromise = getActivityFeed()

  // Await only critical data before rendering
  const kpi = await kpiPromise

  return (
    <DashboardShell>
      <KpiSection data={kpi} />  {/* renders immediately */}

      <ErrorBoundary fallback={<ChartError />}>
        <Suspense fallback={<ChartSkeleton />}>
          <ChartSection promise={chartPromise} />  {/* streams in */}
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary fallback={<FeedError />}>
        <Suspense fallback={<FeedSkeleton />}>
          <ActivityFeed promise={feedPromise} />  {/* streams in */}
        </Suspense>
      </ErrorBoundary>
    </DashboardShell>
  )
}
```

---

## Phase 5: TypeScript contracts

**Invoke:** `typescript-systems-engineer` + `skill-typescript-contract-hardening`

- Define types for each data section
- Ensure async Server Component props are typed
- Define error boundary fallback props

---

## Phase 6: Perceived performance review

**Invoke:** `performance-perception-analyst` + `skill-perceived-performance-audit`

Verify:
- [ ] Shell renders at T=0 with no data dependency
- [ ] Critical section visible before 300ms
- [ ] All skeletons match real content dimensions (no CLS)
- [ ] Independent sections load in parallel (no waterfall)
- [ ] Each failed section shows a useful error state

---

## Checklist

- [ ] Section independence mapped
- [ ] Streaming tiers assigned
- [ ] All data fetches start in parallel
- [ ] Every async section has `<Suspense>` + `<ErrorBoundary>`
- [ ] Every fallback matches content dimensions
- [ ] TypeScript types defined for all sections
- [ ] Perceived performance reviewed
- [ ] Error recovery path designed for each section
