
import React from "react";
import { useChatStore } from "../store/chatStore";
import type { ChatMessage } from "../types";

export function Messages() {
  const { messages } = useChatStore();

  // If no messages, show a welcome message
  if (!messages || messages.length === 0) {
    return (
      <div className="chat-messages">
        <div className="chat-message chat-message-system">
          <p className="chat-message-content">Welcome to the chat! How can I help you today?</p>
        </div>
      </div>
    );
  }

  return (
    <div role="list" className="chat-messages">
      {messages.map((message: ChatMessage) => (
        <div key={message.id} role="listitem" className={`chat-message chat-message-${message.role}`}>
          <p className="chat-message-content">{message.content}</p>
          {message.timestamp && (
            <span className="chat-message-time">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
