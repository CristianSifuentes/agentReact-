# Skill: Component API Review

## Purpose

Review a React component's external interface for ergonomics, composability, accessibility alignment, and API stability. Produce a concrete critique and recommended redesign.

## When to invoke

- A component's prop list has grown beyond 8-10 props
- A component is hard to reuse across multiple features
- The same component has different behaviors controlled by boolean flags
- A component is being considered for a shared design system
- An API redesign is needed before the component is used in many places

## Execution steps

### 1. Inventory the current API

List:
- All props with types
- Default values
- Required vs optional
- Event handlers
- Render props or slot props (if any)
- Forwarded refs

### 2. Apply ergonomics criteria

| Criterion | Good | Bad |
|---|---|---|
| Naming clarity | `variant="primary"` | `isPrimary`, `isButton`, `isHighlighted` |
| Responsibility | One thing well | Renders, fetches, and tracks analytics |
| Default case | Works with minimal props | Requires 5 props to render at all |
| Extension point | Can be customized without internal knowledge | Requires `dangerouslySetInnerHTML` to extend |
| Breaking-change risk | Adding props is non-breaking | Renaming or removing props is breaking |
| Composability | `<Tabs.List>` + `<Tabs.Panel>` | `<Tabs items={[{label, content}]} />` (for complex) |

### 3. Identify prop anti-patterns

| Anti-pattern | Example | Fix |
|---|---|---|
| Boolean flag explosion | `isFull isLarge isRound isOutlined` | `variant`, `size`, `shape` enums |
| Behavior + style combined | `primary` does both color and behavior | Separate `variant` from `intent` |
| Implicit prop | `open` without `onOpenChange` (controlled with no way to control) | Complete controlled API |
| Mixed controlled/uncontrolled | `value` + internal `useState` both | Choose one, or support both explicitly |
| Overly generic | `config: Record<string, unknown>` | Typed config interface |

### 4. Assess composability

- Could this be a compound component? (when it has multiple coordinated sub-parts)
- Should this be headless? (when behavior is needed but UI varies widely)
- Is there a clear slot/children strategy? (for layout components)

### 5. Check accessibility alignment

- Is the root element semantically correct? (`<button>` not `<div onClick>`)
- Are ARIA roles explicit when needed?
- Is keyboard navigation supported?
- Is `forwardRef` present if this wraps a DOM element?

### 6. Produce output

```
## Component API review: [ComponentName]

### Current API
(prop table with types)

### Ergonomics critique
| Concern | Issue | Recommendation |
|---|---|---|

### Anti-patterns found
### Composability score: N/5
### Accessibility gaps
### Recommended API redesign
(complete revised prop interface)

### Usage examples: before/after
### Breaking change risks if redesigned
```

## Quality checks

- [ ] Every boolean prop is justified or replaced
- [ ] Component has a single clear responsibility
- [ ] Controlled API is complete (value + onChange where applicable)
- [ ] `forwardRef` used if wrapping a DOM element
- [ ] Compound component pattern assessed
- [ ] API is stable — can grow without breaking changes
