import { cn } from "@/lib/utils";
import type { Message } from "@/types/chat";
import React from "react";
import { useMessagePreferences } from "./MessagePreferences";

interface MessageItemProps {
  message: Message;
  className?: string;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  className,
}) => {
  const { preferences } = useMessagePreferences();
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full gap-2 p-2",
        isUser ? "justify-end" : "justify-start",
        className
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-3",
          "transition-all duration-[var(--chat-transition-normal)]",
          isUser
            ? "bg-[var(--chat-accent-color)] text-white"
            : "bg-[var(--chat-bg-secondary)] text-[var(--chat-text-primary)]"
        )}
      >
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
        {preferences.showTimestamps && (
          <div className="mt-1 text-xs opacity-70">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};
