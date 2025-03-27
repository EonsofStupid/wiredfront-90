import React from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/components/chat/store/chatStore';

interface ChatModeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatModeDialog({ isOpen, onClose }: ChatModeDialogProps) {
  const { setMode } = useChatStore();

  const handleModeSelect = (mode: string) => {
    setMode(mode);
    onClose();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Select Chat Mode</DialogTitle>
        <DialogDescription>
          Choose how you want to interact with the AI
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 gap-4 py-4">
        <Button
          variant="outline"
          className="flex flex-col items-start p-4 h-auto"
          onClick={() => handleModeSelect('chat')}
        >
          <span className="font-medium">Chat Mode</span>
          <span className="text-sm text-muted-foreground">
            Standard conversation with the AI
          </span>
        </Button>

        <Button
          variant="outline"
          className="flex flex-col items-start p-4 h-auto"
          onClick={() => handleModeSelect('code')}
        >
          <span className="font-medium">Code Mode</span>
          <span className="text-sm text-muted-foreground">
            Focused on code generation and editing
          </span>
        </Button>

        <Button
          variant="outline"
          className="flex flex-col items-start p-4 h-auto"
          onClick={() => handleModeSelect('image')}
        >
          <span className="font-medium">Image Mode</span>
          <span className="text-sm text-muted-foreground">
            Generate and edit images
          </span>
        </Button>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
