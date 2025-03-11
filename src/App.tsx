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
import { ChatProvider } from "@/components/chat/ChatProvider";
import { useAuthStore } from "@/stores/auth";
import { storeLastVisitedPath } from "@/utils/auth";
import { EditorModeProvider } from "@/components/editor/providers/EditorModeProvider";
import { MainLayout } from "@/components/layout/MainLayout";
import { APISettings } from "@/components/admin/settings/APISettings";
import { AccessibilitySettings } from "@/components/admin/settings/AccessibilitySettings";
import { NotificationSettings } from "@/components/admin/settings/NotificationSettings";
import { GeneralSettings } from "@/components/admin/settings/GeneralSettings";
import { ChatSettings } from "@/components/admin/settings/ChatSettings";
import { LivePreviewSettings } from "@/components/admin/settings/LivePreviewSettings";
import { ChatFeatureSettings } from "@/components/admin/settings/ChatFeatureSettings";
import { GuestCTA } from "@/components/auth/GuestCTA";
import Settings from "./pages/Settings";
import { DraggableChat } from "@/components/chat/DraggableChat";
import FeatureFlagsPage from "./pages/admin/FeatureFlagsPage";

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
  '/admin/settings',
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
  '/admin/security'
];

const App = () => {
  const isMobile = useIsMobile();
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
      const isProtectedRoute = PROTECTED_ROUTES.includes(location.pathname);

      if (!isAuthenticated && (isProtectedRoute || isAdminRoute)) {
        storeLastVisitedPath(location.pathname);
        navigate("/login");
      }
    };
    handleAuth();
  }, [isAuthenticated, location.pathname, navigate]);

  const isPublicRoute = location.pathname === '/login' || location.pathname === '/';
  const isAdminRoute = ADMIN_ROUTES.some(route => location.pathname.startsWith(route));
  
  return (
    <ChatProvider>
      {isPublicRoute ? (
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </AppLayout>
      ) : (
        <CurrentLayout>
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
            
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/settings/api" element={<APISettings />} />
            <Route path="/admin/settings/accessibility" element={<AccessibilitySettings />} />
            <Route path="/admin/settings/notifications" element={<NotificationSettings />} />
            <Route path="/admin/settings/general" element={<GeneralSettings />} />
            <Route path="/admin/settings/chat" element={<ChatSettings />} />
            <Route path="/admin/settings/chat-features" element={<ChatFeatureSettings />} />
            <Route path="/admin/settings/live-preview" element={<LivePreviewSettings />} />
            <Route path="/admin/settings/feature-flags" element={<FeatureFlagsPage />} />
            <Route path="/admin/users" element={<div>Users Management</div>} />
            <Route path="/admin/models" element={<div>Models Configuration</div>} />
            <Route path="/admin/queues" element={<div>Queue Management</div>} />
            <Route path="/admin/cache" element={<div>Cache Control</div>} />
            <Route path="/admin/activity" element={<div>Activity Logs</div>} />
            <Route path="/admin/database" element={<div>Database Management</div>} />
            <Route path="/admin/search" element={<div>Admin Search</div>} />
            <Route path="/admin/notifications" element={<div>Admin Notifications</div>} />
            <Route path="/admin/security" element={<div>Security Settings</div>} />
          </Routes>
          <GuestCTA />
        </CurrentLayout>
      )}
      <DraggableChat />
      <Toaster />
    </ChatProvider>
  );
};

const CurrentLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  
  if (isMobile) return <MobileLayout>{children}</MobileLayout>;
  return <MainLayout>{children}</MainLayout>;
};

export default App;
