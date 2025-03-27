
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";
import { useSessionManager } from '@/hooks/useSessionManager';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';

export function SessionActions() {
  const { sessions, currentSessionId, clearSessions, refreshSessions } = useSessionManager();
  const [isDeleteOthersDialogOpen, setIsDeleteOthersDialogOpen] = React.useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = React.useState(false);

  // Get active sessions count (excluding current)
  const activeSessionsCount = sessions.filter(
    s => s.is_active && s.id !== currentSessionId
  ).length;

  const handleDeleteOthers = async () => {
    try {
      setIsDeleteOthersDialogOpen(false);
      
      if (!currentSessionId) {
        toast.error("No active session found");
        return;
      }
      
      await clearSessions(true); // Keep current session
      await refreshSessions();
      
      toast.success("Other sessions deleted successfully");
    } catch (error) {
      logger.error("Failed to delete other sessions", { error });
      toast.error("Failed to delete other sessions");
    }
  };

  const handleDeleteAll = async () => {
    try {
      setIsDeleteAllDialogOpen(false);
      await clearSessions(false); // Don't preserve any sessions
      await refreshSessions();
      
      toast.success("All sessions deleted successfully");
    } catch (error) {
      logger.error("Failed to delete all sessions", { error });
      toast.error("Failed to delete all sessions");
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-4">
      <Button 
        variant="outline" 
        className="flex justify-between w-full"
        onClick={() => setIsDeleteOthersDialogOpen(true)}
        disabled={activeSessionsCount === 0}
      >
        <span>Delete Other Sessions</span>
        <Trash2 className="h-4 w-4 ml-2" />
      </Button>
      
      <Button 
        variant="destructive" 
        className="flex justify-between w-full"
        onClick={() => setIsDeleteAllDialogOpen(true)}
      >
        <span>Delete All Sessions</span>
        <X className="h-4 w-4 ml-2" />
      </Button>

      <DeleteConfirmDialog
        isOpen={isDeleteOthersDialogOpen}
        onClose={() => setIsDeleteOthersDialogOpen(false)}
        onConfirm={handleDeleteOthers}
        title="Delete Other Sessions"
        description="This will permanently delete all active sessions except the current one. Archived sessions will not be affected. This action cannot be undone."
        confirmLabel="Delete Other Sessions"
      />

      <DeleteConfirmDialog
        isOpen={isDeleteAllDialogOpen}
        onClose={() => setIsDeleteAllDialogOpen(false)}
        onConfirm={handleDeleteAll}
        title="Delete All Sessions"
        description="This will permanently delete ALL chat sessions, including archived ones. This action cannot be undone."
        confirmLabel="Delete All Sessions"
        destructive
      />
    </div>
  );
}
