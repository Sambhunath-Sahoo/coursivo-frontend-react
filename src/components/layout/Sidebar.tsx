import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/user-utils";
import { Logo } from "@/components/ui/Logo";
import { useUser, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/auth.slice";
import { toast } from "sonner";
import {
  LogOut,
  MoreVertical,
  ChevronsLeft,
  ChevronsRight,
  Sun,
  Moon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Types for sidebar configuration
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

// Reusable nav item component to avoid repetition
function SidebarNavItem({
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
          "flex items-center gap-2.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
          isCollapsed && "justify-center px-2",
          isActive
            ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
            : "font-normal text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
        )}
      >
        <item.icon
          className={cn(
            "shrink-0",
            isCollapsed ? "h-[18px] w-[18px]" : "h-[15px] w-[15px]",
            isActive
              ? "text-sidebar-accent-foreground"
              : "text-sidebar-foreground/70",
          )}
        />
        {!isCollapsed && <span>{item.name}</span>}
      </Link>
    </li>
  );
}

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
    // Exact match for main dashboard routes
    if (href.endsWith("/dashboard")) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "flex h-screen flex-col overflow-hidden border-r border-sidebar-border bg-sidebar transition-[width] duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-[240px]",
      )}
      style={{ willChange: "width" }}
    >
      {/* Logo / Brand */}
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-sidebar-border",
          isCollapsed ? "justify-center" : "justify-between gap-2 px-4",
        )}
      >
        {!isCollapsed && (
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 overflow-hidden transition-opacity hover:opacity-80"
          >
            <Logo size="sm" className="text-sidebar-accent-foreground" />
          </Link>
        )}
        <button
          onClick={onToggle}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex shrink-0 items-center justify-center rounded-sm text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isCollapsed ? "h-full w-full p-2" : "p-1.5",
          )}
        >
          {isCollapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Main Navigation - scrollable area */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
        {/* Main Items */}
        <ul className="space-y-0.5">
          {config.mainNavItems.items.map((item) => (
            <SidebarNavItem
              key={item.name}
              item={item}
              isCollapsed={isCollapsed}
              isActive={isActive(item.href)}
            />
          ))}
        </ul>

        {/* Content Section - Only show if configured */}
        {config.contentSection && (
          <div className="mt-5">
            {!isCollapsed && config.contentSection.title && (
              <h3 className="mb-1 px-2.5 text-[11px] font-medium uppercase tracking-widest text-sidebar-foreground/50">
                {config.contentSection.title}
              </h3>
            )}
            <ul className="space-y-0.5">
              {config.contentSection.items.map((item) => (
                <SidebarNavItem
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

      {/* Bottom Section */}
      <div className="shrink-0 border-t border-sidebar-border">
        {/* Bottom Navigation Items */}
        {config.bottomNavItems.length > 0 && (
          <ul className="space-y-0.5 border-b border-sidebar-border px-2 pb-1 pt-2">
            {config.bottomNavItems.map((item) => (
              <SidebarNavItem
                key={item.name}
                item={item}
                isCollapsed={isCollapsed}
                isActive={isActive(item.href)}
              />
            ))}
          </ul>
        )}

        {/* User Profile */}
        <div className={cn("p-2", isCollapsed && "px-1")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors",
                  "text-sidebar-foreground hover:bg-sidebar-accent",
                  isCollapsed && "justify-center",
                )}
              >
                {/* Avatar - matches Vercel's colorful circle */}
                <div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-400 to-violet-500">
                  {user?.image ? (
                    <img src={user.image} alt={user.fullName || "User avatar"} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-[10px] font-semibold leading-none text-white">
                      {user?.fullName
                        ? getInitials(user.fullName as string)
                        : "U"}
                    </span>
                  )}
                </div>
                {!isCollapsed && (
                  <>
                    <div className="flex-1 overflow-hidden text-left">
                      <p className="mb-0.5 truncate text-[13px] font-medium leading-none text-sidebar-accent-foreground">
                        {user?.fullName || "User"}
                      </p>
                      <p className="truncate text-[11px] leading-none text-sidebar-foreground/50">
                        {user?.email || ""}
                      </p>
                    </div>
                    <MoreVertical className="h-3.5 w-3.5 shrink-0 text-sidebar-foreground/40" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={isCollapsed ? "center" : "end"}
              side={isCollapsed ? "right" : "top"}
              className="w-56"
            >
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  const root = document.documentElement;
                  const isDark = root.classList.contains("dark");
                  if (isDark) {
                    root.classList.remove("dark");
                    localStorage.setItem("coursivo_theme", "light");
                  } else {
                    root.classList.add("dark");
                    localStorage.setItem("coursivo_theme", "dark");
                  }
                }}
              >
                <Moon className="mr-2 hidden h-4 w-4 dark:block" />
                <Sun className="mr-2 block h-4 w-4 dark:hidden" />
                Toggle Theme
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
}
