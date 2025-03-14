import {
  BarChart,
  CreditCard,
  Database,
  FileText,
  Flag,
  Folders,
  Key,
  LayoutDashboard as LucideLayoutDashboard,
  Settings,
  Users
} from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface AdminNavGroupProps {
  isCollapsed: boolean;
}

export function AdminMainNavGroup({ isCollapsed }: AdminNavGroupProps) {
  const adminNavItems = [
    { name: "Dashboard", href: "/admin", icon: <LucideLayoutDashboard className="h-5 w-5" /> },
    { name: "Projects", href: "/admin/projects", icon: <Folders className="h-5 w-5" /> },
    { name: "Customers", href: "/admin/customers", icon: <Users className="h-5 w-5" /> },
    { name: "Subscriptions", href: "/admin/subscriptions", icon: <CreditCard className="h-5 w-5" /> },
    { name: "API Keys", href: "/admin/api-keys", icon: <Key className="h-5 w-5" /> },
    { name: "Metrics", href: "/admin/metrics", icon: <BarChart className="h-5 w-5" /> },
    { name: "Vector DB", href: "/admin/vector-database", icon: <Database className="h-5 w-5" /> },
    { name: "System Logs", href: "/admin/system-logs", icon: <FileText className="h-5 w-5" /> },
    { name: "Features", href: "/admin/features", icon: <Flag className="h-5 w-5" /> },
    { name: "Settings", href: "/admin/settings", icon: <Settings className="h-5 w-5" /> }
  ];

  return (
    <NavigationMenu className="flex flex-col">
      <NavigationMenuList className="flex flex-col gap-1">
        {adminNavItems.map((item) => (
          <NavigationMenuItem key={item.name}>
            <NavigationMenuLink
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                isCollapsed ? "justify-center" : "justify-start"
              )}
              href={item.href}
              asChild
            >
              <a className="flex w-full items-center">
                {item.icon}
                {!isCollapsed && <span className="ml-2">{item.name}</span>}
              </a>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
