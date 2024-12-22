import React from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatInputActionsProps {
  onAttachmentClick: () => void;
  isLoading?: boolean;
  hasContent: boolean;
}

export const ChatInputActions = ({ 
  onAttachmentClick, 
  isLoading, 
  hasContent 
}: ChatInputActionsProps) => {
  return (
    <div className="absolute bottom-3 right-3 flex gap-2">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={onAttachmentClick}
        multiple
        accept="image/*,.pdf,.doc,.docx"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <Paperclip className="h-4 w-4" />
      </Button>
      <Button 
        type="submit" 
        size="icon"
        disabled={isLoading || !hasContent}
        className="h-8 w-8"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};