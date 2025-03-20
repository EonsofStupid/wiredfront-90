import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from "react-router-dom";
import { Home, Code, FileText, Bot, Activity, Database, Settings, BookOpen, Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";
/**
 * Mobile navigation menu with navigation items
 */
export const MobileNavigation = ({ onItemClick }) => {
    const location = useLocation();
    const primaryNavItems = [
        { icon: Home, label: "Home", path: "/" },
        { icon: Code, label: "Editor", path: "/editor" },
        { icon: FileText, label: "Documents", path: "/documents" },
        { icon: BookOpen, label: "Training", path: "/training" },
        { icon: Star, label: "Gallery", path: "/gallery" },
    ];
    const secondaryNavItems = [
        { icon: Activity, label: "Analytics", path: "/analytics" },
        { icon: Bot, label: "AI Settings", path: "/ai-settings" },
        { icon: Database, label: "Projects", path: "/projects" },
        { icon: Users, label: "Team", path: "/team" },
        { icon: Settings, label: "Settings", path: "/settings" },
    ];
    const renderNavItems = (items) => {
        return items.map((item) => {
            const isActive = location.pathname === item.path;
            return (_jsxs(Link, { to: item.path, className: cn("flex items-center gap-3 px-4 py-3 rounded-lg", "text-neon-pink hover:text-neon-blue transition-colors", "hover:bg-dark-lighter/30", isActive && "bg-dark-lighter/50 text-neon-blue"), onClick: onItemClick, children: [_jsx(item.icon, { className: "w-5 h-5" }), _jsx("span", { children: item.label })] }, item.path));
        });
    };
    return (_jsxs("nav", { className: "p-4", children: [_jsx("div", { className: "space-y-1", children: renderNavItems(primaryNavItems) }), _jsxs("div", { className: "mt-8 pt-4 border-t border-neon-blue/10", children: [_jsx("p", { className: "px-4 text-xs uppercase text-neon-pink/60 mb-2", children: "System" }), _jsx("div", { className: "space-y-1", children: renderNavItems(secondaryNavItems) })] })] }));
};
