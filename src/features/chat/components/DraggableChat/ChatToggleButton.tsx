
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatToggleButtonProps {
  onClick: () => void;
  className?: string;
}

export function ChatToggleButton({ onClick, className }: ChatToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "chat-toggle-button animate-glow-pulse",
        className
      )}
      aria-label="Open chat"
    >
      <MessageSquare size={24} />
    </button>
  );
}
