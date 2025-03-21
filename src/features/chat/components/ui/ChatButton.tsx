import { cn } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';
import React from 'react';

interface ChatButtonProps {
  position: { x: number; y: number };
  scale: number;
  onClick?: () => void;
  isPreview?: boolean;
}

export function ChatButton({
  position,
  scale,
  onClick,
  isPreview = false
}: ChatButtonProps) {
  const buttonStyle: React.CSSProperties = {
    transform: `scale(${scale})`,
    transformOrigin: 'bottom right',
    position: isPreview ? 'relative' : 'fixed',
    bottom: isPreview ? 'auto' : position.y,
    right: isPreview ? 'auto' : position.x,
    margin: isPreview ? '0' : undefined,
  };

  return (
    <div
      className={cn(
        "chat-button-container",
        isPreview ? "preview" : "fixed"
      )}
      style={buttonStyle}
    >
      <button
        className="chat-button"
        onClick={onClick}
        aria-label="Open chat"
      >
        <MessageSquare className="h-6 w-6" />
      </button>
    </div>
  );
}
