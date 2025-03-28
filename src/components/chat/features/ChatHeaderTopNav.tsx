
import React from 'react';
import { MessageSquare, Code, ImageIcon, GraduationCap, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useChatBridge } from '../chatBridge';
import { useChatStore } from '../store/chatStore';
import { ChatMode } from '@/types/chat/enums';
import { useConversationStore } from '../store/conversation/store';

export function ChatHeaderTopNav() {
  const chatBridge = useChatBridge();
  const { currentMode, setMode, features } = useChatStore();
  const { createConversation, setCurrentConversationId } = useConversationStore();
  
  // Create a new conversation and switch to it
  const handleNewSession = () => {
    const newConversationId = createConversation({
      mode: currentMode as ChatMode,
      title: "New Conversation"
    });
    
    setCurrentConversationId(newConversationId);
    chatBridge.clearMessages();
  };

  return (
    <div className="flex items-center space-x-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <div className="flex items-center">
              {currentMode === ChatMode.Chat && <MessageSquare className="h-4 w-4" />}
              {currentMode === ChatMode.Dev && <Code className="h-4 w-4" />}
              {currentMode === ChatMode.Image && <ImageIcon className="h-4 w-4" />}
              {currentMode === ChatMode.Training && <GraduationCap className="h-4 w-4" />}
              <ChevronDown className="h-3 w-3 ml-1" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {features.standardChat && (
            <DropdownMenuItem onClick={() => setMode(ChatMode.Chat)}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </DropdownMenuItem>
          )}
          
          {features.codeAssistant && (
            <DropdownMenuItem onClick={() => setMode(ChatMode.Dev)}>
              <Code className="h-4 w-4 mr-2" />
              Code Assistant
            </DropdownMenuItem>
          )}
          
          {features.imageGeneration && (
            <DropdownMenuItem onClick={() => setMode(ChatMode.Image)}>
              <ImageIcon className="h-4 w-4 mr-2" />
              Image Generation
            </DropdownMenuItem>
          )}
          
          {features.training && (
            <DropdownMenuItem onClick={() => setMode(ChatMode.Training)}>
              <GraduationCap className="h-4 w-4 mr-2" />
              Training
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleNewSession}>
        <MessageSquare className="h-4 w-4" />
      </Button>
    </div>
  );
}
