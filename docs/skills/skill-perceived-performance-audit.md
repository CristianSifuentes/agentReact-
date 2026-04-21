# Skill: Perceived Performance Audit

## Purpose

Analyze what users actually feel when using a route or feature — not what benchmarks report. Find where users experience unnecessary delay, disorientation, or visual instability, and propose targeted fixes.

## When to invoke

- A page technically loads fast but feels slow
- Users report the app feels sluggish without clear metrics evidence
- A new route was built without explicit streaming or reveal-order design
- An interaction has noticeable lag after a click or tap
- Layout shift is visible after async content resolves

## Execution steps

### 1. Map the user's experience timeline

Walk through the page from the user's perspective, moment by moment:

```
T=0ms:    User navigates to route
T=Xms:    First bytes received
T=Yms:    First visible content (FCP)
T=Zms:    Critical content visible (LCP)
T=Wms:    Page is fully interactive
T=Vms:    All secondary content visible
```

For each moment, ask: "What does the user see, and what are they waiting for?"

### 2. Identify perceived performance issues

| Issue type | Symptom | Common cause |
|---|---|---|
| Blank screen | Nothing visible for > 500ms | Shell not rendering before data |
| Content jump | Layout shifts when async content resolves | Skeleton doesn't match real content size |
| Non-interactive elements | Clicks don't work on first load | Hydration not complete before interaction |
| Wrong reveal order | Important content appears after less important | Streaming tier assignment wrong |
| Spinner fatigue | User sees many spinners for simple load | Too many separate Suspense boundaries |
| Transition flash | Hard cut between loading and loaded states | Missing transition animation |
| Interaction lag | Click feedback delayed > 100ms | Heavy synchronous JS in event handler |

### 3. Assess each issue by user impact

Rate each issue:
- **High:** User notices and may abandon
- **Medium:** User notices but tolerates
- **Low:** Subtle, rarely noticed

### 4. Propose fixes by issue type

| Issue | Fix |
|---|---|
| Blank screen | Render shell immediately, defer data with Suspense |
| Content jump | Match skeleton dimensions to real content |
| Non-interactive | Ensure critical JS hydrates before user can interact |
| Wrong reveal order | Reclassify streaming tiers — critical data first |
| Spinner fatigue | Merge adjacent Suspense boundaries |
| Transition flash | Add CSS transition on Suspense fallback exit |
| Interaction lag | Move work off the event handler's sync path |

### 5. Produce output

```
## Perceived performance audit: [route or feature]

### User experience timeline
T=0:   [what user sees]
T=Xms: [what user sees]
...

### Issues found
| Issue | Type | User impact | Root cause | Fix |
|---|---|---|---|---|

### Priority fixes (ordered by user impact)
1. [highest impact fix]
2. ...

### Reveal order recommendations
### Skeleton quality notes
### Interaction responsiveness notes
### Metrics to watch after fixes
```

## Quality checks

- [ ] Timeline starts at T=0 (navigation), not when data arrives
- [ ] Every issue is rated by user impact
- [ ] Fixes are specific (not "use streaming" — "move X to deferred tier")
- [ ] Layout shift risks are explicitly checked
- [ ] Hydration-interaction timing is assessed
