import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Menu, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileMenuDrawer } from "./MobileMenuDrawer";
import { useUIStore } from "@/stores";
export const MobileHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { toggleRightSidebar } = useUIStore();
    return (_jsxs(_Fragment, { children: [_jsx("header", { className: "fixed top-0 left-0 right-0 h-16 bg-dark-lighter/80 backdrop-blur-md border-b border-neon-blue/20 z-[var(--z-navbar)]", children: _jsxs("div", { className: "flex items-center justify-between px-4 h-full", children: [_jsx(Button, { variant: "ghost", size: "icon", className: "text-neon-pink hover:text-neon-blue", onClick: () => setIsMenuOpen(true), children: _jsx(Menu, { className: "h-5 w-5" }) }), _jsx("h1", { className: "gradient-text text-xl font-bold", children: "wiredFRONT" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "ghost", size: "icon", className: "text-neon-pink hover:text-neon-blue", onClick: () => toggleRightSidebar(), children: _jsx(Search, { className: "h-5 w-5" }) }), _jsx(Button, { variant: "ghost", size: "icon", className: "text-neon-pink hover:text-neon-blue", children: _jsx(Bell, { className: "h-5 w-5" }) })] })] }) }), _jsx(MobileMenuDrawer, { open: isMenuOpen, onOpenChange: setIsMenuOpen })] }));
};
