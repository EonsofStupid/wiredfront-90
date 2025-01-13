import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ChatWindow } from "@/features/chat/ui/ChatWindow";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { toast } from "sonner";

const LoadingFallback = () => (
  <div className="fixed bottom-4 right-4 p-4 rounded-lg bg-background/80 backdrop-blur">
    <Loader2 className="h-6 w-6 animate-spin" />
  </div>
);

const ErrorFallback = () => (
  <div className="fixed bottom-4 right-4 p-4 rounded-lg bg-destructive/10 backdrop-blur">
    <Button variant="destructive" onClick={() => window.location.reload()}>
      Chat failed to load. Click to retry.
    </Button>
  </div>
);

const DraggableChat = () => {
  React.useEffect(() => {
    return () => {
      // Cleanup on unmount
      toast.dismiss();
    };
  }, []);

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <ChatWindow />
      </Suspense>
    </ErrorBoundary>
  );
};

export { DraggableChat };
export default DraggableChat;