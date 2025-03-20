import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useIsMobile } from "@/hooks/use-mobile";
import { MainLayout } from "./MainLayout";
import { MobileHeader } from "./mobile/MobileHeader";
import { MobileBottomNav } from "./mobile/MobileBottomNav";
import { cn } from "@/lib/utils";
import { CoreLayoutContainer } from "@/core/layout/CoreLayoutContainer";
export const MobileLayout = ({ children }) => {
    const { isMobile, screenSize } = useIsMobile();
    if (!isMobile) {
        return _jsx(MainLayout, { children: children });
    }
    return (_jsxs(CoreLayoutContainer, { children: [_jsx(MobileHeader, {}), _jsx("main", { className: cn("flex-1 transition-all duration-300 ease-in-out", "pt-16 pb-16", // Account for header and bottom nav
                "overflow-y-auto", 
                // Add padding based on screen size
                screenSize === 'xs' ? 'px-4' : 'px-6'), children: children }), _jsx(MobileBottomNav, {})] }));
};
