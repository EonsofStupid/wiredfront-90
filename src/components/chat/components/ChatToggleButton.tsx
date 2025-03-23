import { ChatMode } from "@/integrations/supabase/types/enums";
import { logger } from "@/services/chat/LoggingService";
import { motion } from "framer-motion";
import { Code, MessageSquare, MessagesSquare } from "lucide-react";
import React from "react";
import { ChatPosition } from "../../store/types/chat-store-types";
import styles from "./ChatToggleButton.module.css";

interface ChatToggleButtonProps {
  onClick: () => void;
  isOpen: boolean;
  mode: ChatMode;
  position: ChatPosition;
}

export function ChatToggleButton({
  onClick,
  isOpen,
  mode,
  position,
}: ChatToggleButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    logger.info("Chat toggle button clicked", { mode, position });
    onClick();
  };

  // Pick icon based on mode
  const Icon =
    mode === "dev"
      ? Code
      : mode === "training"
      ? MessagesSquare
      : MessageSquare;

  // Determine tooltip text based on mode
  const tooltipText =
    mode === "dev"
      ? "Open Code Assistant"
      : mode === "training"
      ? "Open Context Planning"
      : "Open Chat";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className={styles.container}
      data-position={position}
    >
      <button
        onClick={handleClick}
        className={`${styles.button} ${styles.pulsingGlow}`}
        title={tooltipText}
        data-testid="chat-toggle-button"
      >
        <Icon className="h-6 w-6" />
      </button>
    </motion.div>
  );
}
