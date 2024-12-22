import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { MobileLayout } from "./components/layout/MobileLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import { supabase } from "@/integrations/supabase/client";
import Login from "./pages/Login";
import { DraggableChat } from "@/components/chat/DraggableChat";
import { useAuthStore } from "@/stores/auth";
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
  const { user, loading } = useAuthStore();
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
  const { user, setUser, setLoading } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error('Auth initialization error:', error);
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user && location.pathname === '/login') {
        const returnTo = new URLSearchParams(location.search).get('returnTo');
        navigate(returnTo || '/dashboard', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading, location, navigate]);

  // Store last visited path
  useEffect(() => {
    storeLastVisitedPath(location.pathname);
  }, [location]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
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
          <DraggableChat />
        </MobileLayout>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;