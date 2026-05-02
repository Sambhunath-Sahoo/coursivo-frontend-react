import { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { Sidebar, type SidebarConfig } from "./Sidebar";
import { Menu, X } from "lucide-react";

interface DashboardLayoutProps {
  config: SidebarConfig;
  storageKey: string;
}

export function DashboardLayout({ config, storageKey }: DashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(isCollapsed));
  }, [isCollapsed, storageKey]);

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans antialiased">

      {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
      <div className="hidden shrink-0 lg:flex">
        <Sidebar
          config={config}
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed((p: boolean) => !p)}
        />
      </div>

      {/* ── Mobile Sidebar Overlay ──────────────────────────────────────── */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 z-50 w-[220px] shadow-2xl">
            <Sidebar
              config={config}
              isCollapsed={false}
              onToggle={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ── Main Area ───────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Mobile top bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {isMobileSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <Link to="/" className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-sm bg-foreground" />
            <span className="text-sm font-semibold text-foreground">Coursivo</span>
          </Link>

          {/* spacer to center logo */}
          <div className="h-9 w-9" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-muted/20">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
