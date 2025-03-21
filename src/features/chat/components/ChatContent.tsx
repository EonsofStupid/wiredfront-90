
import { useChatMessageStore } from "@/stores/features/chat/messageStore";
import { cn } from "@/lib/utils";
import React from "react";
import { Message } from "@/types/chat";
import { ChatMessage } from "./ChatMessage";

interface ChatContentProps {
  className?: string;
}

export function ChatContent({ className }: ChatContentProps) {
  const { messages } = useChatMessageStore();

  return (
    <div 
      className={cn(
        "chat-messages p-4 overflow-y-auto",
        className
      )}
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-center text-white/60">
          <div>
            <p className="mb-2">No messages yet.</p>
            <p className="text-sm">Start the conversation by typing below.</p>
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
