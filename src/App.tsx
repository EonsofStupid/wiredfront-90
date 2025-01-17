import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ChatProvider } from "@/features/chat/ChatProvider";
import { MainLayout } from "@/components/layout/MainLayout";
import { Toaster } from "@/components/ui/sonner";
import { Routes, Route } from "react-router-dom";
import { Settings } from "@/pages/Settings";
import Index from "@/pages/Index";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ChatProvider>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/settings" element={<Settings />} />
              {/* Add other routes here */}
            </Routes>
          </MainLayout>
          <Toaster />
        </ChatProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;