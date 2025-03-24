import React from "react";
import { useChatStore } from "../store/chatStore";

interface ChatToggleButtonProps {
  onClick?: () => void;
  className?: string;
}

export const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({
  onClick,
  className = "",
}) => {
  const { position } = useChatStore();
  const positionClass = position === "bottom-right" ? "right-4" : "left-4";

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-4 ${positionClass} bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary/90 transition-colors ${className}`}
      aria-label="Toggle chat"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    </button>
  );
};
