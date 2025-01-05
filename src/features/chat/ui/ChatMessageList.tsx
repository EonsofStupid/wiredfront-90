import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMessageStore } from '../core/messaging/MessageManager';
import { useVirtualizer } from '@tanstack/react-virtual';

export const ChatMessageList: React.FC = () => {
  const { messages } = useMessageStore();
  const parentRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Virtual list implementation for efficient rendering
  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 50, // Estimated height of each message
    overscan: 5, // Number of items to render outside of the visible area
  });

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
      <div
        ref={parentRef}
        className="relative w-full"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const message = messages[virtualRow.index];
          return (
            <div
              key={message.id}
              className={`absolute top-0 left-0 w-full ${
                message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
              }`}
              style={{
                height: virtualRow.size,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {message.message_status === 'error' && (
                  <p className="text-xs text-destructive mt-1">
                    Failed to send message
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};