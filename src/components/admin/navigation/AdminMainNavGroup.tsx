
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
    <NavigationMenu>
      <NavigationMenuList className={cn(
        "flex",
        isCollapsed ? "flex-wrap gap-1" : "flex-row items-center gap-2"
      )}>
        {adminNavItems.map((item) => (
          <NavigationMenuItem key={item.name}>
            <NavigationMenuLink
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                isCollapsed ? "justify-center w-10 h-10" : "justify-start"
              )}
              href={item.href}
              asChild
            >
              <a className="flex items-center">
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
