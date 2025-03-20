import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CoreLayoutContainer } from "../CoreLayoutContainer";
import { CoreTopBar } from "../CoreTopBar";
import { CoreBottomBar } from "../CoreBottomBar";
import { useUIStore } from "@/stores";
/**
 * Example of a custom layout that uses core components
 * but with a different structure than the default
 */
export function CustomLayout({ children }) {
    const { layout, toggleSidebar } = useUIStore();
    const isCompact = !layout.sidebarExpanded;
    return (_jsxs(CoreLayoutContainer, { children: [_jsx(CoreTopBar, { className: "sticky top-0", isCompact: isCompact, onToggleCompact: toggleSidebar }), _jsx("main", { className: "min-h-[calc(100vh-8rem)] p-8", children: children }), _jsx(CoreBottomBar, { className: "sticky bottom-0" })] }));
}
