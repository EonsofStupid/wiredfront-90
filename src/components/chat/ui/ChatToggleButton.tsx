
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore } from '../store/chatStore';

export interface ChatToggleButtonProps {
  className?: string;
  onClickHandler?: () => void;
  isLoading?: boolean;
}

export function ChatToggleButton({ className, onClickHandler, isLoading }: ChatToggleButtonProps) {
  const { toggleChat, isOpen } = useChatStore();
  
  const handleClick = () => {
    if (onClickHandler) {
      onClickHandler();
    } else {
      toggleChat();
    }
  };

  return (
    <Button 
      onClick={handleClick}
      variant="outline"
      size="icon"
      className={cn(
        "fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg", 
        isOpen ? "bg-primary text-primary-foreground" : "bg-background",
        className
      )}
      aria-label={isOpen ? "Close chat" : "Open chat"}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
      ) : (
        <MessageSquare className="h-5 w-5" />
      )}
    </Button>
  );
}
