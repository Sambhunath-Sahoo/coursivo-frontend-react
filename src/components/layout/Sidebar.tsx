import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/user-utils";
import { useUser, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/auth.slice";
import { toast } from "sonner";
import {
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  ChevronRight,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SidebarItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

export interface SidebarConfig {
  mainNavItems: SidebarSection;
  contentSection?: SidebarSection;
  bottomNavItems: SidebarItem[];
  quickCreateLabel?: string;
  quickCreateHref?: string;
}

// ─── Nav Item ─────────────────────────────────────────────────────────────────

function NavItem({
  item,
  isCollapsed,
  isActive,
}: {
  item: SidebarItem;
  isCollapsed: boolean;
  isActive: boolean;
}) {
  return (
    <li>
      <Link
        to={item.href}
        title={isCollapsed ? item.name : undefined}
        className={cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors duration-150",
          isCollapsed && "justify-center px-0",
          isActive
            ? "border border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground"
            : "border border-transparent text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
        )}
      >
        <item.icon
          strokeWidth={1.75}
          className={cn(
            "shrink-0 transition-colors",
            isCollapsed ? "h-[18px] w-[18px]" : "h-[15px] w-[15px]",
            isActive
              ? "text-sidebar-accent-foreground"
              : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground",
          )}
        />
        {!isCollapsed && <span className="truncate">{item.name}</span>}
        {!isCollapsed && isActive && (
          <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        )}
      </Link>
    </li>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

interface SidebarProps {
  config: SidebarConfig;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ config, isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUser();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/");
  };

  const isActive = (href: string) => {
    if (href.endsWith("/dashboard")) return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-[220px]",
      )}
      style={{ willChange: "width" }}
    >
      {/* ── Brand ──────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-border/50",
          isCollapsed ? "justify-center px-0" : "justify-between px-4",
        )}
      >
        {!isCollapsed && (
          <Link to="/" className="flex items-center gap-2 group transition-transform hover:scale-[1.02]">
            <Logo size="sm" showText={true} />
          </Link>
        )}
        <button
          onClick={onToggle}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex shrink-0 items-center justify-center rounded-lg text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground",
            isCollapsed ? "h-9 w-9" : "h-7 w-7",
          )}
        >
          {isCollapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* ── Nav ────────────────────────────────────────────────────────── */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
        {/* Main Items */}
        {!isCollapsed && config.mainNavItems.title && (
          <p className="eyebrow mb-2 px-3">
            {config.mainNavItems.title}
          </p>
        )}
        <ul className="space-y-0.5">
          {config.mainNavItems.items.map((item) => (
            <NavItem
              key={item.name}
              item={item}
              isCollapsed={isCollapsed}
              isActive={isActive(item.href)}
            />
          ))}
        </ul>

        {/* Content Section */}
        {config.contentSection && (
          <div className="mt-6">
            {!isCollapsed && config.contentSection.title && (
              <p className="eyebrow mb-2 px-3">
                {config.contentSection.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {config.contentSection.items.map((item) => (
                <NavItem
                  key={item.name}
                  item={item}
                  isCollapsed={isCollapsed}
                  isActive={isActive(item.href)}
                />
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* ── Bottom ─────────────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-border/50">
        {/* Bottom nav items */}
        {config.bottomNavItems.length > 0 && (
          <ul className="space-y-0.5 px-2 py-2">
            {config.bottomNavItems.map((item) => (
              <NavItem
                key={item.name}
                item={item}
                isCollapsed={isCollapsed}
                isActive={isActive(item.href)}
              />
            ))}
          </ul>
        )}

        {/* User row */}
        <div className={cn("p-2", isCollapsed && "flex justify-center")}>
          {isCollapsed ? (
            <button
              onClick={handleLogout}
              title="Log out"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2.5 rounded-lg border border-sidebar-border bg-sidebar-accent px-3 py-2">
              {/* Avatar */}
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.fullName || "User avatar"}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] font-semibold leading-none text-background">
                    {user?.fullName ? getInitials(user.fullName as string) : "U"}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="truncate text-[12px] font-semibold leading-tight text-foreground">
                  {user?.fullName || "User"}
                </p>
                <p className="truncate text-[10px] leading-tight text-muted-foreground/70">
                  {user?.email || ""}
                </p>
              </div>

              {/* Logout icon */}
              <button
                onClick={handleLogout}
                title="Log out"
                className="shrink-0 rounded-md p-1 text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
