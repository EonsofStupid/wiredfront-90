
import { logger } from "@/services/chat/LoggingService";
import { motion } from "framer-motion";
import { Code, MessageSquare, MessagesSquare } from "lucide-react";
import React, { useEffect } from "react";
import { useChatMode } from "../providers/ChatModeProvider";
import { useChatStore } from "../store/chatStore";
import styles from "./ChatToggleButton.styles.css";

interface ChatToggleButtonProps {
  onClick: () => void;
}

export function ChatToggleButton({ onClick }: ChatToggleButtonProps) {
  const { mode } = useChatMode();
  const { position, isHidden, iconStyle = 'default' } = useChatStore();

  useEffect(() => {
    console.log("ChatToggleButton mounted", { isHidden, position, mode, iconStyle });
  }, [isHidden, position, mode, iconStyle]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    logger.info("Chat toggle button clicked", { mode, position, iconStyle });
    onClick();
  };

  // If hidden, don't render the button
  if (isHidden) {
    console.log("Chat button is hidden, not rendering");
    return null;
  }

  // Pick icon based on mode
  const Icon =
    mode === "editor"
      ? Code
      : mode === "chat-only"
      ? MessagesSquare
      : MessageSquare;

  // Determine tooltip text based on mode
  const tooltipText =
    mode === "editor"
      ? "Open Code Assistant"
      : mode === "chat-only"
      ? "Open Context Planning"
      : "Open Chat";

  // Apply the appropriate theme class based on the user's preference
  const getThemeClass = () => {
    switch (iconStyle) {
      case 'wfpulse':
        return styles.wfpulseTheme;
      case 'retro':
        return styles.retroTheme;
      default:
        return styles.defaultTheme;
    }
  };

  // Apply the appropriate pulse animation based on the user's preference
  const getPulseClass = () => {
    switch (iconStyle) {
      case 'wfpulse':
        return styles.wfpulsePulse;
      case 'retro':
        return styles.retroPulse;
      default:
        return styles.defaultPulse;
    }
  };

  console.log("Rendering chat button", { position, mode, iconStyle });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className={styles.buttonContainer}
      data-position={position}
    >
      <button
        onClick={handleClick}
        className={`${styles.chatButton} ${getThemeClass()} ${getPulseClass()}`}
        title={tooltipText}
        data-testid="chat-toggle-button"
      >
        <Icon className="h-6 w-6" />
      </button>
    </motion.div>
  );
}
