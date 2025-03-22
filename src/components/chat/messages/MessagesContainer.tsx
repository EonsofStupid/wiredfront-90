import type { Message } from "@/types/chat";
import React from "react";
import { MessageItem } from "./MessageItem";
import { MessagePreferencesProvider } from "./MessagePreferences";

interface MessagesContainerProps {
  messages: Message[];
  className?: string;
}

export const MessagesContainer: React.FC<MessagesContainerProps> = ({
  messages,
  className,
}) => {
  return (
    <MessagePreferencesProvider>
      <div className={className}>
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </div>
    </MessagePreferencesProvider>
  );
};
