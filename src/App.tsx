
import React, { useEffect } from "react";
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
import { ChatModeProvider } from "@/components/chat/providers/ChatModeProvider";
import { AdminTopNavOverlay } from "@/components/admin/navigation/AdminTopNavOverlay";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isEditorPage = location.pathname === '/editor';
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Optional: Redirect to login if not authenticated
  // useEffect(() => {
  //   // Add authentication logic here if needed
  // }, [navigate]);

  return (
    <>
      <ChatProvider>
        <ChatModeProvider isEditorPage={isEditorPage}>
          <Routes>
            <Route path="/" element={<AppLayout><Index /></AppLayout>} />
            <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/editor" element={<AppLayout><Editor /></AppLayout>} />
            <Route path="/documents" element={<AppLayout><Documents /></AppLayout>} />
            <Route path="/admin/*" element={
              <AppLayout>
                {isAdminRoute && <AdminTopNavOverlay />}
                <AdminDashboard />
              </AppLayout>
            } />
          </Routes>
          <Toaster position="top-right" richColors closeButton />
        </ChatModeProvider>
      </ChatProvider>
    </>
  );
}

export default App;
