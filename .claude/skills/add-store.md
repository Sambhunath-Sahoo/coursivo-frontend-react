Add a new Zustand store to the Coursivo frontend.

Ask the user for:
1. Domain name (e.g. "enrollment", "notification", "cart")
2. State shape — what data it holds
3. Actions needed (fetch list, fetch single, create, update, delete, reset)
4. Which API service it calls

Then scaffold:

## Store File — `src/store/{domain}.store.ts`

```ts
import { create } from 'zustand'
import { {domain}Service } from '@/api/{domain}.service'
import type { {Domain}Response, Create{Domain}Request } from '@/types/{domain}.types'

interface {Domain}Store {
  // State
  items: {Domain}Response[]
  selected: {Domain}Response | null
  loading: boolean
  error: string | null

  // Actions
  fetch{Domain}s: () => Promise<void>
  fetch{Domain}ById: (id: number) => Promise<void>
  create{Domain}: (payload: Create{Domain}Request) => Promise<void>
  reset: () => void
}

const initialState = {
  items: [],
  selected: null,
  loading: false,
  error: null,
}

export const use{Domain}Store = create<{Domain}Store>((set) => ({
  ...initialState,

  fetch{Domain}s: async () => {
    set({ loading: true, error: null })
    try {
      const items = await {domain}Service.list()
      set({ items })
    } catch {
      set({ error: 'Failed to load {domain}s' })
    } finally {
      set({ loading: false })
    }
  },

  fetch{Domain}ById: async (id) => {
    set({ loading: true, error: null })
    try {
      const selected = await {domain}Service.getById(id)
      set({ selected })
    } catch {
      set({ error: 'Failed to load {domain}' })
    } finally {
      set({ loading: false })
    }
  },

  create{Domain}: async (payload) => {
    set({ loading: true, error: null })
    try {
      const item = await {domain}Service.create(payload)
      set((state) => ({ items: [...state.items, item] }))
    } catch {
      set({ error: 'Failed to create {domain}' })
    } finally {
      set({ loading: false })
    }
  },

  reset: () => set(initialState),
}))
```

## Selectors (add to store if derived state is needed)

```ts
// Outside the store — co-locate with the store file
export const select{Domain}Count = (state: {Domain}Store) => state.items.length
export const selectPublished{Domain}s = (state: {Domain}Store) =>
  state.items.filter((i) => i.status === 'PUBLISHED')
```

## Usage in Components

```tsx
import { useEffect } from 'react'
import { use{Domain}Store } from '@/store/{domain}.store'
import { toast } from 'sonner'

const { items, loading, error, fetch{Domain}s } = use{Domain}Store()

useEffect(() => { fetch{Domain}s() }, [])
useEffect(() => { if (error) toast.error(error) }, [error])
```

## Rules
- One store per domain — no monolithic global store
- Keep all API calls inside store actions, never in components
- `reset()` action is required — used on logout and route unmount
- Use `set((state) => ...)` for updates that depend on current state
- Follow `.claude/rules/code-style.md` for TypeScript patterns
