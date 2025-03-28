
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";
import { useConversationManager } from '@/hooks/conversation';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';

export function SessionActions() {
  const { activeConversations, currentConversationId, clearConversations, refreshConversations } = useConversationManager();
  const [isDeleteOthersDialogOpen, setIsDeleteOthersDialogOpen] = React.useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = React.useState(false);

  // Get active conversations count (excluding current)
  const activeConversationsCount = activeConversations.filter(
    s => s.id !== currentConversationId
  ).length;

  const handleDeleteOthers = async () => {
    try {
      setIsDeleteOthersDialogOpen(false);
      
      if (!currentConversationId) {
        toast.error("No active conversation found");
        return;
      }
      
      await clearConversations(true); // Keep current conversation
      await refreshConversations();
      
      toast.success("Other conversations deleted successfully");
    } catch (error) {
      logger.error("Failed to delete other conversations", { error });
      toast.error("Failed to delete other conversations");
    }
  };

  const handleDeleteAll = async () => {
    try {
      setIsDeleteAllDialogOpen(false);
      await clearConversations(false); // Don't preserve any conversations
      await refreshConversations();
      
      toast.success("All conversations deleted successfully");
    } catch (error) {
      logger.error("Failed to delete all conversations", { error });
      toast.error("Failed to delete all conversations");
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-4">
      <Button 
        variant="outline" 
        className="flex justify-between w-full"
        onClick={() => setIsDeleteOthersDialogOpen(true)}
        disabled={activeConversationsCount === 0}
      >
        <span>Delete Other Conversations</span>
        <Trash2 className="h-4 w-4 ml-2" />
      </Button>
      
      <Button 
        variant="destructive" 
        className="flex justify-between w-full"
        onClick={() => setIsDeleteAllDialogOpen(true)}
      >
        <span>Delete All Conversations</span>
        <X className="h-4 w-4 ml-2" />
      </Button>

      <DeleteConfirmDialog
        isOpen={isDeleteOthersDialogOpen}
        onClose={() => setIsDeleteOthersDialogOpen(false)}
        onConfirm={handleDeleteOthers}
        title="Delete Other Conversations"
        description="This will permanently delete all active conversations except the current one. Archived conversations will not be affected. This action cannot be undone."
        confirmLabel="Delete Other Conversations"
      />

      <DeleteConfirmDialog
        isOpen={isDeleteAllDialogOpen}
        onClose={() => setIsDeleteAllDialogOpen(false)}
        onConfirm={handleDeleteAll}
        title="Delete All Conversations"
        description="This will permanently delete ALL chat conversations, including archived ones. This action cannot be undone."
        confirmLabel="Delete All Conversations"
        destructive
      />
    </div>
  );
}
