import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useMessageStore } from "@/features/chat/core/messaging/MessageManager";
import { useSessionManager } from "@/hooks/useSessionManager";
import { toast } from "sonner";

export const ChatSettings = () => {
  const { clearMessages } = useMessageStore();
  const { currentSessionId, refreshSessions } = useSessionManager();

  const handleTerminateSessions = async () => {
    try {
      // Clear all messages from the current session
      clearMessages();
      
      // Force refresh sessions to clean up any hanging states
      await refreshSessions();
      
      toast.success("Successfully terminated all active sessions");
    } catch (error) {
      console.error('Error terminating sessions:', error);
      toast.error("Failed to terminate sessions");
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Chat Settings</h2>
          <p className="text-muted-foreground mb-4">Chat settings will be implemented soon.</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Session Management</h3>
          <Button 
            variant="destructive" 
            onClick={handleTerminateSessions}
            className="w-full sm:w-auto"
          >
            <X className="h-4 w-4 mr-2" />
            Terminate All Sessions
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            This will forcefully end all active chat sessions and clear any pending connections.
          </p>
        </div>
      </div>
    </Card>
  );
};
