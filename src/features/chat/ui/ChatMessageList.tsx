import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMessageStore } from '../core/messaging/MessageManager';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Message } from '@/types/chat';
import { Loader2 } from 'lucide-react';

export const ChatMessageList: React.FC = () => {
  const { messages } = useMessageStore();
  const parentRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Virtual list implementation for efficient rendering
  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: (index) => {
      // Estimate based on content length
      const message = messages[index];
      const contentLength = message?.content?.length || 0;
      return Math.max(50, Math.min(200, 20 + contentLength * 0.5));
    },
    overscan: 5,
  });

  // Optimized scroll handling
  useEffect(() => {
    if (!scrollRef.current || messages.length === 0) return;
    
    const scrollElement = scrollRef.current;
    const isAtBottom = 
      scrollElement.scrollHeight - scrollElement.scrollTop <= scrollElement.clientHeight + 100;

    if (isAtBottom) {
      requestAnimationFrame(() => {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      });
    }
  }, [messages.length]);

  const renderMessage = (message: Message) => {
    const isSystem = message.type === 'system';
    const isConnectionMessage = isSystem && message.metadata?.status;

    return (
      <div
        className={`px-4 py-2 ${
          isSystem ? 'flex justify-center' : 
          message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
        }`}
      >
        <div
          className={`rounded-lg px-4 py-2 max-w-[80%] ${
            isSystem 
              ? 'bg-muted/50 text-muted-foreground text-sm'
              : message.role === 'user'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
          }`}
        >
          {isConnectionMessage && message.metadata?.status === 'connecting' && (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{message.content}</span>
            </div>
          )}
          {(!isConnectionMessage || message.metadata?.status !== 'connecting') && (
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          )}
          {message.message_status === 'error' && (
            <p className="text-xs text-destructive mt-1">
              Failed to send message
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <ScrollArea className="flex-1" ref={scrollRef}>
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
              className="absolute top-0 left-0 w-full"
              style={{
                height: virtualRow.size,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {renderMessage(message)}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};
