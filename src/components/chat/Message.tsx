
import React from "react";
import type { MessageRole, MessageStatus } from "@/types/chat";

interface MessageProps {
  id: string;
  content: string;
  role: MessageRole;
  status: MessageStatus;
  timestamp?: string;
  onRetry?: (messageId: string) => void;
}

export function Message({ id, content, role, status, timestamp, onRetry }: MessageProps) {
  const isSystem = role === "system";
  const isUser = role === "user";
  const isAssistant = role === "assistant";
  const isFailed = status === "failed" || status === "error";

  return (
    <div 
      className={`chat-message chat-message-${role}`}
      data-status={status}
      data-testid={`message-${id}`}
    >
      <div className="chat-message-content">{content}</div>
      
      {timestamp && (
        <span className="chat-message-time">
          {new Date(timestamp).toLocaleTimeString()}
        </span>
      )}
      
      {isFailed && onRetry && (
        <button 
          onClick={() => onRetry(id)}
          className="chat-message-retry-button"
          aria-label="Retry sending message"
        >
          Retry
        </button>
      )}
    </div>
  );
}
