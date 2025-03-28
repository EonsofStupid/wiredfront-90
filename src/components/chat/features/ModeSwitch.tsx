
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useChatStore } from '../store/chatStore';
import { useChatBridge } from '../chatBridge';
import { ChatMode } from '@/types/chat/enums';
import { toast } from 'sonner';

interface ChatModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatModeDialog({ open, onOpenChange }: ChatModeDialogProps) {
  const { currentMode } = useChatStore();
  const chatBridge = useChatBridge();

  const handleModeChange = (mode: ChatMode) => {
    chatBridge.setMode(mode);
    toast.success(`Chat mode switched to ${mode}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Chat Mode</DialogTitle>
          <DialogDescription>
            Choose the chat mode that best suits your current task
          </DialogDescription>
        </DialogHeader>
        
        <RadioGroup defaultValue={currentMode} className="grid gap-4 py-4">
          <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-accent">
            <RadioGroupItem value="chat" id="chat-mode" onClick={() => handleModeChange(ChatMode.Chat)} />
            <Label htmlFor="chat-mode" className="flex flex-col gap-1">
              <span className="font-medium">Standard Chat</span>
              <span className="text-sm text-muted-foreground">General conversation and assistance</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-accent">
            <RadioGroupItem value="dev" id="dev-mode" onClick={() => handleModeChange(ChatMode.Dev)} />
            <Label htmlFor="dev-mode" className="flex flex-col gap-1">
              <span className="font-medium">Developer Mode</span>
              <span className="text-sm text-muted-foreground">Code assistance and development</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-accent">
            <RadioGroupItem value="image" id="image-mode" onClick={() => handleModeChange(ChatMode.Image)} />
            <Label htmlFor="image-mode" className="flex flex-col gap-1">
              <span className="font-medium">Image Generation</span>
              <span className="text-sm text-muted-foreground">Create and modify images</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-accent">
            <RadioGroupItem value="training" id="training-mode" onClick={() => handleModeChange(ChatMode.Training)} />
            <Label htmlFor="training-mode" className="flex flex-col gap-1">
              <span className="font-medium">Training Mode</span>
              <span className="text-sm text-muted-foreground">Learning and educational assistance</span>
            </Label>
          </div>
        </RadioGroup>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
