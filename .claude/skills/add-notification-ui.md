Add the notification bell icon, dropdown, and polling service to the Coursivo frontend.

Ask the user:
1. Is the `NotificationBell` component being added for the first time, or updating an existing one?
2. Should clicking a notification item navigate somewhere (e.g. to the course)?

Then scaffold in this order:

## 1. Types — `src/types/notification.types.ts`

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

## 2. Service — `src/api/notification.service.ts`

```ts
import { http } from '@/api/http';
import type { NotificationItem } from '@/types/notification.types';

export const notificationService = {
  getAll: () => http.get<NotificationItem[]>('/api/notifications'),
  getUnreadCount: () => http.get<{ count: number }>('/api/notifications/unread-count'),
  markAllRead: () => http.post<void>('/api/notifications/mark-all-read'),
};
```

## 3. Component — `src/components/NotificationBell.tsx`

```tsx
import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { notificationService } from '@/api/notification.service';
import type { NotificationItem } from '@/types/notification.types';
import { useAuthStore } from '@/store/auth.store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function NotificationBell() {
  const { user } = useAuthStore();
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Poll unread count every 30 seconds
  useEffect(() => {
    if (!user) return;
    const fetchCount = () =>
      notificationService.getUnreadCount()
        .then(res => setCount(res.data.count))
        .catch(() => {});  // silent — don't toast on poll failure

    fetchCount();
    const id = setInterval(fetchCount, 30_000);
    return () => clearInterval(id);
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleToggle = async () => {
    const next = !open;
    setOpen(next);
    if (next && notifications.length === 0) {
      setLoading(true);
      try {
        const res = await notificationService.getAll();
        setNotifications(res.data);
      } catch {
        // show error inside dropdown, not toast
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {
      toast.error('Failed to mark notifications as read');
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={handleToggle}
        aria-label={count > 0 ? `${count} unread notifications` : 'Notifications'}
        className="relative p-2 rounded-full hover:bg-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-xl shadow-lg z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {count > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-border">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Bell className="h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  className={cn(
                    'px-4 py-3',
                    !n.isRead && 'bg-blue-50 dark:bg-blue-950/20'
                  )}
                >
                  <p className="text-sm font-medium text-foreground leading-tight">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

## 4. Mount in Navbar — `src/components/layout/Navbar.tsx`

Find the right-side action area (near ThemeToggle) and add:

```tsx
import { NotificationBell } from '@/components/NotificationBell';

// Inside the navbar JSX, next to ThemeToggle:
<NotificationBell />
<ThemeToggle />
```

## Rules
- Follow `.claude/rules/notification-patterns.md` for all behavior decisions
- Only authenticated users see the bell (`if (!user) return null`)
- Poll every 30s for count — only fetch full list when dropdown opens
- Silent catch on poll errors — toast only on user-initiated action failures
- Use semantic color tokens — no hardcoded colors
- Close on outside click via `ref` + `mousedown` listener with cleanup
