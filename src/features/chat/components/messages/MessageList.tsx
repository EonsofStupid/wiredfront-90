import { ScrollArea } from '@/components/ui/scroll-area';
import React, { useEffect, useRef } from 'react';
import type { ChatMessage } from '../../types';
import { MessageItem } from './MessageItem';

interface MessageListProps {
  messages: ChatMessage[];
  onCopyMessage?: (message: ChatMessage) => void;
  onDeleteMessage?: (message: ChatMessage) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  onCopyMessage,
  onDeleteMessage,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>No messages yet. Start a conversation!</p>
      </div>
    );
  }

  return (
    <ScrollArea ref={scrollRef} className="h-full">
      <div className="divide-y">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            onCopy={onCopyMessage}
            onDelete={onDeleteMessage}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
