
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

export function ChatHeaderTopNav() {
  const chatBridge = useChatBridge();
  const { currentMode, setMode, features } = useChatStore();
  
  // Note: Since switchConversation doesn't exist in ChatBridge, we'll handle this differently
  // We'll update the ChatBridge implementation separately to add this functionality
  const handleNewSession = () => {
    // This should create a new session and switch to it
    console.log('New session requested');
    // For now, we'll just clear messages as a fallback
    chatBridge.clearMessages();
  };

  return (
    <div className="flex items-center space-x-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <div className="flex items-center">
              {currentMode === 'chat' && <MessageSquare className="h-4 w-4" />}
              {currentMode === 'dev' && <Code className="h-4 w-4" />}
              {currentMode === 'image' && <ImageIcon className="h-4 w-4" />}
              {currentMode === 'training' && <GraduationCap className="h-4 w-4" />}
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
