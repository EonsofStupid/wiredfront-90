
import React from "react";
import { MessageSquare, Code, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatMode } from "../providers/ChatModeProvider";
import { useChatStore } from "../store/chatStore";
import { motion } from "framer-motion";
import { logger } from "@/services/chat/LoggingService";

interface ChatToggleButtonProps {
  onClick: () => void;
}

export function ChatToggleButton({ onClick }: ChatToggleButtonProps) {
  const { mode } = useChatMode();
  const { position } = useChatStore();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    logger.info('Chat toggle button clicked', { mode, position });
    onClick();
  };

  // Position the button based on the selected position
  const positionClass = position === 'bottom-right' ? 'right-4' : 'left-4';

  // Pick icon based on mode
  const Icon = mode === 'editor' 
    ? Code 
    : mode === 'chat-only' 
      ? MessagesSquare 
      : MessageSquare;
      
  // Determine tooltip text based on mode
  const tooltipText = mode === 'editor' 
    ? "Open Code Assistant" 
    : mode === 'chat-only' 
      ? "Open Context Planning" 
      : "Open Chat";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className={`fixed bottom-4 ${positionClass} z-[var(--z-chat)]`}
    >
      <Button
        onClick={handleClick}
        className="p-4 rounded-full shadow-lg glass-card pulsing-glow hover:scale-105 transition-transform duration-200"
        title={tooltipText}
        data-testid="chat-toggle-button"
      >
        <Icon className="h-6 w-6" />
      </Button>
    </motion.div>
  );
}
