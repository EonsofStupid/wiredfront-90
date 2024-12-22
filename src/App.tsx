import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { MobileLayout } from "./components/layout/MobileLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import { supabase } from "@/integrations/supabase/client";
import Login from "./pages/Login";
import { DraggableChat } from "@/components/chat/DraggableChat";
import { useAuthStore } from "@/stores/auth";

// Move QueryClient instance outside component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const { user, setUser, setLoading, loading } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  if (loading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MobileLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route 
                path="/dashboard" 
                element={user ? <Dashboard /> : <Navigate to="/login" replace />} 
              />
              <Route path="/editor" element={<div>Editor Page</div>} />
              <Route path="/documents" element={<div>Documents Page</div>} />
              <Route path="/ai" element={<div>AI Assistant Page</div>} />
              <Route path="/analytics" element={<div>Analytics Page</div>} />
              <Route path="/reports" element={<div>Reports Page</div>} />
              <Route path="/data" element={<div>Data Page</div>} />
              <Route path="/settings/*" element={<Settings />} />
              <Route path="/search" element={<div>Search Page</div>} />
              <Route path="/notifications" element={<div>Notifications Page</div>} />
              <Route path="/profile" element={<div>Profile Page</div>} />
              <Route path="/login" element={<Login />} />
            </Routes>
            <DraggableChat />
          </MobileLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;