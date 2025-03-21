
import { useChatMessageStore } from "@/stores/features/chat/messageStore";
import { useChatModeStore } from "@/stores/features/chat/modeStore";
import { cn } from "@/lib/utils";
import React from "react";
import { Message } from "@/types/chat/types";
import ChatMessage from "./ChatMessage";

interface ChatContentProps {
  className?: string;
}

export function ChatContent({ className }: ChatContentProps) {
  const { messages } = useChatMessageStore();
  const { currentMode } = useChatModeStore();
  
  // Generate welcome message based on the current mode
  const getWelcomeMessage = () => {
    switch (currentMode) {
      case 'dev':
        return 'I can help you with your code. Ask me anything about development!';
      case 'image':
        return 'Describe the image you want to generate, and I\'ll create it for you.';
      case 'training':
        return 'I\'m here to help you learn. What would you like to practice today?';
      case 'planning':
        return 'Let\'s plan your project together. What are you working on?';
      case 'code':
        return 'I can help you write, review, or debug code. What are you working on?';
      default:
        return 'How can I help you today?';
    }
  };

  return (
    <div 
      className={cn(
        "chat-content",
        className
      )}
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-center">
          <div className="chat-message chat-message-assistant cyber-border cyber-pulse">
            <span className="cyber-glitch" data-text={getWelcomeMessage()}>
              {getWelcomeMessage()}
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message: Message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatContent;
