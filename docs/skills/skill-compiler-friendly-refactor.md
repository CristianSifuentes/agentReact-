# Skill: Compiler-Friendly Refactor

## Purpose

Review a component or module for unnecessary memoization, impurity, and accidental complexity. Produce a cleaned-up version that works with the React Compiler rather than against it.

## When to invoke

- A component has heavy `useMemo` / `useCallback` usage
- Code was written before React Compiler era and is being modernized
- A component is hard to read because of optimization boilerplate
- Performance issues persist despite heavy memoization (architectural problem, not local)

## Execution steps

### 1. List all memoization calls

For each `useMemo`, `useCallback`, `React.memo`:
- What is being memoized?
- What are the dependencies?
- What is the downstream consumer?
- Is there profiling evidence that this is necessary?

### 2. Apply the memoization necessity test

A memoization call is justified when ALL of:
- [ ] The computation is expensive (> 1ms, or involves large data structures)
- [ ] The result is used as a dependency of `useEffect` with real cost, OR passed to a memoized child
- [ ] The memoized value actually changes less frequently than the parent renders

If any criterion fails: mark for removal.

### 3. Identify purity violations

A component is impure if during render it:
- Reads mutable external state directly (not via React state or context)
- Mutates props, external variables, or refs
- Has side effects (console.log is fine; fetch/localStorage writes are not)
- Relies on execution order rather than data flow

### 4. Identify accidental complexity

Common patterns that add complexity without benefit:
- `useCallback` on a function that is only used in JSX event handlers (React Compiler handles this)
- `useMemo` on a boolean or string calculation
- `React.memo` on a component that re-renders anyway because its parent always passes new object props
- Derived state computed in `useEffect` and stored in `useState` instead of being computed inline
- Splitting one logical component into multiple just to avoid re-renders

### 5. Produce output

```
## Compiler-friendly refactor: [component]

### Memoization audit
| Call | Justified? | Reason | Action |
|---|---|---|---|

### Purity issues
| Issue | Component | Fix |
|---|---|---|

### Accidental complexity
### Before (relevant excerpts)
### After (refactored)
### What changed and why
### What was intentionally kept and why
```

## Common safe removals

```typescript
// REMOVE: useMemo on cheap calculation
const label = useMemo(() => `${first} ${last}`, [first, last])
// BECOMES:
const label = `${first} ${last}`

// REMOVE: useCallback with no memoized consumer
const handleClick = useCallback(() => doSomething(id), [id])
// BECOMES:
const handleClick = () => doSomething(id)

// REMOVE: React.memo when parent always passes new object prop
const MyComponent = React.memo(({ config }) => ...)
// parent: <MyComponent config={{ size: 'lg' }} />  ← new object every render
```

## Quality checks

- [ ] Every removed memoization call has a documented reason
- [ ] No purity violations remain in render
- [ ] Refactored component is shorter and easier to read
- [ ] Verified: no `useEffect` dependency arrays broken by removals
- [ ] Architecture-level bottlenecks are documented separately for other agents
