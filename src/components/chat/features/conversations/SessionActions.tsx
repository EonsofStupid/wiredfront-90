
import React from 'react';
import { 
  ChevronDown, 
  Download, 
  Trash2, 
  Archive
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useConversationManager } from '@/components/chat/hooks/conversation/useConversationManager';
import { toast } from 'sonner';

export function SessionActions() {
  const { 
    currentConversation, 
    deleteConversation, 
    archiveConversation,
    createConversation 
  } = useConversationManager();

  const handleNewSession = () => {
    createConversation();
  };

  const handleDownload = () => {
    if (!currentConversation) return;
    
    // Implementation for downloading conversation
    toast.info('Download feature not implemented yet');
  };

  const handleDelete = () => {
    if (!currentConversation) return;
    
    if (deleteConversation(currentConversation.id)) {
      toast.success('Conversation deleted');
    } else {
      toast.error('Failed to delete conversation');
    }
  };

  const handleArchive = () => {
    if (!currentConversation) return;
    
    if (archiveConversation(currentConversation.id)) {
      toast.success('Conversation archived');
    } else {
      toast.error('Failed to archive conversation');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleNewSession}>
          New Session
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleArchive}>
          <Archive className="mr-2 h-4 w-4" />
          Archive
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-red-500">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
