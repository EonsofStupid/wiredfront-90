
import { logger } from "@/services/chat/LoggingService";
import { motion } from "framer-motion";
import { Code, MessageSquare, MessagesSquare } from "lucide-react";
import React, { useEffect } from "react";
import { useChatMode } from "../providers/ChatModeProvider";
import { useChatStore } from "../store/chatStore";
import { useChatIconStyle } from "../hooks/useChatIconStyle";
import { defaultStyle } from "./styles/DefaultStyle";
import { wfpulseStyle } from "./styles/WFPulseStyle";
import { retroStyle } from "./styles/RetroStyle";
import { basicStyle } from "./styles/BasicStyle";

interface ChatToggleButtonProps {
  onClick: () => void;
}

export function ChatToggleButton({ onClick }: ChatToggleButtonProps) {
  const { mode } = useChatMode();
  const { position, isHidden, setIsHidden } = useChatStore();
  const { iconStyle } = useChatIconStyle();

  // Ensure the button is visible on mount
  useEffect(() => {
    if (isHidden) {
      console.log("Chat button was hidden, making it visible");
      setIsHidden(false);
    }
  }, [isHidden, setIsHidden]);

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

  // Select style based on user preference
  const styleToUse = (() => {
    switch (iconStyle) {
      case "wfpulse":
        return wfpulseStyle;
      case "retro":
        return retroStyle;
      case "basic":
        return basicStyle;
      default:
        return defaultStyle;
    }
  })();

  console.log("Rendering chat button", { position, mode, iconStyle });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className={styleToUse.container}
      data-position={position}
      data-testid="chat-toggle-container"
    >
      <button
        onClick={handleClick}
        className={`${styleToUse.button} ${styleToUse.animation}`}
        title={tooltipText}
        data-testid="chat-toggle-button"
        data-style={iconStyle}
        aria-label={tooltipText}
      >
        <Icon className={styleToUse.icon} />
      </button>
    </motion.div>
  );
}
