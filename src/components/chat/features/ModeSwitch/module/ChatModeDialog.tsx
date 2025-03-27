
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Code, Image, MessageSquare } from 'lucide-react';
import { useChatStore } from '@/components/chat/store/chatStore';

interface ChatModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectMode?: (mode: string) => void;
}

export function ChatModeDialog({ open, onOpenChange, onSelectMode }: ChatModeDialogProps) {
  const handleModeSelect = (mode: string) => {
    if (onSelectMode) {
      onSelectMode(mode);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Chat Mode</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-4 py-4">
          <Button
            onClick={() => handleModeSelect('chat')}
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2"
          >
            <MessageSquare className="h-6 w-6" />
            <span>Standard</span>
          </Button>
          
          <Button
            onClick={() => handleModeSelect('dev')}
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2"
          >
            <Code className="h-6 w-6" />
            <span>Developer</span>
          </Button>
          
          <Button
            onClick={() => handleModeSelect('image')}
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2"
          >
            <Image className="h-6 w-6" />
            <span>Image</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
