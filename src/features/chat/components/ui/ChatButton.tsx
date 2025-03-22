
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import { ChatPosition } from "../../types";
import { motion } from "framer-motion";
import { useHasUnreadMessages } from "../../hooks/useHasUnreadMessages";
import { useChatModeStore } from "@/stores/features/chat/modeStore";
import { ModeIndicator } from "./ModeIndicator";

interface ChatButtonProps {
  position: ChatPosition;
  scale: number;
  onClick: () => void;
  isPreview?: boolean;
  hasNotification?: boolean;
}

export function ChatButton({ 
  position, 
  scale, 
  onClick, 
  isPreview = false,
  hasNotification 
}: ChatButtonProps) {
  // Determine if the button should be on the left or right side based on position
  const isRightSide = position.x > window.innerWidth / 2;
  
  // For auto-detecting unread messages
  const hasUnread = useHasUnreadMessages();
  const showNotification = hasNotification || hasUnread;
  
  // Get current mode for styling
  const { currentMode } = useChatModeStore();
  
  // Calculate button position
  const buttonPosition = {
    position: isPreview ? 'relative' : 'fixed',
    bottom: isPreview ? 'auto' : '16px',
    [isRightSide ? 'right' : 'left']: isPreview ? 'auto' : '16px',
    transform: `scale(${scale})`,
    transformOrigin: isRightSide ? 'bottom right' : 'bottom left',
  } as React.CSSProperties;

  return (
    <motion.div
      style={buttonPosition}
      className={cn(
        "z-[var(--z-chat-button)]",
        isPreview && "pointer-events-none"
      )}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.button
        onClick={onClick}
        className={cn(
          "chat-toggle-button",
          "rounded-full p-3",
          "bg-gradient-to-r from-purple-600 to-purple-800",
          "text-white",
          "border border-purple-500/50",
          "shadow-[0_0_15px_rgba(168,85,247,0.3)]",
          "backdrop-blur-md",
          "relative",
          showNotification && "chat-button-pulse"
        )}
        whileHover={{
          scale: 1.1,
          boxShadow: "0 0 20px rgba(168,85,247,0.4)"
        }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
      >
        <MessageSquare className="h-6 w-6" />
        
        {/* Mode indicator */}
        <div className="absolute -top-2 -right-2">
          <ModeIndicator mode={currentMode} size="sm" />
        </div>
        
        {/* Notification indicator */}
        {showNotification && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></span>
        )}
      </motion.button>
    </motion.div>
  );
}
