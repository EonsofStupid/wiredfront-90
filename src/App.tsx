import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ChatProvider } from "@/features/chat/ChatProvider";
import { MainLayout } from "@/components/layout/MainLayout";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ChatProvider>
          <MainLayout />
          <Toaster />
        </ChatProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;