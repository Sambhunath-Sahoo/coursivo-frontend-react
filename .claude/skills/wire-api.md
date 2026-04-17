Wire a React component or Zustand store to a Coursivo backend API endpoint.

Ask the user for:
1. The API endpoint (method + path, e.g. `GET /api/courses/:id`)
2. The component or store to wire it to
3. Whether state should live in a Zustand store (shared/global) or local `useState` (component-only)
4. The expected request payload and response shape

Then scaffold all three layers:

## 1. Type — `src/types/{domain}.types.ts`

```ts
export interface CourseResponse {
  id: number
  title: string
  description: string
  status: 'DRAFT' | 'PUBLISHED'
  instructorId: number
  createdAt: string
}

export interface CreateCourseRequest {
  title: string
  description: string
}
```

## 2. Service — `src/api/{domain}.service.ts`

```ts
import { http } from '@/api/http'
import type { CourseResponse, CreateCourseRequest } from '@/types/course.types'

export const courseService = {
  getById: (id: number) =>
    http.get<CourseResponse>(`/api/courses/${id}`),

  create: (payload: CreateCourseRequest) =>
    http.post<CourseResponse>('/api/courses', payload),

  list: () =>
    http.get<CourseResponse[]>('/api/courses'),
}
```

## 3a. Zustand Store (global state) — `src/store/{domain}.store.ts`

```ts
import { create } from 'zustand'
import { courseService } from '@/api/course.service'
import type { CourseResponse } from '@/types/course.types'

interface CourseStore {
  courses: CourseResponse[]
  loading: boolean
  error: string | null
  fetchCourses: () => Promise<void>
}

export const useCourseStore = create<CourseStore>((set) => ({
  courses: [],
  loading: false,
  error: null,
  fetchCourses: async () => {
    set({ loading: true, error: null })
    try {
      const courses = await courseService.list()
      set({ courses })
    } catch {
      set({ error: 'Failed to load courses' })
    } finally {
      set({ loading: false })
    }
  },
}))
```

## 3b. Component local state (component-only data)

```tsx
const [data, setData] = useState<CourseResponse | null>(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

useEffect(() => {
  courseService.getById(Number(id))
    .then(setData)
    .catch(() => setError('Failed to load course'))
    .finally(() => setLoading(false))
}, [id])
```

## 4. Component Usage

```tsx
import { useEffect } from 'react'
import { useCourseStore } from '@/store/course.store'
import { toast } from 'sonner'

const { courses, loading, error, fetchCourses } = useCourseStore()

useEffect(() => {
  fetchCourses()
}, [])

// surface errors via toast
useEffect(() => {
  if (error) toast.error(error)
}, [error])
```

## Rules
- Never call `fetch` or raw `axios` in a component — always go through `src/api/*.service.ts`
- Use sonner `toast.error(...)` for user-facing error messages
- Always handle loading and error states visibly
- Use `@/` imports throughout
