# Folder Structure

This document describes the folder structure of the Coursivo frontend application.

## Source Structure (`src/`)

```
src/
├── components/          # Reusable React components
│   └── ui/             # shadcn/ui components (add via: npx shadcn@latest add [component])
├── hooks/              # Custom React hooks
├── layouts/            # Layout components (headers, footers, sidebars)
├── pages/              # Page-level components/routes
├── contexts/           # React Context providers
├── store/              # State management (Redux, Zustand, etc.)
├── services/           # API services and external integrations
├── utils/              # Utility functions
├── lib/                # Library code (e.g., utils.ts for shadcn)
├── types/              # TypeScript type definitions
├── constants/          # Application constants
└── assets/             # Static assets (images, icons, etc.)
```

## Usage

### Adding shadcn/ui Components

To add shadcn/ui components, use:
```bash
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
```

### Path Aliases

The project uses path aliases for cleaner imports:
- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/hooks` → `src/hooks`
- `@/utils` → `src/utils`
- `@/types` → `src/types`

Example:
```typescript
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCustomHook } from '@/hooks/useCustomHook'
```

