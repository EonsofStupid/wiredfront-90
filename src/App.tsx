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
import { ChatProvider } from "@/features/chat/ChatProvider";
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

const App = () => {
  const location = useLocation();
  const { user, loading } = useSession();

  // Store last visited path
  useEffect(() => {
    if (!loading) {  // Only store path after loading is complete
      storeLastVisitedPath(location.pathname);
    }
  }, [location, loading]);

  // Show minimal loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner position="top-right" />
        <Toaster />
        <ChatProvider>
          <MobileLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
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
          </MobileLayout>
        </ChatProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;