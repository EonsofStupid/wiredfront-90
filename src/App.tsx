import { UsageMonitoringPanel } from "@/components/admin/analytics/UsageMonitoringPanel";
import { CustomerManagementPanel } from "@/components/admin/customers/CustomerManagementPanel";
import { FeatureManagementPanel } from "@/components/admin/features/FeatureManagementPanel";
import { AdminTopNavOverlay } from "@/components/admin/navigation/AdminTopNavOverlay";
import { APISettings } from "@/components/admin/settings/api/APISettings";
import { AccessibilitySettings } from "@/components/admin/settings/Accessibility/AccessibilitySettings";
import { ChatFeatureSettings } from "@/components/admin/settings/chat/UISettings";
import { ChatSettings } from "@/components/admin/settings/chat/ChatSettingsTabs";
import { EnhancedSystemSettingsPanel } from "@/components/admin/settings/EnhancedSystemSettingsPanel";
import { LivePreviewSettings } from "@/components/admin/settings/LivePreview/LivePreviewSettings";
import { NotificationSettings } from "@/components/admin/settings/Notifications/NotificationSettings";
import { APIKeyManagement } from "@/components/admin/settings/api/APIKeyManagement";
import { RAGKeysSettings } from "@/components/admin/settings/api/RAGKeysSettings";
import { SubscriptionManagementPanel } from "@/components/admin/subscriptions/SubscriptionManagementPanel";
import { GuestCTA } from "@/components/auth/GuestCTA";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { ChatProvider } from "@/components/chat/ChatProvider";
import { EditorModeProvider } from "@/components/editor/providers/EditorModeProvider";
import { AppLayout } from "@/components/layout/AppLayout";
import { CoreLayout } from "@/core/layout/CoreLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthStore } from "@/stores/auth";
import { storeLastVisitedPath } from "@/utils/auth";
import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import MobileExperience from "./mobile";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Editor from "./pages/Editor";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import FeatureFlagsPage from "./pages/admin/FeatureFlagsPage";
import MetricsOverview from "./pages/admin/MetricsOverview";
import NavigationLogsPage from "./pages/admin/NavigationLogs";
import SystemLogsPage from "./pages/admin/SystemLogs";
import GitHubCallback from "./pages/github-callback";
import { RouteLoggingService } from "./services/navigation/RouteLoggingService";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/editor",
  "/documents",
  "/ai",
  "/analytics",
  "/gallery",
  "/training",
  "/settings",
  "/admin",
];

const ADMIN_ROUTES = [
  "/admin",
  "/admin/dashboard",
  "/admin/metrics-overview",
  "/admin/settings/api",
  "/admin/settings/accessibility",
  "/admin/settings/notifications",
  "/admin/settings/general",
  "/admin/settings/chat",
  "/admin/settings/chat-features",
  "/admin/settings/live-preview",
  "/admin/settings/feature-flags",
  "/admin/users",
  "/admin/models",
  "/admin/queues",
  "/admin/cache",
  "/admin/activity",
  "/admin/database",
  "/admin/search",
  "/admin/notifications",
  "/admin/customers",
  "/admin/feature-management",
  "/admin/usage-analytics",
  "/admin/subscriptions",
  "/admin/logs/system",
  "/admin/logs/navigation",
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
      const isAdminRoute = ADMIN_ROUTES.some((route) =>
        location.pathname.startsWith(route)
      );
      const isProtectedRoute = PROTECTED_ROUTES.some(
        (route) =>
          location.pathname === route ||
          location.pathname.startsWith(`${route}/`)
      );

      if (!isAuthenticated && (isProtectedRoute || isAdminRoute)) {
        storeLastVisitedPath(location.pathname);
        navigate("/login");
      }
    };
    handleAuth();
  }, [isAuthenticated, location.pathname, navigate]);

  useEffect(() => {
    const cleanPath = location.pathname + location.search;
    const storedPath = sessionStorage.getItem("currentPath");

    if (storedPath !== cleanPath) {
      RouteLoggingService.logRouteChange(storedPath || "initial", cleanPath);
      sessionStorage.setItem("currentPath", cleanPath);
    }
  }, [location.pathname, location.search]);

  if (isMobile) {
    return (
      <ChatProvider>
        <MobileExperience />
        <Toaster position="top-center" />
      </ChatProvider>
    );
  }

  const isPublicRoute =
    location.pathname === "/login" ||
    location.pathname === "/" ||
    location.pathname === "/github-callback";
  const isAdminRoute = ADMIN_ROUTES.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <ChatProvider>
      {isPublicRoute ? (
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/github-callback" element={<GitHubCallback />} />
          </Routes>
        </AppLayout>
      ) : (
        <CoreLayout>
          {isAdminRoute && <AdminTopNavOverlay />}
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/editor"
              element={
                <EditorModeProvider>
                  <Editor />
                </EditorModeProvider>
              }
            />
            <Route path="/documents" element={<Documents />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/gallery" element={<div>Gallery</div>} />
            <Route path="/training" element={<div>Training</div>} />

            {/* Admin routes */}
            <Route path="/admin" element={<MetricsOverview />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
              path="/admin/metrics-overview"
              element={<MetricsOverview />}
            />
            <Route path="/admin/settings/api" element={<APISettings />} />
            <Route
              path="/admin/settings/accessibility"
              element={<AccessibilitySettings />}
            />
            <Route
              path="/admin/settings/notifications"
              element={<NotificationSettings />}
            />
            <Route
              path="/admin/settings/general"
              element={<EnhancedSystemSettingsPanel />}
            />
            <Route path="/admin/settings/chat" element={<ChatSettings />} />
            <Route
              path="/admin/settings/chat-features"
              element={<ChatFeatureSettings />}
            />
            <Route
              path="/admin/settings/live-preview"
              element={<LivePreviewSettings />}
            />
            <Route
              path="/admin/settings/feature-flags"
              element={<FeatureFlagsPage />}
            />
            <Route path="/admin/logs/system" element={<SystemLogsPage />} />
            <Route
              path="/admin/logs/navigation"
              element={<NavigationLogsPage />}
            />
            <Route path="/admin/users" element={<div>Users Management</div>} />
            <Route
              path="/admin/customers"
              element={<CustomerManagementPanel />}
            />
            <Route
              path="/admin/feature-management"
              element={<FeatureManagementPanel />}
            />
            <Route
              path="/admin/usage-analytics"
              element={<UsageMonitoringPanel />}
            />
            <Route
              path="/admin/subscriptions"
              element={<SubscriptionManagementPanel />}
            />
            <Route path="/admin/api-keys" element={<APIKeyManagement />} />
            <Route path="/admin/rag-settings" element={<RAGKeysSettings />} />
            <Route
              path="/admin/prompt-enhancements"
              element={<div>Prompt Enhancement Management</div>}
            />
            <Route
              path="/admin/projects"
              element={<div>Project Management</div>}
            />
            <Route path="/admin/chat-settings" element={<ChatSettings />} />
            <Route
              path="/admin/models"
              element={<div>Models Configuration</div>}
            />
            <Route path="/admin/queues" element={<div>Queue Management</div>} />
            <Route path="/admin/cache" element={<div>Cache Control</div>} />
            <Route path="/admin/activity" element={<div>Activity Logs</div>} />
            <Route
              path="/admin/database"
              element={<div>Database Management</div>}
            />
            <Route path="/admin/search" element={<div>Admin Search</div>} />
            <Route
              path="/admin/notifications"
              element={<div>Admin Notifications</div>}
            />
            <Route
              path="/admin/github-connections"
              element={<div>GitHub Connections</div>}
            />
          </Routes>
          <GuestCTA />
        </CoreLayout>
      )}
      <ChatContainer />
      <Toaster />
    </ChatProvider>
  );
};

export default App;
