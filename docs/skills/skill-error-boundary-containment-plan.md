# Skill: Error Boundary Containment Plan

## Purpose

Design an error boundary strategy that isolates failures, prevents cascade, gives users a recovery path, and captures telemetry. A single component failure should never collapse the entire application.

## When to invoke

- Designing a new route with multiple independent sections
- An existing route crashes entirely when one data source fails
- Designing retry or recovery UX
- Adding observability to frontend errors

## Execution steps

### 1. Identify failure domains

A failure domain is a region of the UI that can fail independently without breaking adjacent regions. For each route, identify:
- Which sections display data from independent sources?
- Which sections are user-specific vs shared?
- Which sections are critical (must show) vs optional (nice to have)?

### 2. Assign error boundaries

Placement rules:

| Placement | Use when |
|---|---|
| **Route-level** | Entire route fails (e.g., authentication failure, not-found) |
| **Section-level** | A major region (feed, sidebar, panel) can fail without taking the page down |
| **Feature-level** | A self-contained widget or feature has its own error state |
| **No boundary** | Failure here is catastrophic and should propagate (e.g., root layout) |

### 3. Design each error state

For every error boundary, define:
- **Error UI:** What does the user see? (inline message, empty state, retry button)
- **Recovery action:** Can the user retry? What triggers the retry?
- **Escalation policy:** When should the error be promoted to a full-page error?
- **Telemetry hook:** What error data is captured and where?

### 4. Design retry policy

| Scenario | Retry strategy |
|---|---|
| Network error | Retry button, up to 3 attempts |
| Server error (5xx) | Retry with exponential backoff |
| Not found (404) | No retry — show empty state with navigation option |
| Auth error (401/403) | No retry — redirect or show login prompt |
| Client error (bad data) | No retry — show error with contact/support option |

### 5. Telemetry hooks

Each error boundary should capture:
- Component name / boundary name
- Error message and stack
- Route / URL at time of error
- User session ID (if available)
- Timestamp

Use `componentDidCatch` or an error boundary library (react-error-boundary) with an `onError` callback.

### 6. Produce output

```
## Error boundary containment plan: [route or feature]

### Failure domain map
| Domain | Independent? | Critical? | Boundary level |
|---|---|---|---|

### Error boundary placement
| Boundary | Scope | Error UI | Recovery | Escalation |
|---|---|---|---|---|

### Retry policy
| Error type | Strategy | Max attempts |
|---|---|---|

### Telemetry spec
### Recovery UX flows
```

## Quality checks

- [ ] No route where a single section failure causes a white screen
- [ ] Every error boundary has a meaningful error UI (not blank)
- [ ] Every recoverable error has a retry path
- [ ] Non-recoverable errors escalate appropriately
- [ ] Telemetry is captured at every boundary
- [ ] Auth errors redirect rather than retry
