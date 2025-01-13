import React, { useEffect } from "react";
import { ChatWindow } from "@/features/chat/ui/ChatWindow";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { toast } from "sonner";

const DraggableChat = () => {
  useEffect(() => {
    // Cleanup function
    return () => {
      // Cleanup any active chat connections or subscriptions
      console.log("Cleaning up DraggableChat component");
    };
  }, []);

  return (
    <ErrorBoundary
      fallback={
        <div className="fixed bottom-4 right-4 p-4 rounded-lg bg-destructive/10 text-destructive">
          Chat encountered an error. Please refresh the page.
        </div>
      }
    >
      <ChatWindow />
    </ErrorBoundary>
  );
};

export { DraggableChat };
export default DraggableChat;