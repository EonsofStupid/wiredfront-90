import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CoreLayoutContainer } from "./CoreLayoutContainer";
import { CoreTopBar } from "./CoreTopBar";
import { CoreLeftSidebar } from "./CoreLeftSidebar";
import { CoreRightSidebar } from "./CoreRightSidebar";
import { CoreBottomBar } from "./CoreBottomBar";
import { CoreMainContent } from "./CoreMainContent";
import { useUIStore } from "@/stores";
/**
 * @name CoreLayout
 * @description The main layout component that combines all core layout elements
 * DO NOT MODIFY THIS COMPONENT
 */
export function CoreLayout({ children }) {
    const { layout, toggleSidebar } = useUIStore();
    const isLeftSidebarCompact = !layout.sidebarExpanded;
    const isRightSidebarVisible = layout.rightSidebarVisible;
    return (_jsxs(CoreLayoutContainer, { children: [_jsx(CoreTopBar, { className: "fixed top-0 left-0 right-0", isCompact: isLeftSidebarCompact, onToggleCompact: toggleSidebar }), _jsxs("div", { className: "flex pt-16 pb-12", children: [_jsx(CoreLeftSidebar, { isCompact: isLeftSidebarCompact, className: "fixed left-0 top-16 bottom-12" }), _jsx(CoreMainContent, { isLeftSidebarCompact: isLeftSidebarCompact, isRightSidebarVisible: isRightSidebarVisible, children: children }), _jsx(CoreRightSidebar, { isCompact: isLeftSidebarCompact, isVisible: isRightSidebarVisible })] }), _jsx(CoreBottomBar, { className: "fixed bottom-0 left-0 right-0" })] }));
}
