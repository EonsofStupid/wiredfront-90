
import React from "react";
import type { MessageRole, MessageStatus } from "@/types/chat";

interface MessageProps {
  id: string;
  content: string;
  role: MessageRole;
  status: MessageStatus;
  timestamp?: string;
}

export function Message({ content, role, status, timestamp }: MessageProps) {
  return (
    <div className={`chat-message chat-message-${role}`}>
      <p className="chat-message-content">{content}</p>
      {timestamp && (
        <span className="chat-message-time">
          {new Date(timestamp).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}
