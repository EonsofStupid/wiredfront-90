
import React from "react";
import { useChatStore } from "../store/chatStore";
import { Spinner } from "./Spinner";
import { MessageCircle } from "lucide-react";
import { buttonStyles } from "@/constants/chat/button-styles";

interface ChatToggleButtonProps {
  onClick?: () => void;
  className?: string;
  isLoading?: boolean;
}

export const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({
  onClick,
  className = "",
  isLoading = false,
}) => {
  const { position, settings } = useChatStore();
  const positionClass = position === "bottom-right" ? "right-4" : "left-4";
  
  // Get the selected button style from settings
  const selectedStyle = settings.appearance.buttonStyle || "wfpulse";
  const buttonColor = settings.appearance.buttonColor || "#0EA5E9";
  const buttonSize = settings.appearance.buttonSize || "medium";
  
  // Get the style definition
  const styleDefinition = buttonStyles[selectedStyle] || buttonStyles.wfpulse;
  
  // Size classes
  const sizeClasses = {
    small: "h-10 w-10",
    medium: "h-12 w-12",
    large: "h-14 w-14",
  };
  
  const sizeClass = sizeClasses[buttonSize];
  
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-4 ${positionClass} rounded-full shadow-lg transition-all ${sizeClass} ${className}`}
      aria-label="Toggle chat"
      style={{
        background: styleDefinition.theme.background || buttonColor,
        border: styleDefinition.theme.border || "none",
        boxShadow: styleDefinition.theme.glow || "none",
        zIndex: "var(--z-chat)",
      }}
    >
      {isLoading ? (
        <Spinner size="sm" className="text-white" />
      ) : (
        <div className="flex items-center justify-center w-full h-full text-white">
          {styleDefinition.icon ? (
            <div dangerouslySetInnerHTML={{ __html: styleDefinition.icon.default }} />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </div>
      )}
    </button>
  );
};
