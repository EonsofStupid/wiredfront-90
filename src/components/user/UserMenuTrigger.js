import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import styles from "./styles/UserMenu.module.css";
const UserMenuTrigger = React.forwardRef((props, ref) => {
    const { className, ...rest } = props;
    return (_jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { ref: ref, variant: "ghost", size: "icon", className: `relative animate-hover-button text-neon-pink hover:text-neon-blue ${className}`, ...rest, children: _jsx(User, { className: "w-5 h-5" }) }) }), _jsx(TooltipContent, { sideOffset: 4, className: styles.userMenuTooltip, children: "Account" })] }));
});
UserMenuTrigger.displayName = "UserMenuTrigger";
export { UserMenuTrigger };
