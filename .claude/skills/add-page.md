Add a new route and page component to the Coursivo frontend.

Ask the user for:
1. Page name and purpose (e.g. "CourseDetail — shows course info and enrollment button")
2. Route path (e.g. `/courses/:id`)
3. Who can access it (public, STUDENT only, INSTRUCTOR only, any authenticated user)
4. Data the page needs (which API endpoints it calls)
5. Layout wrapper to use (`DashboardLayout`, `StudentLayout`, `InstructorLayout`, or none)

Then scaffold in this order:

## 1. Page Component — `src/pages/{domain}/{PageName}.tsx`

```tsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Course } from '@/types/course.types'

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // fetch via service, not fetch() directly
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-destructive">{error}</p>
    </div>
  )

  return (
    <div className="container-padding mx-auto max-w-7xl">
      {/* page content */}
    </div>
  )
}
```

## 2. Route Registration — `src/App.tsx` (or router config)

Add the route inside the correct layout wrapper and protect it if needed:

```tsx
// Protected route example
<Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
  <Route path="/courses/:id" element={<CourseDetailPage />} />
</Route>
```

## 3. API Call — `src/api/{domain}.service.ts`

Add the service method if it doesn't exist yet. Never call `fetch` directly in the page.

## 4. Types — `src/types/{domain}.types.ts`

Add any new interfaces needed for the page's data shape.

## Rules
- Use `@/` imports — no relative `../../` paths
- Semantic color tokens only — no hardcoded hex colors
- Always show loading, error, and empty states
- Mobile-first layout with `container-padding mx-auto max-w-7xl`
- Follow `.claude/rules/design-system.md` and `.claude/rules/folder-structure.md`
