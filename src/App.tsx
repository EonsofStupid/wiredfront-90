import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import { initializeTextEffect } from "./utils/textEffect";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    initializeTextEffect();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <TooltipProvider>
          <SidebarProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </AppLayout>
            </BrowserRouter>
          </SidebarProvider>
        </TooltipProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
};

export default App;