import React, { useEffect, useCallback } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "../Message";
import { useMessageStore } from "../messaging/MessageManager";
import { AnimatePresence, motion } from "framer-motion";
import { useAutoScroll } from '../hooks/useAutoScroll';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useErrorBoundary } from '../hooks/useErrorBoundary';
import { logger } from '@/services/chat/LoggingService';

interface MessageModuleProps {
  scrollRef: React.RefObject<HTMLDivElement>;
}

export function MessageModule({ scrollRef }: MessageModuleProps) {
  const { messages } = useMessageStore();
  const { scrollToBottom } = useAutoScroll(scrollRef);
  const { ErrorBoundary, DefaultErrorFallback } = useErrorBoundary();
  
  const handleRetry = useCallback((messageId: string) => {
    logger.info('Attempting to retry message', { messageId });
  }, []);
  
  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });
  
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length, scrollToBottom]);
  
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-muted-foreground mb-2">No messages yet</p>
        <p className="text-xs text-muted-foreground">Start a conversation by typing a message below</p>
      </div>
    );
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 text-center">
          <DefaultErrorFallback />
          <p className="text-sm text-muted-foreground mt-2">
            There was an error displaying messages
          </p>
        </div>
      }
    >
      <ScrollArea 
        ref={scrollRef}
        className="h-[calc(100vh-280px)] pr-4 relative chat-messages-container"
      >
        <div 
          className="relative w-full min-h-full"
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const msg = messages[virtualItem.index];
            return (
              <div
                key={msg.id}
                data-index={virtualItem.index}
                className="absolute top-0 left-0 w-full"
                style={{ transform: `translateY(${virtualItem.start}px)` }}
              >
                <AnimatePresence initial={false}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Message
                      content={msg.content}
                      role={msg.role}
                      status={msg.message_status}
                      id={msg.id}
                      timestamp={msg.timestamp}
                      onRetry={handleRetry}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </ErrorBoundary>
  );
}
