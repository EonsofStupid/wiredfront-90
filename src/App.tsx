import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Editor from "./pages/Editor";
import Documents from "./pages/Documents";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { ChatProvider } from "@/features/chat/ChatProvider";
import { useAuthStore } from "@/stores/auth";
import { storeLastVisitedPath } from "@/utils/auth";
import { EditorModeProvider } from "@/features/chat/core/providers/EditorModeProvider";
import { MainLayout } from "@/components/layout/MainLayout";
import { APISettings } from "@/components/admin/settings/APISettings";
import { AccessibilitySettings } from "@/components/admin/settings/AccessibilitySettings";
import { NotificationSettings } from "@/components/admin/settings/NotificationSettings";
import { GeneralSettings } from "@/components/admin/settings/GeneralSettings";
import { ChatSettings } from "@/components/admin/settings/ChatSettings";
import { LivePreviewSettings } from "@/components/admin/settings/LivePreviewSettings";
import { RoleGate } from "@/components/auth/RoleGate";
import { GuestCTA } from "@/components/auth/GuestCTA";
import { useRoleStore } from "@/stores/role";

const PROTECTED_ROUTES = [
  '/dashboard', 
  '/editor', 
  '/documents', 
  '/ai', 
  '/analytics'
];

const ADMIN_ROUTES = [
  '/admin',
  '/admin/settings',
  '/admin/settings/api',
  '/admin/settings/accessibility',
  '/admin/settings/notifications',
  '/admin/settings/general',
  '/admin/settings/chat',
  '/admin/settings/live-preview',
  '/admin/users',
  '/admin/models',
  '/admin/queues',
  '/admin/cache',
  '/admin/activity',
  '/admin/database'
];

const DEVELOPER_ROUTES = [
  '/editor',
  '/documents',
  '/ai'
];

const App = () => {
  const isMobile = useIsMobile();
  const { user, isAuthenticated, initializeAuth } = useAuthStore();
  const { checkUserRole } = useRoleStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    
    const init = async () => {
      cleanup = await initializeAuth();
      if (user?.id) {
        await checkUserRole(user.id);
      }
    };

    init();

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [initializeAuth, user?.id, checkUserRole]);

  useEffect(() => {
    const handleAuth = async () => {
      const isAdminRoute = ADMIN_ROUTES.includes(location.pathname);
      const isProtectedRoute = PROTECTED_ROUTES.includes(location.pathname);
      const isDeveloperRoute = DEVELOPER_ROUTES.includes(location.pathname);

      if (!isAuthenticated && (isProtectedRoute || isAdminRoute || isDeveloperRoute)) {
        storeLastVisitedPath(location.pathname);
        navigate("/login");
        return;
      }
    };
    handleAuth();
  }, [isAuthenticated, location.pathname, navigate]);

  // If we're on the login page or index page, don't show the main layout
  const isPublicRoute = location.pathname === '/login' || location.pathname === '/';
  
  if (isPublicRoute) {
    return (
      <ChatProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </AppLayout>
        <Toaster />
      </ChatProvider>
    );
  }

  const Layout = isMobile ? MobileLayout : MainLayout;

  return (
    <ChatProvider>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route 
            path="/editor" 
            element={
              <RoleGate allowedRoles={['developer', 'admin', 'super_admin']}>
                <EditorModeProvider>
                  <Editor />
                </EditorModeProvider>
              </RoleGate>
            } 
          />
          <Route 
            path="/documents" 
            element={
              <RoleGate allowedRoles={['developer', 'admin', 'super_admin']}>
                <Documents />
              </RoleGate>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin/*" 
            element={
              <RoleGate allowedRoles={['admin', 'super_admin']}>
                <Routes>
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="settings/api" element={<APISettings />} />
                  <Route path="settings/accessibility" element={<AccessibilitySettings />} />
                  <Route path="settings/notifications" element={<NotificationSettings />} />
                  <Route path="settings/general" element={<GeneralSettings />} />
                  <Route path="settings/chat" element={<ChatSettings />} />
                  <Route path="settings/live-preview" element={<LivePreviewSettings />} />
                  <Route path="users" element={<div>Users Management</div>} />
                  <Route path="models" element={<div>Models Configuration</div>} />
                  <Route path="queues" element={<div>Queue Management</div>} />
                  <Route path="cache" element={<div>Cache Control</div>} />
                  <Route path="activity" element={<div>Activity Logs</div>} />
                  <Route path="database" element={<div>Database Management</div>} />
                </Routes>
              </RoleGate>
            } 
          />
        </Routes>
        <GuestCTA />
      </Layout>
      <Toaster />
    </ChatProvider>
  );
};

export default App;