
import React from "react";
import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import { format } from "date-fns";
import { useChat } from "@/hooks/useChat";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { uiPreferences } = useChat();
  const isUser = message.role === 'user';
  
  // Format the timestamp if it exists and the preference is enabled
  const formattedTime = message.timestamp && uiPreferences.showTimestamps
    ? format(new Date(message.timestamp), "h:mm a")
    : null;

  return (
    <div
      className={cn(
        "chat-message flex flex-col max-w-[85%]",
        isUser ? "ml-auto" : "mr-auto"
      )}
    >
      <div
        className={cn(
          "px-4 py-2 rounded-lg",
          isUser 
            ? "bg-purple-600 text-white rounded-br-none" 
            : "bg-gray-800 text-white rounded-bl-none"
        )}
      >
        {message.content}
      </div>
      
      {formattedTime && (
        <span 
          className={cn(
            "text-xs mt-1 text-gray-400",
            isUser ? "text-right" : "text-left"
          )}
        >
          {formattedTime}
        </span>
      )}
    </div>
  );
}

export default ChatMessage;
