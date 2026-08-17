# Coursivo Design System — "Console"

This document is the **single source of truth** for all UI decisions in the Coursivo frontend. All AI assistants and developers **MUST** strictly follow these patterns when creating, updating, or reviewing components.

---

## Core Aesthetic

- **Style:** A quiet, monochrome instrument panel. Calm, dense, engineered.
- **Philosophy:** Elevation over decoration. Borders over shadows. Contrast over colour.
- **Shapes:** `--radius: 0.75rem`. Panels use `rounded-xl`, controls and inset wells `rounded-lg`.

### The elevation model — read this first

Everything in the system derives from **two surfaces**:

| Surface | Token | Role |
|---|---|---|
| Field | `bg-background` | The recessed page. Nothing "sits" here directly. |
| Panel | `bg-card` | The raised plane that content lives on. |

Content lives on **panels separated by gaps**, floating on the field — not in flush sections divided by rules. A panel is `rounded-xl border border-border bg-card`, available as the `.panel` class.

Inside a panel, a recessed region (image frame, input, code block) drops back to `bg-background` — the `.well` class. That gives three readable depths: field → panel → well.

**Two failure modes to avoid.** Setting `--card` equal to `--background` collapses the depth cue and the entire UI reads flat. Reaching for `shadow-lg` to create separation fights the border-based model — surface lightness and a hairline border already do that job.

---

## 1. Colour tokens (OKLCH)

The ramp is **fully neutral — chroma 0**. There is no accent hue. Hierarchy comes from lightness and type weight. All values live in `src/index.css`.

### Dark mode (the primary target)

| Token | Value | Purpose |
|---|---|---|
| `--background` | `oklch(0.1400 0 0)` | Recessed field (near-black, not pure) |
| `--card` | `oklch(0.1850 0 0)` | Raised panel |
| `--popover` | `oklch(0.2100 0 0)` | Overlays, one step above panel |
| `--muted` / `--secondary` | `oklch(0.2300 0 0)` | Inset fills, skeletons |
| `--accent` | `oklch(0.2450 0 0)` | Hover and active surface |
| `--border` | `oklch(0.2600 0 0)` | Hairline, every edge |
| `--muted-foreground` | `oklch(0.6250 0 0)` | Secondary text |
| `--foreground` | `oklch(0.9400 0 0)` | Primary text (never pure white) |
| `--sidebar` | `oklch(0.1400 0 0)` | Same as field — the sidebar is not a panel |
| `--sidebar-accent` | `oklch(0.2300 0 0)` | Active nav pill |

### Light mode

Same logic inverted: `--background` is a soft off-white field `oklch(0.9800 0 0)`, `--card` is pure white `oklch(1.0000 0 0)`, `--border` is `oklch(0.9100 0 0)`, and `--muted-foreground` is `oklch(0.5200 0 0)`.

> `--muted-foreground` in light mode was previously identical to `--foreground`, so "muted" text was not muted at all. It is now a genuine mid-grey. Keep it distinct from `--foreground`.

### Charts

`--chart-1` through `--chart-5` are a **lightness ramp**, not a categorical palette. Series are distinguished by value, not hue. If a chart needs more than five series, it needs a different chart.

---

## 2. Typography

**Font stack:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`, with `--tracking-normal: -0.011em` applied globally.

Use the utility classes in `src/index.css` rather than re-deriving sizes:

| Class | Use |
|---|---|
| `.text-display` | Landing hero only |
| `.text-h1` / `.text-h2` / `.text-h3` | Section and page headings |
| `.text-body` | Paragraph copy |
| `.text-label-13` | Dense UI labels |
| `.eyebrow` | Small uppercase section label, `0.16em` tracking |

**Rules:**
- ❌ **Never** use `font-bold` (700) or `font-extrabold` (800) in UI components.
- ✅ **Always** use `font-semibold` (600) for headings and `font-medium` (500) for emphasis.
- ✅ Always pair `font-semibold` headings with tight tracking.
- ✅ Use `text-muted-foreground` for secondary and helper text.

---

## 3. Sidebar

The sidebar shares the field colour and uses dedicated `--sidebar-*` tokens — never generic `bg-background`.

```tsx
// Root
<aside className="bg-sidebar border-r border-sidebar-border ...">

// Nav item — inactive
"border border-transparent text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground text-[13px] font-medium"

// Nav item — active: a raised pill, NOT an inverted block
"border border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground text-[13px] font-medium"

// Section label
<p className="eyebrow px-3">GENERAL</p>
```

The active item must **not** be `bg-foreground text-background`. Full inversion is far louder than anything else on screen and breaks the calm the system depends on.

Icons in the sidebar use `strokeWidth={1.75}` at `h-[15px] w-[15px]` expanded, `h-[18px] w-[18px]` collapsed.

---

## 4. Panels and cards

```tsx
// Standard panel
<div className="panel p-6">…</div>

// Interactive panel — border brightens, surface lifts slightly; no transform, no shadow
<article className="panel-interactive p-6">…</article>

// Inset region inside a panel
<div className="well overflow-hidden"><img … /></div>

// Emphasised panel (e.g. the popular pricing tier)
<div className="panel-highlight border-foreground/25 bg-accent rounded-xl border p-7">
```

`.panel-highlight` adds a 1px gradient hairline across the top edge, which is what makes a panel read as physically raised. Use it sparingly — on the hero frame, the CTA, and at most one card in a group.

❌ Do not use `hover:-translate-y-1` or `hover:shadow-md` for card hover. Motion on hover competes with the panel model; transition `border-color` and `background-color` only.

---

## 5. Buttons

```tsx
// Primary — white on dark, black on light
<Button className="rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90">

// Secondary — a panel-coloured button on the field
<Button variant="outline" className="rounded-lg border-border bg-card text-foreground hover:bg-accent">
```

Buttons are `rounded-lg`, `h-11` for hero-scale calls to action, default height elsewhere.

---

## 6. Atmosphere

Flat empty backgrounds are not the answer for marketing surfaces. Three monochrome utilities provide depth:

| Class | Use |
|---|---|
| `.bg-grid` / `.bg-grid-sm` | Fine engineering grid, 72px / 24px |
| `.glow-top` | Soft monochrome bloom behind hero content |
| `.mask-fade-radial` / `.mask-fade-b` | Fade an overlay out so it never hits a hard edge |

Apply these to an **absolutely-positioned `aria-hidden` overlay** with a negative z-index, never to a container holding content — they paint edge to edge and the mask must not clip children.

```tsx
<section className="relative isolate overflow-hidden">
  <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 glow-top" />
  <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-fade-radial opacity-60" />
  …
</section>
```

---

## 7. Motion

One directed entrance beats twenty hover effects. `.animate-rise` (12px lift, 0.7s, `cubic-bezier(0.16, 1, 0.3, 1)`) is the single entrance animation, and it respects `prefers-reduced-motion`. Everything else is a 150–200ms colour transition.

---

## 8. Reusable patterns

**Status / Free badge:**
```tsx
<span className="rounded-full bg-foreground px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-background">
  Free
</span>
```

**Section heading with eyebrow:**
```tsx
<div className="max-w-2xl">
  <p className="eyebrow">Capabilities</p>
  <h2 className="text-h1 mt-3 text-foreground">Title</h2>
  <p className="text-body mt-4 text-muted-foreground">Subtitle</p>
</div>
```

**Asymmetric bento:** on a `lg:grid-cols-12` grid, vary panel spans so each row sums to 12. Symmetric card grids are the default to avoid, not the default to reach for.

---

## 9. Do's and Don'ts

| ✅ DO | ❌ DON'T |
|---|---|
| Put content on `.panel` above `bg-background` | Put content directly on the field |
| Separate panels with gaps | Divide flush sections with border rules |
| Use `border-border` and surface lightness for depth | Use `shadow-lg`, `drop-shadow`, or hover transforms |
| Keep the ramp neutral (chroma 0) | Introduce an accent hue, `text-amber-500`, `text-emerald-600` |
| Use `font-semibold` + tight tracking for headings | Use `font-bold` or `font-extrabold` |
| Use `lucide-react`, `strokeWidth` 1.75 for UI chrome | Use emoji or other icon libraries |
| Use `bg-sidebar` and `--sidebar-*` in the sidebar | Use `bg-background` or `bg-foreground` inside it |
| Use `text-muted-foreground` for descriptions | Use raw greys like `text-gray-500` |
| Use `oklch` values in CSS variables | Hardcode hex colours in components |
