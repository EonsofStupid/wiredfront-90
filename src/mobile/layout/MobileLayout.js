import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Suspense } from "react";
import { MobileHeader } from "./MobileHeader";
import { MobileBottomNav } from "./MobileBottomNav";
import { MobileMenuProvider } from "../providers/MobileMenuProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { CoreLayoutContainer } from "@/core/layout/CoreLayoutContainer";
/**
 * The primary layout component for the mobile experience
 * Handles the structure of the mobile UI with header, content area, and bottom navigation
 */
export const MobileLayout = ({ children }) => {
    const { screenSize } = useIsMobile();
    return (_jsx(MobileMenuProvider, { children: _jsxs(CoreLayoutContainer, { children: [_jsx(MobileHeader, {}), _jsx("main", { className: cn("flex-1 transition-all duration-300 ease-in-out", "pt-16 pb-16", // Account for header and bottom nav
                    "overflow-y-auto", 
                    // Add padding based on screen size
                    screenSize === 'xs' ? 'px-3' : 'px-4'), children: _jsx(Suspense, { fallback: _jsx("div", { className: "flex justify-center items-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-neon-blue" }) }), children: children }) }), _jsx(MobileBottomNav, {})] }) }));
};
