Review a React component in the Coursivo frontend for quality, design system compliance, and correctness.

The user provides a file path or pastes the component. Read the file first, then review against all rules in `.claude/rules/`.

## Review Checklist

### Design System Compliance (`.claude/rules/design-system.md`)
- Hardcoded hex colors (`#...`) or arbitrary Tailwind values (`bg-[#123456]`) — must use semantic tokens
- `cn()` not used for class composition
- Custom CSS file created instead of using Tailwind utilities
- Rounded corners > `rounded-lg` (0.5rem max)
- Glassmorphism, glow effects, or decorative animations
- Scale/translate hover effects (`hover:scale-*`, `hover:translate-*`)
- Font other than Inter

### Component Patterns (`.claude/rules/components.md`)
- shadcn/ui component manually modified (files in `src/components/ui/`)
- Rebuilding something shadcn already provides (button, input, dialog, etc.)
- Missing loading state for async data
- Missing error state for failed fetch
- Missing empty state for zero-result lists
- Interactive element missing hover, active, or focus feedback

### Code Style (`.claude/rules/code-style.md`)
- `any` type used without justification (strict TS mode)
- Relative `../../` import instead of `@/` alias
- `fetch` or `axios` called directly in a component (must go through `src/api/`)
- API error not surfaced to user (no toast, no error state)
- Deep nesting without justification (>3 levels)

### Folder Structure (`.claude/rules/folder-structure.md`)
- File placed in the wrong directory (page in `components/`, etc.)
- Types defined inline instead of in `src/types/*.types.ts`
- Utility function defined in a component instead of `src/lib/`

### React Correctness
- Missing dependency in `useEffect` dependency array
- State mutation instead of `setState` / store update
- Missing `key` prop on list items
- `key={index}` used (unstable — use entity id)
- Effect that should clean up (event listeners, timers) missing cleanup return

### Accessibility
- Interactive element missing keyboard support
- Image missing `alt` text
- Form input missing associated `<label>`
- Focus state removed (`outline-none` without `focus:ring-*`)

## Output Format

```
## Component Review: [ComponentName]

### Summary
[1–2 sentence overall assessment]

### Must Fix
- **[line]** [Issue] → [Fix]

### Should Fix
- **[line]** [Issue] → [Fix]

### Nits
- [Minor observations]

### Looks Good
- [What's done well]
```

Be specific — cite line numbers, class names, and exact props. No generic feedback.
