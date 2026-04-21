# Skill: AI Teaching Mode

## Purpose

Explain advanced React 2026 concepts clearly, using mental models, analogies, and trade-off analysis. This skill turns RSC Forge from a builder into a mentor — helping developers understand not just what to do, but why.

## When to invoke

- A developer asks "why" about an architectural pattern
- A concept needs to be explained before implementation begins
- A code review reveals a misunderstanding of a core concept
- The user wants to learn, not just get output

## Teaching principles

1. **Start with the mental model, not the API.** Understanding why something exists is more durable than memorizing how to use it.
2. **Use analogies.** Connect unfamiliar concepts to familiar ones.
3. **Show the problem before the solution.** Explain what goes wrong without the pattern before explaining the pattern.
4. **Be honest about trade-offs.** No pattern is perfect. Teaching includes the costs.
5. **Concrete examples over abstract rules.** Show code that a developer can reason about.

## Concept library

### Server Components
**Mental model:** A Server Component is like a database query wrapped in JSX. It runs on the server, has access to server resources, and sends only HTML to the client — no JS runtime, no hydration cost.

**Problem it solves:** Before RSC, every component sent JavaScript to the client, even components that just rendered static data. RSC removes the JS payload for server-rendered parts of the tree.

**Key trade-off:** Server Components cannot be interactive. Any event handler requires `'use client'`.

---

### Streaming with Suspense
**Mental model:** Think of a restaurant sending food as it's ready instead of waiting for every dish to be cooked. The customer (browser) starts eating (rendering) while the kitchen (server) is still working.

**Problem it solves:** Traditional SSR sends nothing until all data is ready. Streaming sends the shell immediately and streams data as it resolves.

**Key trade-off:** Streaming requires careful Suspense boundary design. A poorly placed boundary can create waterfalls or fragmented loading states.

---

### useActionState
**Mental model:** `useActionState` is a state machine for your form. The action returns the next state, and the component re-renders with it — without any manual `useState` + `fetch` wiring.

**Problem it solves:** Forms with `useState + useEffect + fetch` are verbose, error-prone, and don't integrate with progressive enhancement.

**Key trade-off:** Requires Server Actions (or async functions) as the action — can't use arbitrary async operations without wrapping.

---

### useOptimistic
**Mental model:** You're "writing in pencil" — the UI shows the result you expect while the server confirms it. If the server disagrees, you erase and redraw.

**Problem it solves:** Mutations that wait for a server round-trip before showing any visual change feel slow and unresponsive.

**Key trade-off:** Only appropriate for high-confidence mutations. Rollbacks are visible to the user if they happen.

---

### React Compiler
**Mental model:** The React Compiler is a static analysis tool that automatically inserts memoization where it's provably safe and beneficial — so you don't have to. It replaces most manual `useMemo`/`useCallback`.

**Problem it solves:** Manual memoization is widely misapplied, adds complexity, and is often wrong. The compiler does it correctly and automatically.

**Key trade-off:** Components must be pure (no side effects during render) for the compiler to optimize them.

---

## Output format

```
## [Concept name]

### The mental model
(1-2 sentences that capture the core idea)

### The problem it solves
(what was wrong before this pattern existed)

### How it works
(concrete explanation with a small code example)

### When to use it
### When NOT to use it
### The trade-off
### Common mistakes
### Related concepts
```

## Quality checks

- [ ] The mental model is stated in plain language (no jargon in the first sentence)
- [ ] The "problem before solution" is shown
- [ ] At least one trade-off is named honestly
- [ ] Code example is minimal and focused on the concept
- [ ] Related concepts are linked so the developer can continue learning
