import { cn } from "@/lib/utils";
import { useChatLayout } from "@/stores/chat/chatStore";
import React from "react";

interface ChatContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  children,
  className,
}) => {
  const { isMinimized } = useChatLayout();

  return (
    <div
      className={cn(
        "flex flex-col h-full w-full bg-[var(--chat-bg-primary)] text-[var(--chat-text-primary)]",
        "transition-all duration-[var(--chat-transition-normal)]",
        isMinimized ? "rounded-lg shadow-lg" : "rounded-none shadow-none",
        className
      )}
      style={{
        transform: `scale(1)`,
        transformOrigin: "top left",
      }}
    >
      {children}
    </div>
  );
};
