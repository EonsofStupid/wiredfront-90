import { cn } from '@/lib/utils';
import { useChatLayoutStore } from '@/stores/chat/chatLayoutStore';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import React from 'react';

interface ChatToggleButtonProps {
  onClick: () => void;
}

export const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({ onClick }) => {
  const { position } = useChatLayoutStore();

  const positionClass = position?.x > window.innerWidth / 2
    ? 'right-4'
    : 'left-4';

  return (
    <motion.button
      className={cn(
        "fixed bottom-4",
        "bg-gradient-to-r from-neon-blue to-neon-blue/70",
        "text-white p-3 rounded-full",
        "shadow-[0_0_15px_rgba(168,85,247,0.3)]",
        "z-[var(--z-chat-button)]",
        "border border-purple-500/50",
        "backdrop-blur-md",
        positionClass
      )}
      whileHover={{
        scale: 1.1,
        boxShadow: "0 0 20px rgba(168,85,247,0.4)"
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      aria-label="Open chat"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.3,
        ease: "easeOut"
      }}
    >
      <MessageSquare className="h-6 w-6" />
    </motion.button>
  );
};
