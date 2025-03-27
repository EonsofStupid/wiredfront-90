
import React from 'react';
import { atom, useAtom } from 'jotai';
import { 
  MoreHorizontal, 
  Copy, 
  Edit, 
  Trash, 
  MessageSquare, 
  Download 
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { MessageRole } from '@/types/chat/enums';

interface MessageActionsProps {
  id: string;
  messageRole: MessageRole;
  onEdit?: () => void;
  onDelete?: (id: string) => void;
  onRegenerate?: () => void;
  onDownload?: () => void;
}

// Create local atoms for this component
const showDropdownAtom = atom(false);

export const MessageActions = ({
  id,
  messageRole,
  onEdit,
  onDelete,
  onRegenerate,
  onDownload
}: MessageActionsProps) => {
  const [showDropdown, setShowDropdown] = useAtom(showDropdownAtom);
  
  const handleCopy = () => {
    // Find the message content in the DOM
    const messageElement = document.getElementById(`message-${id}`);
    if (messageElement) {
      const content = messageElement.innerText;
      navigator.clipboard.writeText(content)
        .then(() => toast.success("Copied to clipboard"))
        .catch(() => toast.error("Failed to copy"));
    } else {
      toast.error("Couldn't find message content");
    }
  };
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };
  
  const isAssistant = messageRole === 'assistant';
  
  return (
    <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
      <DropdownMenuTrigger asChild>
        <button 
          className="p-1 rounded-full hover:bg-muted"
          aria-label="Message actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleCopy}>
          <Copy className="h-4 w-4 mr-2" />
          <span>Copy</span>
        </DropdownMenuItem>
        
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            <span>Edit</span>
          </DropdownMenuItem>
        )}
        
        {onDelete && (
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            <Trash className="h-4 w-4 mr-2" />
            <span>Delete</span>
          </DropdownMenuItem>
        )}
        
        {isAssistant && onRegenerate && (
          <DropdownMenuItem onClick={onRegenerate}>
            <MessageSquare className="h-4 w-4 mr-2" />
            <span>Regenerate</span>
          </DropdownMenuItem>
        )}
        
        {isAssistant && onDownload && (
          <DropdownMenuItem onClick={onDownload}>
            <Download className="h-4 w-4 mr-2" />
            <span>Download</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
