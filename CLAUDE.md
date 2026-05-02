# Coursivo Frontend

React 19 + TypeScript + Vite frontend for Coursivo — an EdTech platform for educators to sell courses and test series.

## Tech Stack

- **React 19** + **TypeScript** + **Vite 7**
- **Tailwind CSS v3** + **shadcn/ui** (Radix UI primitives)
- **Design System**: "Editorial Scholar" (High-contrast, minimalist, OKLCH colors)
- **Redux Toolkit v2** + **React Redux v9** for state management
- **React Router v7** for routing
- **next-themes** for dark/light mode toggle
- **lucide-react** for icons
- **sonner** for toast notifications
- **@dnd-kit** for drag-and-drop
- **Prettier** for code formatting

## Project Structure

```
src/
├── api/             # API service layer (auth.service.ts, course.service.ts, http.ts)
├── components/
│   ├── ui/          # shadcn/ui components — never modify these manually
│   ├── layout/      # Navbar, Sidebar, DashboardLayout, StudentLayout, InstructorLayout
│   └── startup/     # App startup components (ServerAwakener)
├── pages/           # Page-level route components
│   ├── auth/        # SignIn, SignUp
│   ├── instructor/  # InstructorDashboard, CourseBuilder
│   └── ...
├── store/           # Redux Toolkit store (store.ts, auth.slice.ts, hooks.ts, auth.store.ts re-export)
├── lib/             # utils.ts (cn()), jwt.ts, storage.ts, user-utils.ts
├── types/           # TypeScript interfaces (auth.types.ts, course.types.ts)
└── config/          # App configuration (sidebar.config.ts)
```

## Running Locally

```bash
npm install
npm run dev       # starts on port 5173
npm run build     # type-check + build
npm run lint      # ESLint
npm run format    # Prettier
```

## Path Aliases

`@/` maps to `src/` — use for all internal imports.

```ts
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
```

## Related Project

Backend: `../coursivo-backend` — Spring Boot 4.0 REST API running on port 8080

## Rules

- [Design System](.claude/rules/design-system.md)
- [Component Guidelines](.claude/rules/components.md)
- [Code Style & Standards](.claude/rules/code-style.md)
- [Folder Structure](.claude/rules/folder-structure.md)

## Response Format

Always end each response with a **## Summary** section listing what was accomplished.
