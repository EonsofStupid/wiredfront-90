
import { useChatLayoutStore } from '@/features/chat/store/chatLayoutStore';
import { useChatModeStore } from '@/stores/features/chat/modeStore';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import React from 'react';
import { ModeIndicator } from '../ui/ModeIndicator';

interface ChatToggleButtonProps {
  onClick: () => void;
  isPreview?: boolean;
  scale?: number;
}

export const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({
  onClick,
  isPreview = false,
  scale = 1
}) => {
  const { position } = useChatLayoutStore();
  const { currentMode } = useChatModeStore();

  const isRightSide = position?.x > window.innerWidth / 2;
  const positionClass = isRightSide ? 'right-4' : 'left-4';

  const buttonStyle: React.CSSProperties = {
    transform: `scale(${scale})`,
    transformOrigin: isRightSide ? 'bottom right' : 'bottom left',
    position: isPreview ? 'relative' : 'fixed',
    bottom: isPreview ? 'auto' : 16,
    right: isPreview && !isRightSide ? 'auto' : undefined,
    left: isPreview && isRightSide ? 'auto' : undefined,
    margin: isPreview ? '0' : undefined,
  };

  return (
    <motion.button
      className={cn(
        "chat-toggle-button",
        "bg-gradient-to-r from-purple-600 to-purple-800",
        "text-white p-3 rounded-full",
        "shadow-[0_0_15px_rgba(168,85,247,0.3)]",
        "z-[var(--z-chat-button)]",
        "border border-purple-500/50",
        "backdrop-blur-md",
        "relative",
        positionClass
      )}
      style={buttonStyle}
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
      
      {/* Mode indicator */}
      <div className="absolute -top-2 -right-2">
        <ModeIndicator mode={currentMode} size="sm" />
      </div>
    </motion.button>
  );
};
