
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Code, Image, Graduation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useChatStore } from '../store/chatStore';
import { ChatMode } from '@/types/chat/enums';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

export function ChatHeaderTopNav() {
  const navigate = useNavigate();
  const { currentMode, setMode } = useChatStore();
  const { isEnabled } = useFeatureFlags();
  
  const handleModeClick = (mode: ChatMode, path: string) => {
    setMode(mode);
    navigate(path);
  };

  // Function to check if a mode is active
  const isActive = (mode: ChatMode): boolean => {
    return currentMode === mode;
  };

  // Common button classes
  const buttonClass = "h-6 w-6 rounded-sm";
  
  return (
    <div className="flex items-center space-x-1 mr-2">
      {/* Standard Chat Mode */}
      {isEnabled('standardChat') && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            buttonClass,
            isActive(ChatMode.Chat) && "bg-gradient-to-r from-blue-500/30 to-cyan-500/30"
          )}
          onClick={() => handleModeClick(ChatMode.Chat, '/')}
          title="Chat Mode"
          data-testid="chat-mode-button"
        >
          <MessageSquare className="h-3.5 w-3.5" />
        </Button>
      )}
      
      {/* Dev Mode */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          buttonClass,
          isActive(ChatMode.Dev) && "bg-gradient-to-r from-purple-500/30 to-blue-500/30"
        )}
        onClick={() => handleModeClick(ChatMode.Dev, '/editor')}
        title="Developer Mode"
        data-testid="dev-mode-button"
      >
        <Code className="h-3.5 w-3.5" />
      </Button>
      
      {/* Image Mode */}
      {isEnabled('imageGeneration') && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            buttonClass,
            isActive(ChatMode.Image) && "bg-gradient-to-r from-pink-500/30 to-purple-500/30"
          )}
          onClick={() => handleModeClick(ChatMode.Image, '/gallery')}
          title="Image Mode"
          data-testid="image-mode-button"
        >
          <Image className="h-3.5 w-3.5" />
        </Button>
      )}
      
      {/* Training Mode */}
      {isEnabled('training') && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            buttonClass,
            isActive(ChatMode.Training) && "bg-gradient-to-r from-amber-500/30 to-orange-500/30"
          )}
          onClick={() => handleModeClick(ChatMode.Training, '/training')}
          title="Training Mode"
          data-testid="training-mode-button"
        >
          <Graduation className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
