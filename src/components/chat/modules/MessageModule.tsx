
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "../Message";
import { useMessageStore } from "../messaging/MessageManager";

interface MessageModuleProps {
  scrollRef: React.RefObject<HTMLDivElement>;
}

export function MessageModule({ scrollRef }: MessageModuleProps) {
  const { messages } = useMessageStore();

  return (
    <ScrollArea 
      ref={scrollRef}
      className="h-[300px] w-full pr-4"
    >
      <div className="flex flex-col gap-4">
        {messages.map((msg) => (
          <Message
            key={msg.id}
            content={msg.content}
            role={msg.role}
            status={msg.message_status}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
