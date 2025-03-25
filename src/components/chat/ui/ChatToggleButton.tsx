
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore } from '../store/chatStore';

interface ChatToggleButtonProps {
  className?: string;
}

export function ChatToggleButton({ className }: ChatToggleButtonProps) {
  const { toggleChat, isOpen } = useChatStore();

  return (
    <Button 
      onClick={toggleChat}
      variant="outline"
      size="icon"
      className={cn(
        "fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg", 
        isOpen ? "bg-primary text-primary-foreground" : "bg-background",
        className
      )}
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      <MessageSquare className="h-5 w-5" />
    </Button>
  );
}
