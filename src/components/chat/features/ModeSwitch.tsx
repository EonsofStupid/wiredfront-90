
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useChatStore } from '../store/chatStore';
import { ChatMode } from '@/types/chat/enums';
import { useConversationManager } from '@/hooks/conversation';
import { Code, ImageIcon, MessageSquare } from 'lucide-react';
import { EnumUtils } from '@/lib/enums';

export interface ChatModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatModeDialog({ open, onOpenChange }: ChatModeDialogProps) {
  const navigate = useNavigate();
  const { currentMode, setMode, features } = useChatStore();
  const { createConversation } = useConversationManager();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleModeSelect = async (newMode: ChatMode) => {
    try {
      setIsProcessing(true);
      
      // Create a new conversation with the selected mode
      await createConversation({
        mode: newMode,
        title: `New ${EnumUtils.chatModeToUiMode(newMode)} conversation`
      });
      
      // Update the current mode
      setMode(newMode);
      
      // Navigate to the appropriate page
      switch (newMode) {
        case ChatMode.Dev:
        case ChatMode.Editor:
          navigate('/editor');
          break;
        case ChatMode.Image:
          navigate('/gallery');
          break;
        default:
          // Default to home for other modes
          navigate('/');
          break;
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to switch mode:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select Chat Mode</DialogTitle>
          <DialogDescription>
            Choose the AI mode you want to use for your conversation
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-4 py-4">
          {features.standardChat && (
            <Button
              variant="outline"
              className="flex flex-col items-center h-auto p-4 gap-2"
              onClick={() => handleModeSelect(ChatMode.Chat)}
              disabled={isProcessing}
            >
              <MessageSquare className="h-8 w-8" />
              <span>Chat</span>
            </Button>
          )}
          
          {features.codeAssistant && (
            <Button
              variant="outline"
              className="flex flex-col items-center h-auto p-4 gap-2"
              onClick={() => handleModeSelect(ChatMode.Dev)}
              disabled={isProcessing}
            >
              <Code className="h-8 w-8" />
              <span>Code</span>
            </Button>
          )}
          
          {features.imageGeneration && (
            <Button
              variant="outline"
              className="flex flex-col items-center h-auto p-4 gap-2"
              onClick={() => handleModeSelect(ChatMode.Image)}
              disabled={isProcessing}
            >
              <ImageIcon className="h-8 w-8" />
              <span>Image</span>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
