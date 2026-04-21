# RSC Forge

> An AI React Staff Engineer — not a code generator.

RSC Forge is a Claude Code operating model that thinks like a principal React engineer. It reasons about server/client boundaries, streaming architecture, Suspense design, mutation lifecycles, TypeScript contracts, and perceived performance **before writing a single line of code**.

---

## Table of Contents

- [What this is](#what-this-is)
- [Core promise](#core-promise)
- [Architecture rules](#architecture-rules)
- [System overview](#system-overview)
- [Agents](#agents)
  - [Orchestration](#orchestration)
  - [Architecture & Boundaries](#architecture--boundaries)
  - [Streaming & Resilience](#streaming--resilience)
  - [Mutations & State](#mutations--state)
  - [Quality & Systems](#quality--systems)
- [Skills](#skills)
  - [Boundary & Classification](#boundary--classification)
  - [Streaming & Resilience](#streaming--resilience-1)
  - [Mutations & Optimism](#mutations--optimism)
  - [Code Quality](#code-quality)
  - [TypeScript & Contracts](#typescript--contracts)
  - [Framework & Translation](#framework--translation)
  - [Scaffolding & Documentation](#scaffolding--documentation)
- [Playbooks](#playbooks)
- [Architecture Docs](#architecture-docs)
- [Templates](#templates)
- [Standard Workflows](#standard-workflows)
  - [New feature request](#new-feature-request)
  - [Code review](#code-review)
  - [Migration to modern React](#migration-to-modern-react)
- [Framework target](#framework-target)
- [Project structure](#project-structure)

---

## What this is

Most AI coding tools are code generators. RSC Forge is an **architecture system** — a set of specialized agents, reusable skills, and operational playbooks that collaborate to produce production-ready React architecture and implementation plans.

Every output covers:
- Server/client boundary classification
- Streaming and reveal-order design
- Suspense and error boundary placement
- Full mutation lifecycle (pending → optimistic → success → error → rollback)
- TypeScript contracts aligned across layers
- Perceived performance — what users feel, not just what benchmarks report

---

## Core promise

> "An AI React architect that thinks in server/client boundaries, streaming, Suspense, mutations, contracts, and perceived performance."

Not: *"An AI that knows React."*
But: *"A React Staff Engineer you can talk to."*

---

## Architecture rules

These govern every decision made by every agent in the system:

| # | Rule |
|---|---|
| 1 | **Server Components by default.** Justify every `'use client'`. |
| 2 | **Data belongs on the server.** No `useEffect + fetch` for data that can be server-fetched. |
| 3 | **Suspense boundaries are intentional architecture.** Every boundary needs a fallback rationale. |
| 4 | **Optimize perceived speed first.** Users feel reveal order, not milliseconds. |
| 5 | **No cargo-cult memoization.** Never add `useMemo`/`useCallback` without profiling evidence. |
| 6 | **Keep client bundles small and explicit.** Every `'use client'` is a hydration cost. |
| 7 | **Make state ownership visible.** Classify before you store. |
| 8 | **Types are contracts.** Align types across server, actions, and UI. No `any`. |
| 9 | **Mutations have full lifecycles.** Design `IDLE → PENDING → SUCCESS → ERROR → ROLLBACK`. |
| 10 | **Framework conventions first.** Lean on Next.js App Router or React Router 7 before inventing abstractions. |

---

## System overview

```
RSC Forge
│
├─ CLAUDE.md                    ← System constitution & operating rules
│
├─ docs/
│  ├─ agents/                   ← 12 specialist agents with identities and missions
│  ├─ skills/                   ← 15 reusable execution procedures
│  ├─ playbooks/                ← 5 multi-phase operational guides
│  ├─ architecture/             ← 6 reference docs for architectural decisions
│  └─ templates/                ← 5 fill-in-the-blank output templates
│
└─ app/                         ← Your React application
```

The system is organized into **three layers of abstraction**:

| Layer | What it is | Examples |
|---|---|---|
| **Agents** | Specialists with a stable identity and decision-making role | `rsc-boundary-engineer`, `streaming-ux-engineer` |
| **Skills** | Reusable step-by-step execution procedures | `skill-streaming-route-design`, `skill-action-mutation-flow-design` |
| **Playbooks** | Multi-phase guides that orchestrate agents and skills | `build-streaming-dashboard`, `build-optimistic-form-flow` |

---

## Agents

12 specialist agents, each with a defined identity, mission, and output format.

### Orchestration

| Agent | Mission | Key output |
|---|---|---|
| [AI Pair Programmer Orchestrator](docs/agents/ai-pair-programmer-orchestrator.md) | Coordinates all agents, decomposes tasks, routes work to specialists | Execution plan, work packets, integrated implementation blueprint |

### Architecture & Boundaries

| Agent | Mission | Key output |
|---|---|---|
| [React Chief Architect](docs/agents/react-chief-architect.md) | Owns overall architecture, RSC strategy, composition decisions, framework fit | Architecture decisions, feature slice design, ADRs |
| [RSC Boundary Engineer](docs/agents/rsc-boundary-engineer.md) | Classifies every component as SERVER / CLIENT / SERVER_FUNCTION, minimizes hydration | Boundary audit table, serialization risk report, refactor recommendations |
| [Framework Navigator](docs/agents/framework-navigator.md) | Translates architecture to Next.js App Router or React Router 7 conventions | Side-by-side implementations, route architecture, framework comparisons |

### Streaming & Resilience

| Agent | Mission | Key output |
|---|---|---|
| [Streaming UX Engineer](docs/agents/streaming-ux-engineer.md) | Designs reveal order, loading shells, and progressive content delivery | Streaming plan, fallback map, reveal order narrative |
| [Suspense & Recovery Architect](docs/agents/suspense-recovery-architect.md) | Designs Suspense trees, error boundaries, retry flows, failure containment | Boundary tree, fallback rationale, recovery flow design |
| [Performance Perception Analyst](docs/agents/performance-perception-analyst.md) | Audits what users feel — not what benchmarks report | UX timeline, perceived performance report, priority fix list |

### Mutations & State

| Agent | Mission | Key output |
|---|---|---|
| [Actions & Mutation Designer](docs/agents/actions-mutation-designer.md) | Designs full mutation lifecycle — `useActionState`, `useOptimistic`, rollback | Action lifecycle model, mutation blueprint, optimistic strategy |
| [Server State & Cache Strategist](docs/agents/server-state-cache-strategist.md) | Classifies state ownership, designs caching and revalidation strategy | State ownership map, caching policy, invalidation triggers |

### Quality & Systems

| Agent | Mission | Key output |
|---|---|---|
| [React Compiler Alignment Specialist](docs/agents/react-compiler-alignment-specialist.md) | Eliminates cargo-cult memoization, restores purity, aligns with React Compiler | Memoization audit, purity assessment, simplified refactor |
| [TypeScript Systems Engineer](docs/agents/typescript-systems-engineer.md) | Hardens type contracts across server, actions, and UI — no `any` | Contract chain audit, type definitions, schema alignment |
| [Component Systems Designer](docs/agents/component-systems-designer.md) | Designs ergonomic, composable, accessible component APIs | API critique, composability score, recommended redesign |

---

## Skills

15 reusable execution procedures. Each skill has a defined purpose, step-by-step execution plan, and quality checklist.

### Boundary & Classification

| Skill | Purpose |
|---|---|
| [skill-server-client-boundary-audit](docs/skills/skill-server-client-boundary-audit.md) | Classify every component as SERVER / CLIENT / SERVER_FUNCTION, flag hydration costs and over-clienting |
| [skill-selective-state-placement](docs/skills/skill-selective-state-placement.md) | Classify state as local / derived / server / cached / optimistic / URL / form, flag misplacements |

### Streaming & Resilience

| Skill | Purpose |
|---|---|
| [skill-streaming-route-design](docs/skills/skill-streaming-route-design.md) | Assign content to streaming tiers (Immediate / Critical / Deferred / Lazy), design reveal order |
| [skill-suspense-boundary-planner](docs/skills/skill-suspense-boundary-planner.md) | Place Suspense boundaries with correct granularity and fallback rationale, prevent waterfalls |
| [skill-error-boundary-containment-plan](docs/skills/skill-error-boundary-containment-plan.md) | Isolate failure domains, design recovery UX, define retry policy, add telemetry hooks |
| [skill-perceived-performance-audit](docs/skills/skill-perceived-performance-audit.md) | Audit the user experience timeline, find blank screens / layout shift / wrong reveal order |

### Mutations & Optimism

| Skill | Purpose |
|---|---|
| [skill-action-mutation-flow-design](docs/skills/skill-action-mutation-flow-design.md) | Model the full mutation lifecycle: IDLE → PENDING → OPTIMISTIC → SUCCESS → ERROR → ROLLBACK |
| [skill-optimistic-ui-strategy](docs/skills/skill-optimistic-ui-strategy.md) | Assess optimistic UI safety, design rollback strategy, handle temporary IDs and conflicts |

### Code Quality

| Skill | Purpose |
|---|---|
| [skill-compiler-friendly-refactor](docs/skills/skill-compiler-friendly-refactor.md) | Remove unjustified `useMemo` / `useCallback` / `React.memo`, restore purity, simplify dataflow |

### TypeScript & Contracts

| Skill | Purpose |
|---|---|
| [skill-typescript-contract-hardening](docs/skills/skill-typescript-contract-hardening.md) | Align types across server → action → UI, remove `any`, derive types from Zod schemas |

### Framework & Translation

| Skill | Purpose |
|---|---|
| [skill-framework-translation](docs/skills/skill-framework-translation.md) | Produce side-by-side Next.js App Router vs React Router 7 implementations with honest trade-off comparison |
| [skill-component-api-review](docs/skills/skill-component-api-review.md) | Review component props for ergonomics, composability, accessibility, and API stability |

### Scaffolding & Documentation

| Skill | Purpose |
|---|---|
| [skill-react-2026-feature-scaffolder](docs/skills/skill-react-2026-feature-scaffolder.md) | Full feature blueprint: route structure, boundary map, Suspense plan, mutations, types, implementation steps |
| [skill-adr-writer](docs/skills/skill-adr-writer.md) | Write durable Architecture Decision Records capturing context, decision, alternatives, and consequences |
| [skill-ai-teaching-mode](docs/skills/skill-ai-teaching-mode.md) | Explain advanced React 2026 concepts with mental models, analogies, and honest trade-off analysis |

---

## Playbooks

5 multi-phase operational guides that orchestrate agents and skills for common high-value workflows.

| Playbook | When to use | Agents involved |
|---|---|---|
| [Build a Streaming Dashboard](docs/playbooks/build-streaming-dashboard.md) | Multi-section data page, parallel data sources, progressive loading | chief-architect → streaming-ux → suspense-recovery → server-state → ts-engineer → performance-analyst |
| [Build an Optimistic Form Flow](docs/playbooks/build-optimistic-form-flow.md) | Any form or mutation, optimistic UI, `useActionState` / `useOptimistic` | actions-mutation-designer → ts-engineer → compiler-alignment |
| [Design a Suspense-First Route](docs/playbooks/suspense-first-route.md) | New route with multiple async data sources, reveal order must be intentional | streaming-ux → suspense-recovery → framework-navigator → performance-analyst |
| [Migrate Client-Fetching to RSC](docs/playbooks/migrate-to-rsc.md) | Moving `useEffect + fetch` patterns to Server Components | rsc-boundary → server-state → compiler-alignment → framework-navigator |
| [Next.js vs React Router 7](docs/playbooks/nextjs-vs-react-router.md) | Framework selection or side-by-side comparison for a feature | framework-navigator + skill-framework-translation |

---

## Architecture Docs

6 reference documents that define the canonical positions on React 2026 architecture.

| Document | What it covers |
|---|---|
| [React 2026 Principles](docs/architecture/react-2026-principles.md) | 10 non-negotiable principles: server-first, state ownership, mutation lifecycles, perceived speed, and more |
| [Server/Client Boundaries](docs/architecture/server-client-boundaries.md) | Decision flowchart, boundary patterns, serialization rules, common violations with fixes |
| [State Strategy](docs/architecture/state-strategy.md) | State classification system, decision rules, anti-patterns, framework cache vs TanStack Query |
| [Suspense & Error Architecture](docs/architecture/suspense-error-architecture.md) | Boundary granularity guide, waterfall prevention, combined Suspense+Error patterns, anti-patterns |
| [Performance Strategy](docs/architecture/performance-strategy.md) | Perceived speed hierarchy, shell-first architecture, parallel fetching, metrics that matter, what NOT to optimize |
| [Framework Decisions](docs/architecture/framework-decisions.md) | Next.js App Router vs React Router 7 capability map, when to choose each, idiomatic code patterns for both |

---

## Templates

5 fill-in-the-blank templates for the most common output types.

| Template | Use it when |
|---|---|
| [ADR Template](docs/templates/adr-template.md) | Documenting a significant architectural decision (framework choice, state strategy, mutation pattern) |
| [Feature Proposal](docs/templates/feature-proposal-template.md) | Starting a new feature — captures route, boundary map, state, mutations, types, and implementation order |
| [Route Design](docs/templates/route-design-template.md) | Designing a new route — streaming plan, component tree, data fetching, Suspense/error boundaries |
| [Suspense Map](docs/templates/suspense-map-template.md) | Documenting the Suspense and error boundary tree for a route — with fallback specs and waterfall risk |
| [Performance Audit](docs/templates/performance-audit-template.md) | Running a perceived performance review — UX timeline, issue inventory, metrics, priority fixes |

---

## Standard Workflows

### New feature request

When a user asks for a new feature, the system orchestrates agents in this sequence:

```
1. ai-pair-programmer-orchestrator   → decompose the task
2. react-chief-architect             → architecture & boundaries
3. framework-navigator               → map to Next.js or React Router 7
4. rsc-boundary-engineer             → classify server/client placement
5. actions-mutation-designer         → design mutations & interactions
6. suspense-recovery-architect       → loading/error containment
7. typescript-systems-engineer       → harden types & contracts
8. performance-perception-analyst    → verify perceived speed
9. component-systems-designer        → clean reusable APIs
```

**Skills invoked:** `skill-react-2026-feature-scaffolder` → `skill-server-client-boundary-audit` → `skill-streaming-route-design` → `skill-suspense-boundary-planner` → `skill-action-mutation-flow-design` → `skill-typescript-contract-hardening`

---

### Code review

Run these review modes against an existing route or feature:

```
review:rsc-boundaries          → rsc-boundary-engineer
review:suspense-architecture   → suspense-recovery-architect
review:compiler-alignment      → react-compiler-alignment-specialist
review:state-ownership         → server-state-cache-strategist
review:perceived-performance   → performance-perception-analyst
```

---

### Migration to modern React

Moving a legacy React app (client-heavy, `useEffect + fetch`) to React 2026 patterns:

```
1. react-chief-architect              → identify what must change
2. rsc-boundary-engineer              → move components server-side
3. server-state-cache-strategist      → migrate client data fetching
4. react-compiler-alignment-specialist → remove stale optimization
5. framework-navigator                → align with framework conventions
6. performance-perception-analyst     → verify perceived speed improved
```

**Playbook:** [Migrate Client-Fetching to RSC](docs/playbooks/migrate-to-rsc.md)

---

## Framework target

| Phase | Framework | Status |
|---|---|---|
| V1 | Next.js App Router | Primary — deepest RSC support |
| V2 | React Router 7 | Comparison & translation mode |

The system can generate side-by-side implementations for both frameworks using the [Framework Navigator](docs/agents/framework-navigator.md) agent and [skill-framework-translation](docs/skills/skill-framework-translation.md).

---

## Project structure

```
agentReact-/
│
├─ CLAUDE.md                                      ← System constitution
│
├─ docs/
│  │
│  ├─ agents/                                     ← 12 specialist agents
│  │  ├─ ai-pair-programmer-orchestrator.md
│  │  ├─ react-chief-architect.md
│  │  ├─ rsc-boundary-engineer.md
│  │  ├─ streaming-ux-engineer.md
│  │  ├─ suspense-recovery-architect.md
│  │  ├─ actions-mutation-designer.md
│  │  ├─ react-compiler-alignment-specialist.md
│  │  ├─ typescript-systems-engineer.md
│  │  ├─ server-state-cache-strategist.md
│  │  ├─ framework-navigator.md
│  │  ├─ component-systems-designer.md
│  │  └─ performance-perception-analyst.md
│  │
│  ├─ skills/                                     ← 15 execution procedures
│  │  ├─ skill-server-client-boundary-audit.md
│  │  ├─ skill-streaming-route-design.md
│  │  ├─ skill-suspense-boundary-planner.md
│  │  ├─ skill-error-boundary-containment-plan.md
│  │  ├─ skill-action-mutation-flow-design.md
│  │  ├─ skill-optimistic-ui-strategy.md
│  │  ├─ skill-compiler-friendly-refactor.md
│  │  ├─ skill-selective-state-placement.md
│  │  ├─ skill-typescript-contract-hardening.md
│  │  ├─ skill-framework-translation.md
│  │  ├─ skill-component-api-review.md
│  │  ├─ skill-perceived-performance-audit.md
│  │  ├─ skill-react-2026-feature-scaffolder.md
│  │  ├─ skill-adr-writer.md
│  │  └─ skill-ai-teaching-mode.md
│  │
│  ├─ playbooks/                                  ← 5 operational guides
│  │  ├─ build-streaming-dashboard.md
│  │  ├─ build-optimistic-form-flow.md
│  │  ├─ suspense-first-route.md
│  │  ├─ migrate-to-rsc.md
│  │  └─ nextjs-vs-react-router.md
│  │
│  ├─ architecture/                               ← 6 reference docs
│  │  ├─ react-2026-principles.md
│  │  ├─ server-client-boundaries.md
│  │  ├─ state-strategy.md
│  │  ├─ suspense-error-architecture.md
│  │  ├─ performance-strategy.md
│  │  └─ framework-decisions.md
│  │
│  └─ templates/                                  ← 5 output templates
│     ├─ adr-template.md
│     ├─ feature-proposal-template.md
│     ├─ route-design-template.md
│     ├─ suspense-map-template.md
│     └─ performance-audit-template.md
│
└─ app/                                           ← Your React application
```

---

## React pillars covered

Every React 2026 concern maps to a dedicated agent:

| React concern | Agent |
|---|---|
| Server Components + Server Functions | `react-chief-architect` + `rsc-boundary-engineer` |
| Streaming and partial rendering | `streaming-ux-engineer` |
| React Compiler mental model | `react-compiler-alignment-specialist` |
| `useActionState`, `useOptimistic`, actions | `actions-mutation-designer` |
| Suspense and Error Boundary architecture | `suspense-recovery-architect` |
| Next.js App Router / React Router 7 | `framework-navigator` |
| TypeScript at scale | `typescript-systems-engineer` |
| Perceived performance | `performance-perception-analyst` |
| Server state, caching, TanStack Query | `server-state-cache-strategist` |
