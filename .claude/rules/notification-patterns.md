# Notification UI Patterns

## The Two Notification Surfaces

| Surface | Component | When to use |
|---|---|---|
| **Bell icon + dropdown** | `NotificationBell` | Persistent, reads from DB via REST poll |
| **Toast** | `sonner` (`toast.error`, `toast.success`) | Transient, triggered by the current user action |

**Rule:** Never use a toast for something that should persist. Never use the bell for something transient.

Examples:
- Enrollment confirmation → **Bell** (persists; student should see it later)
- Form save failed → **Toast** (transient; just feedback for this action)
- Course published → **Bell** (instructor should see it after refresh)
- Network error → **Toast** (no need to persist)

## NotificationBell Component

Lives at `src/components/NotificationBell.tsx`.

Required behavior:
- Shows a bell icon (`<Bell />` from lucide-react)
- Red badge displays the unread count — `9+` when count > 9
- Clicking opens a dropdown list of notifications
- "Mark all read" button in dropdown header resets count to 0
- Only renders for authenticated users (`user` from `useAuthStore`)

Polling:
- Fetch unread count every **30 seconds** via `setInterval`
- Use `clearInterval` in the `useEffect` cleanup to prevent memory leaks
- Do not poll on every render — mount once

```tsx
useEffect(() => {
  if (!user) return;
  const fetch = () => notificationService.getUnreadCount()
    .then(res => setCount(res.data.count)).catch(() => {});
  fetch();
  const id = setInterval(fetch, 30_000);
  return () => clearInterval(id);
}, [user]);
```

## Notification Dropdown

Structure:
```
┌─────────────────────────────┐
│ Notifications    Mark all   │  ← header row
├─────────────────────────────┤
│ [unread] Title              │  ← blue tint bg
│ Message text                │
├─────────────────────────────┤
│ [read] Title                │  ← plain bg
│ Message text                │
└─────────────────────────────┘
```

Styling rules:
- Dropdown: `w-80`, `shadow-lg`, `rounded-xl`, `border border-border`
- Max height: `max-h-72 overflow-y-auto` — scrollable list
- Unread item: `bg-blue-50 dark:bg-blue-950/20`
- Read item: plain background
- Use `divide-y divide-gray-100 dark:divide-gray-800` between items
- Close on outside click (use a `ref` + `useEffect` with `mousedown` listener, or radix popover)

## Notification Service

Lives at `src/api/notification.service.ts`. All three endpoints must be covered:

```ts
export const notificationService = {
  getAll: () => http.get<NotificationItem[]>('/api/notifications'),
  getUnreadCount: () => http.get<{ count: number }>('/api/notifications/unread-count'),
  markAllRead: () => http.post<void>('/api/notifications/mark-all-read'),
};
```

Never call `fetch` directly in the bell component — always go through this service.

## Notification Types

Define in `src/types/notification.types.ts`:

```ts
export interface NotificationItem {
  id: number;
  type: string;
  title: string;
  message: string;
  referenceId: number | null;
  referenceType: string | null;
  isRead: boolean;
  createdAt: string;
}
```

## Where to Mount NotificationBell

Add it to `src/components/layout/Navbar.tsx` — inside the right-side action cluster, next to `ThemeToggle`.

Only visible when authenticated:
```tsx
{user && <NotificationBell />}
```

## Accessibility

- Bell button must have `aria-label="Notifications"` (icon-only button)
- Badge must use `aria-label="X unread notifications"` or be wrapped in `aria-live="polite"`
- Dropdown must be keyboard-dismissible (Escape closes it)
- When dropdown opens, first focusable item receives focus

## Error Handling

- Polling failures: catch silently (do not show a toast on every 30s poll failure)
- "Mark all read" failure: show `toast.error("Failed to mark notifications as read")`
- Dropdown load failure: show an error message inside the dropdown, not a toast

## What NOT to Do

❌ Do not use WebSockets for notifications — polling every 30s is fine for this app  
❌ Do not show a toast when a notification arrives via polling — just update the badge count  
❌ Do not call `getAll()` on every poll — only call it when the dropdown is opened  
❌ Do not show the bell when the user is not logged in  
❌ Do not animate the bell icon (no shake/bounce animations — design system bans decorative animations)  
❌ Do not put business logic inside the NotificationBell component — all data via service + state
