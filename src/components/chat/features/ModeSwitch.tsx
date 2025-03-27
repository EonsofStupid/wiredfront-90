
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useChatMode } from '../providers/ChatModeProvider';
import { Code, Image, MessageSquare } from 'lucide-react';

interface ChatModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatModeDialog({ open, onOpenChange }: ChatModeDialogProps) {
  const { mode, setMode } = useChatMode();
  
  const handleModeChange = (newMode: 'standard' | 'editor' | 'image' | 'chat-only') => {
    setMode(newMode);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="chat-dialog-content">
        <DialogHeader>
          <DialogTitle>Chat Mode Settings</DialogTitle>
          <DialogDescription>
            Select the chat mode that best suits your current task
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <Button
            variant={mode === 'standard' ? 'default' : 'outline'}
            className="flex flex-col items-center justify-center p-4 h-auto"
            onClick={() => handleModeChange('standard')}
          >
            <MessageSquare className="h-10 w-10 mb-2" />
            <span>Chat</span>
          </Button>
          
          <Button
            variant={mode === 'editor' ? 'default' : 'outline'}
            className="flex flex-col items-center justify-center p-4 h-auto"
            onClick={() => handleModeChange('editor')}
          >
            <Code className="h-10 w-10 mb-2" />
            <span>Code</span>
          </Button>
          
          <Button
            variant={mode === 'image' ? 'default' : 'outline'}
            className="flex flex-col items-center justify-center p-4 h-auto"
            onClick={() => handleModeChange('image')}
          >
            <Image className="h-10 w-10 mb-2" />
            <span>Image</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
