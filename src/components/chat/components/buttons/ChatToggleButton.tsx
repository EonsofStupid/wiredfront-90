
import React from "react";
import { MessageSquare, Code, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatMode } from "../../providers/ChatModeProvider";
import { useChatStore } from "../../store/chatStore";

interface ChatToggleButtonProps {
  onClick: () => void;
}

export function ChatToggleButton({ onClick }: ChatToggleButtonProps) {
  const { mode } = useChatMode();
  const { position } = useChatStore();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  // Position the button based on the selected position
  const positionClass = position === 'bottom-right' ? 'right-4' : 'left-4';

  return (
    <Button
      onClick={handleClick}
      className={`fixed bottom-4 ${positionClass} p-4 rounded-full shadow-lg z-[var(--z-chat)] glass-card neon-glow hover:scale-105 transition-transform duration-200`}
      title={
        mode === 'editor' 
          ? "Code Assistant" 
          : mode === 'chat-only' 
            ? "Context Planning" 
            : "Chat"
      }
    >
      {mode === 'editor' ? (
        <Code className="h-6 w-6" />
      ) : mode === 'chat-only' ? (
        <MessagesSquare className="h-6 w-6" />
      ) : (
        <MessageSquare className="h-6 w-6" />
      )}
    </Button>
  );
}
