import type { SidebarConfig } from "@/components/layout/Sidebar";
import {
  LayoutDashboard,
  BookOpen,
  PlayCircle,
  BarChart2,
  Settings,
  PlusSquare,
} from "lucide-react";

export const studentSidebarConfig: SidebarConfig = {
  mainNavItems: {
    title: "Student",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "My Courses", href: "/my-courses", icon: BookOpen },
    ],
  },
  bottomNavItems: [],
};

export const instructorSidebarConfig: SidebarConfig = {
  mainNavItems: {
    title: "Educator",
    items: [
      {
        name: "Dashboard",
        href: "/instructor/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "My Courses",
        href: "/instructor/courses",
        icon: PlayCircle,
      },
      {
        name: "Create Course",
        href: "/instructor/courses/create",
        icon: PlusSquare,
      },
    ],
  },
  contentSection: {
    title: "Insights",
    items: [
      {
        name: "Analytics",
        href: "/instructor/analytics",
        icon: BarChart2,
      },
    ],
  },
  bottomNavItems: [
    {
      name: "Settings",
      href: "/instructor/settings",
      icon: Settings,
    },
  ],
};
