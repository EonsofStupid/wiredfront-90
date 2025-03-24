
import React from "react";
import { useChatStore } from "../store/chatStore";
import type { ChatMessage } from "../types";
import { Message } from "../Message";

export function Messages() {
  const { messages } = useChatStore();

  // Log messages for debugging
  React.useEffect(() => {
    console.log("Messages component rendered with:", { messageCount: messages?.length || 0 });
  }, [messages]);

  // If no messages, show a welcome message
  if (!messages || messages.length === 0) {
    return (
      <div className="chat-messages">
        <div className="chat-message chat-message-system">
          <div className="chat-message-content">
            Welcome to the chat! How can I help you today?
          </div>
        </div>
      </div>
    );
  }

  return (
    <div role="list" className="chat-messages">
      {messages.map((message: ChatMessage) => (
        <Message
          key={message.id}
          id={message.id}
          content={message.content}
          role={message.role}
          status={message.status}
          timestamp={message.timestamp}
        />
      ))}
    </div>
  );
}
