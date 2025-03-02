
import React from "react";
import { MessageSquare, Code, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatMode } from "../providers/ChatModeProvider";
import { useChat } from "../ChatProvider";

interface ChatToggleButtonProps {
  onClick: () => void;
}

export function ChatToggleButton({ onClick }: ChatToggleButtonProps) {
  const { mode } = useChatMode();
  const { isEditorPage } = useChat();

  return (
    <Button
      onClick={onClick}
      className="fixed bottom-4 right-4 p-4 rounded-full shadow-lg z-[var(--z-chat)] glass-card neon-glow hover:scale-105 transition-transform duration-200"
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
