
import {
  BarChart,
  CreditCard,
  Database,
  FileText,
  Flag,
  Folders,
  Key,
  LayoutDashboard,
  Settings,
  Users
} from "lucide-react";
import { AdminNavItem } from "../types";

export const adminMainNavItems: AdminNavItem[] = [
  { name: "Dashboard", href: "/admin", icon: <LayoutDashboard className="h-5 w-5" /> },
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
