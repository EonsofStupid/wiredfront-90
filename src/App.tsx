import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { MobileLayout } from "./components/layout/MobileLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import { DraggableChat } from "@/components/chat/DraggableChat";
import { useSession } from "@/hooks/useSession";
import { storeLastVisitedPath } from "@/utils/auth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate(`/login?returnTo=${encodeURIComponent(location.pathname)}`, { replace: true });
    }
  }, [user, loading, location, navigate]);

  if (loading) return null;
  return user ? <>{children}</> : null;
};

const App = () => {
  const location = useLocation();
  const { user, loading } = useSession();

  // Store last visited path
  useEffect(() => {
    storeLastVisitedPath(location.pathname);
  }, [location]);

  if (loading) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner position="top-right" />
        <Toaster />
        <MobileLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/editor" element={<div>Editor Page</div>} />
            <Route path="/documents" element={<div>Documents Page</div>} />
            <Route path="/ai" element={<div>AI Assistant Page</div>} />
            <Route path="/analytics" element={<div>Analytics Page</div>} />
            <Route path="/reports" element={<div>Reports Page</div>} />
            <Route path="/data" element={<div>Data Page</div>} />
            <Route 
              path="/settings/*" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route path="/search" element={<div>Search Page</div>} />
            <Route path="/notifications" element={<div>Notifications Page</div>} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <div>Profile Page</div>
                </ProtectedRoute>
              } 
            />
            <Route path="/login" element={<Login />} />
          </Routes>
          {user && <DraggableChat />}
        </MobileLayout>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;