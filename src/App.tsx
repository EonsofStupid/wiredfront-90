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

const PROTECTED_ROUTES = [
  '/dashboard', 
  '/editor', 
  '/documents', 
  '/ai', 
  '/analytics',
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

const App = () => {
  const isMobile = useIsMobile();
  const { user, isAuthenticated, initializeAuth } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    
    const init = async () => {
      cleanup = await initializeAuth();
    };

    init();

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [initializeAuth]);

  useEffect(() => {
    const handleAuth = () => {
      const isProtectedRoute = PROTECTED_ROUTES.includes(location.pathname);
      if (!isAuthenticated && isProtectedRoute) {
        storeLastVisitedPath(location.pathname);
        navigate("/login");
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
          <Route path="/editor" element={
            <EditorModeProvider>
              <Editor />
            </EditorModeProvider>
          } />
          <Route path="/documents" element={<Documents />} />
          <Route path="/ai" element={<div>AI Assistant Page</div>} />
          <Route path="/analytics" element={<div>Analytics Page</div>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/settings/api" element={<APISettings />} />
          <Route path="/admin/settings/accessibility" element={<AccessibilitySettings />} />
          <Route path="/admin/settings/notifications" element={<NotificationSettings />} />
          <Route path="/admin/settings/general" element={<GeneralSettings />} />
          <Route path="/admin/settings/chat" element={<ChatSettings />} />
          <Route path="/admin/settings/live-preview" element={<LivePreviewSettings />} />
          <Route path="/admin/users" element={<div>Users Management</div>} />
          <Route path="/admin/models" element={<div>Models Configuration</div>} />
          <Route path="/admin/queues" element={<div>Queue Management</div>} />
          <Route path="/admin/cache" element={<div>Cache Control</div>} />
          <Route path="/admin/activity" element={<div>Activity Logs</div>} />
          <Route path="/admin/database" element={<div>Database Management</div>} />
        </Routes>
      </Layout>
      <Toaster />
    </ChatProvider>
  );
};

export default App;
