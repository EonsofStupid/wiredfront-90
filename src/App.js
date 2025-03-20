import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Editor from "./pages/Editor";
import Documents from "./pages/Documents";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { ChatProvider } from "@/components/chat/ChatProvider";
import { useAuthStore } from "@/stores/auth";
import { storeLastVisitedPath } from "@/utils/auth";
import { EditorModeProvider } from "@/components/editor/providers/EditorModeProvider";
import { CoreLayout } from "@/core/layout/CoreLayout";
import { APISettings } from "@/components/admin/settings/APISettings";
import { AccessibilitySettings } from "@/components/admin/settings/AccessibilitySettings";
import { NotificationSettings } from "@/components/admin/settings/NotificationSettings";
import { ChatSettings } from "@/components/admin/settings/ChatSettings";
import { LivePreviewSettings } from "@/components/admin/settings/LivePreviewSettings";
import { ChatFeatureSettings } from "@/components/admin/settings/ChatFeatureSettings";
import { GuestCTA } from "@/components/auth/GuestCTA";
import Settings from "./pages/Settings";
import { DraggableChat } from "@/components/chat/DraggableChat";
import { AdminTopNavOverlay } from "@/components/admin/navigation/AdminTopNavOverlay";
import FeatureFlagsPage from "./pages/admin/FeatureFlagsPage";
import MetricsOverview from "./pages/admin/MetricsOverview";
import GitHubCallback from "./pages/github-callback";
import { RAGKeysSettings } from "@/components/admin/settings/api/RAGKeysSettings";
import { APIKeyManagement } from "@/components/admin/settings/api/APIKeyManagement";
import { CustomerManagementPanel } from "@/components/admin/customers/CustomerManagementPanel";
import { FeatureManagementPanel } from "@/components/admin/features/FeatureManagementPanel";
import { UsageMonitoringPanel } from "@/components/admin/analytics/UsageMonitoringPanel";
import { SubscriptionManagementPanel } from "@/components/admin/subscriptions/SubscriptionManagementPanel";
import { EnhancedSystemSettingsPanel } from "@/components/admin/settings/EnhancedSystemSettingsPanel";
import SystemLogsPage from "./pages/admin/SystemLogs";
import NavigationLogsPage from "./pages/admin/NavigationLogs";
import MobileExperience from "./mobile";
import { RouteLoggingService } from "./services/navigation/RouteLoggingService";
const PROTECTED_ROUTES = [
    '/dashboard',
    '/editor',
    '/documents',
    '/ai',
    '/analytics',
    '/gallery',
    '/training',
    '/settings',
    '/admin'
];
const ADMIN_ROUTES = [
    '/admin',
    '/admin/dashboard',
    '/admin/metrics-overview',
    '/admin/settings/api',
    '/admin/settings/accessibility',
    '/admin/settings/notifications',
    '/admin/settings/general',
    '/admin/settings/chat',
    '/admin/settings/chat-features',
    '/admin/settings/live-preview',
    '/admin/settings/feature-flags',
    '/admin/users',
    '/admin/models',
    '/admin/queues',
    '/admin/cache',
    '/admin/activity',
    '/admin/database',
    '/admin/search',
    '/admin/notifications',
    '/admin/customers',
    '/admin/feature-management',
    '/admin/usage-analytics',
    '/admin/subscriptions',
    '/admin/logs/system',
    '/admin/logs/navigation'
];
const App = () => {
    const { isMobile } = useIsMobile();
    const { user, isAuthenticated, initializeAuth } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        const init = async () => {
            await initializeAuth();
        };
        init();
    }, [initializeAuth]);
    useEffect(() => {
        const handleAuth = async () => {
            const isAdminRoute = ADMIN_ROUTES.some(route => location.pathname.startsWith(route));
            const isProtectedRoute = PROTECTED_ROUTES.some(route => location.pathname === route || location.pathname.startsWith(`${route}/`));
            if (!isAuthenticated && (isProtectedRoute || isAdminRoute)) {
                storeLastVisitedPath(location.pathname);
                navigate("/login");
            }
        };
        handleAuth();
    }, [isAuthenticated, location.pathname, navigate]);
    useEffect(() => {
        const cleanPath = location.pathname + location.search;
        const storedPath = sessionStorage.getItem('currentPath');
        if (storedPath !== cleanPath) {
            RouteLoggingService.logRouteChange(storedPath || 'initial', cleanPath);
            sessionStorage.setItem('currentPath', cleanPath);
        }
    }, [location.pathname, location.search]);
    if (isMobile) {
        return (_jsxs(ChatProvider, { children: [_jsx(MobileExperience, {}), _jsx(Toaster, { position: "top-center" })] }));
    }
    const isPublicRoute = location.pathname === '/login' || location.pathname === '/' || location.pathname === '/github-callback';
    const isAdminRoute = ADMIN_ROUTES.some(route => location.pathname.startsWith(route));
    return (_jsxs(ChatProvider, { children: [isPublicRoute ? (_jsx(AppLayout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Index, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/github-callback", element: _jsx(GitHubCallback, {}) })] }) })) : (_jsxs(CoreLayout, { children: [isAdminRoute && _jsx(AdminTopNavOverlay, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/editor", element: _jsx(EditorModeProvider, { children: _jsx(Editor, {}) }) }), _jsx(Route, { path: "/documents", element: _jsx(Documents, {}) }), _jsx(Route, { path: "/settings", element: _jsx(Settings, {}) }), _jsx(Route, { path: "/gallery", element: _jsx("div", { children: "Gallery" }) }), _jsx(Route, { path: "/training", element: _jsx("div", { children: "Training" }) }), _jsx(Route, { path: "/admin", element: _jsx(MetricsOverview, {}) }), _jsx(Route, { path: "/admin/dashboard", element: _jsx(AdminDashboard, {}) }), _jsx(Route, { path: "/admin/metrics-overview", element: _jsx(MetricsOverview, {}) }), _jsx(Route, { path: "/admin/settings/api", element: _jsx(APISettings, {}) }), _jsx(Route, { path: "/admin/settings/accessibility", element: _jsx(AccessibilitySettings, {}) }), _jsx(Route, { path: "/admin/settings/notifications", element: _jsx(NotificationSettings, {}) }), _jsx(Route, { path: "/admin/settings/general", element: _jsx(EnhancedSystemSettingsPanel, {}) }), _jsx(Route, { path: "/admin/settings/chat", element: _jsx(ChatSettings, {}) }), _jsx(Route, { path: "/admin/settings/chat-features", element: _jsx(ChatFeatureSettings, {}) }), _jsx(Route, { path: "/admin/settings/live-preview", element: _jsx(LivePreviewSettings, {}) }), _jsx(Route, { path: "/admin/settings/feature-flags", element: _jsx(FeatureFlagsPage, {}) }), _jsx(Route, { path: "/admin/logs/system", element: _jsx(SystemLogsPage, {}) }), _jsx(Route, { path: "/admin/logs/navigation", element: _jsx(NavigationLogsPage, {}) }), _jsx(Route, { path: "/admin/users", element: _jsx("div", { children: "Users Management" }) }), _jsx(Route, { path: "/admin/customers", element: _jsx(CustomerManagementPanel, {}) }), _jsx(Route, { path: "/admin/feature-management", element: _jsx(FeatureManagementPanel, {}) }), _jsx(Route, { path: "/admin/usage-analytics", element: _jsx(UsageMonitoringPanel, {}) }), _jsx(Route, { path: "/admin/subscriptions", element: _jsx(SubscriptionManagementPanel, {}) }), _jsx(Route, { path: "/admin/api-keys", element: _jsx(APIKeyManagement, {}) }), _jsx(Route, { path: "/admin/rag-settings", element: _jsx(RAGKeysSettings, {}) }), _jsx(Route, { path: "/admin/prompt-enhancements", element: _jsx("div", { children: "Prompt Enhancement Management" }) }), _jsx(Route, { path: "/admin/projects", element: _jsx("div", { children: "Project Management" }) }), _jsx(Route, { path: "/admin/chat-settings", element: _jsx(ChatSettings, {}) }), _jsx(Route, { path: "/admin/models", element: _jsx("div", { children: "Models Configuration" }) }), _jsx(Route, { path: "/admin/queues", element: _jsx("div", { children: "Queue Management" }) }), _jsx(Route, { path: "/admin/cache", element: _jsx("div", { children: "Cache Control" }) }), _jsx(Route, { path: "/admin/activity", element: _jsx("div", { children: "Activity Logs" }) }), _jsx(Route, { path: "/admin/database", element: _jsx("div", { children: "Database Management" }) }), _jsx(Route, { path: "/admin/search", element: _jsx("div", { children: "Admin Search" }) }), _jsx(Route, { path: "/admin/notifications", element: _jsx("div", { children: "Admin Notifications" }) }), _jsx(Route, { path: "/admin/github-connections", element: _jsx("div", { children: "GitHub Connections" }) })] }), _jsx(GuestCTA, {})] })), _jsx(DraggableChat, {}), _jsx(Toaster, {})] }));
};
export default App;
