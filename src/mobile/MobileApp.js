import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { MobileLayout } from "./layout/MobileLayout";
import { MobileHome } from "./screens/MobileHome";
import { MobileEditor } from "./screens/MobileEditor";
import { MobileSettings } from "./screens/MobileSettings";
import { MobileDocuments } from "./screens/MobileDocuments";
import { MobileChat } from "./components/chat/MobileChat";
import { MobileErrorBoundary } from "./components/error/MobileErrorBoundary";
import { MobileGitHubCallback } from "./screens/MobileGitHubCallback";
import { toast } from "sonner";
import { useGitHubConnection } from "@/hooks/github/useGitHubConnection";
/**
 * Primary mobile application component that handles routing
 * and wraps all routes in the mobile-specific layout
 */
export const MobileApp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { checkConnectionStatus } = useGitHubConnection();
    // Handle any route change errors globally
    const handleError = (error) => {
        console.error("Mobile app navigation error:", error);
        toast.error("Navigation error: " + error.message);
    };
    // Handle GitHub callback and other special routes
    useEffect(() => {
        // If we're on the GitHub callback page, verify connection after rendering
        if (location.pathname === "/github-callback") {
            // The callback page will handle the GitHub authentication
            setTimeout(() => {
                checkConnectionStatus();
            }, 1000);
        }
    }, [location.pathname, checkConnectionStatus]);
    return (_jsx(MobileErrorBoundary, { children: _jsxs(MobileLayout, { children: [_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(MobileHome, {}) }), _jsx(Route, { path: "/editor", element: _jsx(MobileEditor, {}) }), _jsx(Route, { path: "/documents", element: _jsx(MobileDocuments, {}) }), _jsx(Route, { path: "/settings", element: _jsx(MobileSettings, {}) }), _jsx(Route, { path: "/github-callback", element: _jsx(MobileGitHubCallback, {}) }), _jsx(Route, { path: "*", element: _jsxs("div", { className: "flex flex-col items-center justify-center py-12", children: [_jsx("h2", { className: "text-lg font-medium text-neon-pink", children: "Page Not Found" }), _jsx("p", { className: "text-sm text-white/70 mt-2", children: "The page you're looking for doesn't exist." })] }) })] }), _jsx(MobileChat, {})] }) }));
};
