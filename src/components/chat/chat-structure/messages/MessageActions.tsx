
import React from 'react';
import { 
  MoreHorizontal, 
  Copy, 
  RefreshCw,
  Trash2, 
  Pencil
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { MessageRole } from '../../types';

interface MessageActionsProps {
  id: string;
  messageRole: MessageRole;
  onEdit?: () => void;
  onDelete?: (id: string) => void;
  onRegenerate?: (id: string) => void;
}

export const MessageActions = ({ 
  id, 
  messageRole,
  onEdit, 
  onDelete, 
  onRegenerate
}: MessageActionsProps) => {
  const handleCopy = () => {
    // Find the message element and copy its text content
    const messageElement = document.getElementById(`message-${id}`);
    if (messageElement) {
      const textContent = messageElement.innerText;
      navigator.clipboard.writeText(textContent)
        .then(() => toast.success('Message copied to clipboard'))
        .catch(() => toast.error('Failed to copy message'));
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-50 hover:opacity-100">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleCopy}>
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </DropdownMenuItem>
        
        {onEdit && messageRole === 'user' && (
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
        )}
        
        {onRegenerate && messageRole === 'assistant' && (
          <DropdownMenuItem onClick={() => onRegenerate(id)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerate
          </DropdownMenuItem>
        )}
        
        {onDelete && (
          <DropdownMenuItem 
            onClick={() => onDelete(id)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
