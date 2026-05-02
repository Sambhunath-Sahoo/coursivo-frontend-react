# Coursivo Design System — Vercel-Inspired

This document is the **single source of truth** for all UI decisions in the Coursivo frontend. All AI assistants and developers **MUST** strictly follow these patterns when creating, updating, or reviewing components.

---

## Core Aesthetic

- **Style:** Minimalist, monochromatic, developer-focused — inspired by Vercel's design language.
- **Philosophy:** Borders over shadows. Contrast over decoration. Clarity over complexity.
- **Shapes:** Rounded corners via `--radius: 0.5rem`. Use `rounded-md` or `rounded-lg` everywhere.

---

## 1. Color Tokens (OKLCH)

All colors are defined as OKLCH lightness values in `src/index.css`.

### Light Mode
| Token | Value | Purpose |
|---|---|---|
| `--background` | `oklch(1.0000 0 0)` | Page background (`#ffffff`) |
| `--foreground` | `oklch(0.1884 0.0128 248.5103)` | Body text (near-black) |
| `--primary` | `oklch(0.1884 0.0128 248.5103)` | Black buttons, key actions |
| `--muted` | `oklch(0.9222 0.0013 286.3737)` | Subtle backgrounds |
| `--muted-foreground` | `oklch(0.1884 0.0128 248.5103)` | Secondary/helper text |
| `--border` | `oklch(0.9317 0.0118 231.6594)` | All borders |
| `--sidebar` | `oklch(0.9784 0.0011 197.1387)` | Sidebar background (near-white) |
| `--sidebar-foreground` | `oklch(0.1884 0.0128 248.5103)` | Sidebar inactive text (gray-700) |
| `--sidebar-accent` | `oklch(0.9392 0.0166 250.8453)` | Active/hover pill background |
| `--sidebar-accent-foreground` | `oklch(0.1884 0.0128 248.5103)` | Active nav item text (near-black) |
| `--sidebar-border` | `oklch(0.9271 0.0101 238.5177)` | Sidebar separator |

### Dark Mode
| Token | Value | Purpose |
|---|---|---|
| `--background` | `oklch(0 0 0)` | Off-black page bg (`#000000`) |
| `--foreground` | `oklch(0.9328 0.0025 228.7857)` | Body text (near-white) |
| `--primary` | `oklch(0.9328 0.0025 228.7857)` | White buttons |
| `--sidebar` | `oklch(0 0 0)` | Sidebar background (same as page) |
| `--sidebar-foreground` | `oklch(0.9328 0.0025 228.7857)` | Sidebar text |
| `--sidebar-accent` | `oklch(0.1928 0.0331 242.5459)` | Active/hover pill |

---

## 2. Typography

**Font Stack:** `'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
Loaded via Google Fonts in `index.html`.

| Element | Size | Weight | Line Height |
|---|---|---|---|
| Body | `0.875rem` (14px) | `400` (regular) | `1.6` |
| Labels / nav items | `13px` | `400` regular / `500` medium active | `20px` |
| Section headings | `text-lg`–`text-2xl` | `600` (semibold) | `tracking-tight` |
| Page title (h1) | `text-xl`–`text-2xl` | `600` (semibold) | `tracking-tight` |
| Stats numbers | `text-3xl` | `600` (semibold) | `tracking-tight` |
| Small labels | `11px` | `400`–`500` | uppercase, `tracking-widest` |

**Rules:**
- ❌ **Never** use `font-bold` (700) or `font-extrabold` (800) in UI components.
- ✅ **Always** use `font-semibold` (600) for headings and `font-medium` (500) for emphasis.
- ✅ Always pair `font-semibold` headings with `tracking-tight`.
- ✅ Use `text-muted-foreground` for secondary/helper text.

---

## 3. Sidebar

The sidebar uses dedicated `--sidebar-*` CSS tokens (not generic `bg-background`).

```tsx
// Correct sidebar root element
<aside className="bg-sidebar border-r border-sidebar-border ...">

// Nav item — inactive
"text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground font-normal text-[13px]"

// Nav item — active
"bg-sidebar-accent text-sidebar-accent-foreground font-medium text-[13px]"

// Section label
"text-[11px] font-medium text-sidebar-foreground/50 uppercase tracking-widest"

// User avatar (bottom)
<div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 ...">
```

---

## 4. Cards

Vercel cards rely on crisp borders and hover state transitions — no heavy shadows.

```tsx
// Standard card
<Card className="border-border/60 shadow-sm hover:border-border hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">

// Stat card (dashboard)
<Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
```

---

## 5. Buttons

```tsx
// Primary — black button (light) / white button (dark)
<Button className="bg-primary text-primary-foreground font-medium">Action</Button>

// Outline — used for secondary actions
<Button variant="outline" className="font-medium border-border/50 hover:bg-muted/50">...</Button>
```

---

## 6. Reusable Patterns

**Status / Free badge:**
```tsx
<span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-foreground text-background">
  Free
</span>
```

**Section header with action:**
```tsx
<div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
  <div>
    <h2 className="text-lg font-semibold tracking-tight">Title</h2>
    <p className="text-sm text-muted-foreground">Subtitle</p>
  </div>
  <Button variant="outline" size="sm" className="font-medium">Action</Button>
</div>
```

---

## 7. Do's and Don'ts

| ✅ DO | ❌ DON'T |
|---|---|
| Use `font-semibold` + `tracking-tight` for headings | Use `font-bold` or `font-extrabold` |
| Use `lucide-react` for all icons | Use emoji or other icon libraries |
| Use `border-border` everywhere | Use heavy `shadow-lg` or `drop-shadow` |
| Use `bg-sidebar` for the sidebar element | Use `bg-background` inside sidebar |
| Use `text-muted-foreground` for descriptions | Use raw gray colors like `text-gray-500` |
| Use `oklch` values in CSS variables | Hardcode hex colors in components |
