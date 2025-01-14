import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Editor from "./pages/Editor";
import { ChatProvider } from "@/features/chat/ChatProvider";
import { useAuthStore } from "@/stores/auth";
import { storeLastVisitedPath } from "@/utils/auth";
import { EditorModeProvider } from "@/features/chat/core/providers/EditorModeProvider";
import { toast } from "sonner";

const PROTECTED_ROUTES = ['/dashboard', '/editor', '/documents', '/ai', '/analytics', '/settings'];

const App = () => {
  console.log("App component rendering");
  const isMobile = useIsMobile();
  const { user, loading } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = () => {
      const isProtectedRoute = PROTECTED_ROUTES.some(route => 
        location.pathname.startsWith(route)
      );

      if (!loading && isProtectedRoute && !user) {
        console.log("User not authenticated, redirecting to login");
        storeLastVisitedPath(location.pathname);
        toast.error('Please log in to access this page');
        navigate("/login");
      }
    };

    handleAuth();
  }, [user, loading, location.pathname, navigate]);

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  const Layout = isMobile ? MobileLayout : AppLayout;

  return (
    <ChatProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route 
            path="/editor" 
            element={
              <EditorModeProvider>
                <Editor />
              </EditorModeProvider>
            } 
          />
          <Route path="/documents" element={<div>Documents Page</div>} />
          <Route path="/ai" element={<div>AI Assistant Page</div>} />
          <Route path="/analytics" element={<div>Analytics Page</div>} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>
      <Toaster />
    </ChatProvider>
  );
};

export default App;