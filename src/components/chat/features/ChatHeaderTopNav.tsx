
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '../store/chatStore';
import { useConversationStore } from '../store/conversation/store';
import { useChatBridge } from '../chatBridge';
import { toast } from 'sonner';

export function ChatHeaderTopNav() {
  const { features, resetChatState } = useChatStore();
  const { createConversation } = useConversationStore();
  const chatBridge = useChatBridge();

  const handleNewChat = () => {
    const conversationId = createConversation();
    if (conversationId) {
      chatBridge.switchConversation(conversationId);
      toast.success('New chat started');
    }
  };

  const handleResetChat = () => {
    resetChatState();
    toast.success('Chat reset successfully');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem onClick={handleNewChat}>
          New Chat
        </DropdownMenuItem>
        
        {features.tokenEnforcement && (
          <DropdownMenuItem onClick={() => chatBridge.toggleFeature('tokenEnforcement')}>
            {features.tokenEnforcement ? 'Disable' : 'Enable'} Token Enforcement
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={handleResetChat} className="text-red-500">
          Reset Chat
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
