import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MainLayout } from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import { supabase } from "@/integrations/supabase/client";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
  }, []);

  if (loading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MainLayout>
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
          </MainLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
