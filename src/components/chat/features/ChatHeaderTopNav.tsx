
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessagesSquare, Code, ImageIcon, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '../store/chatStore';
import { ChatMode } from '@/types/chat/enums';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function ChatHeaderTopNav() {
  const navigate = useNavigate();
  const { currentMode, setMode, features } = useChatStore();
  
  const handleModeChange = (mode: ChatMode) => {
    setMode(mode);
    
    switch (mode) {
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
  };
  
  return (
    <TooltipProvider>
      <div className="flex items-center space-x-1">
        {features.standardChat && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleModeChange(ChatMode.Chat)}
                data-active={currentMode === ChatMode.Chat}
                data-testid="chat-mode-button"
              >
                <MessagesSquare className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Standard Chat</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        {features.codeAssistant && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleModeChange(ChatMode.Dev)}
                data-active={currentMode === ChatMode.Dev || currentMode === ChatMode.Editor}
                data-testid="dev-mode-button"
              >
                <Code className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Code Assistant</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        {features.imageGeneration && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleModeChange(ChatMode.Image)}
                data-active={currentMode === ChatMode.Image}
                data-testid="image-mode-button"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Image Generation</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        {features.training && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleModeChange(ChatMode.Training)}
                data-active={currentMode === ChatMode.Training}
                data-testid="training-mode-button"
              >
                <GraduationCap className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Training Mode</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
