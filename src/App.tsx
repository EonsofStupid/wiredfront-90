import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ChatProvider } from "@/features/chat/ChatProvider";
import { MainLayout } from "@/components/layout/MainLayout";
import { Toaster } from "@/components/ui/sonner";
import { Routes, Route } from "react-router-dom";
import { Settings } from "@/pages/Settings";
import { Dashboard } from "@/pages/Dashboard";
import { Documents } from "@/pages/Documents";
import { Editor } from "@/pages/Editor";
import Index from "@/pages/Index";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ChatProvider>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/editor" element={<Editor />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/analytics" element={<Dashboard />} />
              <Route path="/reports" element={<Dashboard />} />
              <Route path="/data" element={<Dashboard />} />
              <Route path="/ai" element={<Editor />} />
            </Routes>
          </MainLayout>
          <Toaster />
        </ChatProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;