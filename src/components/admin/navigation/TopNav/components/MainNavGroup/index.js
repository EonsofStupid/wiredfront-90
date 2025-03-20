import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation } from "react-router-dom";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { mainNavItems } from "../../constants/navConfig";
import styles from "./styles.module.css";
export function MainNavGroup({ isCollapsed }) {
    const location = useLocation();
    return (_jsx(NavigationMenu, { className: styles.mainNavGroup, children: _jsx(NavigationMenuList, { className: cn("flex flex-wrap", isCollapsed ? "gap-1" : "gap-2 items-center"), children: mainNavItems.map((item) => {
                const isActive = location.pathname === item.href ||
                    (item.href !== '/admin' && location.pathname.startsWith(item.href));
                return (_jsx(NavigationMenuItem, { children: _jsx(NavigationMenuLink, { className: cn("group flex items-center rounded-md text-sm font-medium transition-colors", isCollapsed ? styles.navItemIconOnly : styles.navItemWithText, isActive && styles.navItemActive), href: item.href, asChild: true, children: _jsxs("a", { className: "flex items-center", children: [_jsx("span", { className: styles.navItemIcon, children: item.icon }), !isCollapsed && _jsx("span", { className: styles.navItemLabel, children: item.name })] }) }) }, item.name));
            }) }) }));
}
