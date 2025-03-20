import { jsx as _jsx } from "react/jsx-runtime";
import { BarChart, CreditCard, Database, FileText, Flag, Folders, Key, LayoutDashboard, Settings, Users, Search, Bell, HelpCircle } from "lucide-react";
export const mainNavItems = [
    {
        name: "Dashboard",
        href: "/admin",
        icon: _jsx(LayoutDashboard, { className: "h-5 w-5" })
    },
    {
        name: "Projects",
        href: "/admin/projects",
        icon: _jsx(Folders, { className: "h-5 w-5" })
    },
    {
        name: "Customers",
        href: "/admin/customers",
        icon: _jsx(Users, { className: "h-5 w-5" })
    },
    {
        name: "Subscriptions",
        href: "/admin/subscriptions",
        icon: _jsx(CreditCard, { className: "h-5 w-5" })
    },
    {
        name: "API Keys",
        href: "/admin/api-keys",
        icon: _jsx(Key, { className: "h-5 w-5" })
    },
    {
        name: "Metrics",
        href: "/admin/metrics",
        icon: _jsx(BarChart, { className: "h-5 w-5" })
    },
    {
        name: "Vector DB",
        href: "/admin/vector-database",
        icon: _jsx(Database, { className: "h-5 w-5" })
    },
    {
        name: "System Logs",
        href: "/admin/system-logs",
        icon: _jsx(FileText, { className: "h-5 w-5" })
    },
    {
        name: "Features",
        href: "/admin/features",
        icon: _jsx(Flag, { className: "h-5 w-5" })
    },
    {
        name: "Settings",
        href: "/admin/settings",
        icon: _jsx(Settings, { className: "h-5 w-5" })
    }
];
export const utilityNavItems = [
    {
        name: "Search",
        href: "/admin/search",
        icon: _jsx(Search, { className: "h-5 w-5" })
    },
    {
        name: "Notifications",
        href: "/admin/notifications",
        icon: _jsx(Bell, { className: "h-5 w-5" })
    },
    {
        name: "Help",
        href: "/admin/help",
        icon: _jsx(HelpCircle, { className: "h-5 w-5" })
    }
];
