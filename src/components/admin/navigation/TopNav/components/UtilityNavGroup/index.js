import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui";
import { utilityNavItems } from "../../constants/navConfig";
import styles from "./styles.module.css";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export const UtilityNavGroup = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { layout, toggleAdminIconOnly } = useUIStore();
    const { adminIconOnly } = layout;
    return (_jsxs("div", { className: styles.utilityNavGroup, children: [utilityNavItems.map((item) => {
                const isActive = location.pathname === item.href ||
                    (item.href !== '/admin' && location.pathname.startsWith(item.href));
                return (_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "icon", onClick: () => navigate(item.href), className: `${styles.navIcon} ${isActive ? styles.navIconActive : ''}`, "aria-label": item.name, children: item.icon }) }), _jsx(TooltipContent, { side: "bottom", className: "admin-tooltip", children: item.name })] }) }, item.name));
            }), _jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "icon", onClick: toggleAdminIconOnly, className: styles.navIcon, "aria-label": adminIconOnly ? "Show labels" : "Hide labels", children: adminIconOnly ? (_jsx(List, { className: "h-5 w-5" })) : (_jsx(LayoutGrid, { className: "h-5 w-5" })) }) }), _jsx(TooltipContent, { side: "bottom", className: "admin-tooltip", children: adminIconOnly ? "Show labels" : "Hide labels" })] }) })] }));
};
