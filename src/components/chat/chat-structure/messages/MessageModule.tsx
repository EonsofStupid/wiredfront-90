
import React, { useEffect, useCallback } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "./Message";
import { useMessageStore } from "../../messaging/MessageManager";
import { AnimatePresence, motion } from "framer-motion";
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useErrorBoundary } from '../../hooks/useErrorBoundary';
import { MessageSkeleton } from '../../shared/MessageSkeleton';
import { logger } from '@/services/chat/LoggingService';
import { useChatStore } from '../../store/chatStore';
import { MessageRole, MessageStatus, MessageType } from '@/types/chat/enums';

interface MessageModuleProps {
  scrollRef: React.RefObject<HTMLDivElement>;
}

export function MessageModule({ scrollRef }: MessageModuleProps) {
  const { messages } = useMessageStore();
  const { ui } = useChatStore();
  const { scrollToBottom } = useAutoScroll(scrollRef);
  const { ErrorBoundary, DefaultErrorFallback } = useErrorBoundary();
  
  // Handle retry logic for failed messages
  const handleRetry = useCallback((messageId: string) => {
    logger.info('Attempting to retry message', { messageId });
    // In a real implementation, we would call a function from useMessageStore 
    // to retry sending the message
  }, []);
  
  // Virtual list implementation for performance optimization
  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 80, // Estimated height of each message
    overscan: 5, // Number of items to render outside of the visible area
  });
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length, scrollToBottom]);
  
  if (messages.length === 0) {
    if (ui.sessionLoading) {
      return (
        <div className="flex flex-col gap-4 p-4">
          <MessageSkeleton role={MessageRole.User} lines={1} />
          <MessageSkeleton role={MessageRole.Assistant} lines={2} />
          <MessageSkeleton role={MessageRole.User} lines={1} />
        </div>
      );
    }
    
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
        className="w-full h-full chat-messages-container relative"
      >
        <div 
          className="relative w-full"
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const msg = messages[virtualItem.index];
            // Convert string status to enum if needed
            const messageStatus = typeof msg.message_status === 'string' 
              ? msg.message_status as MessageStatus 
              : msg.message_status;
            
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
                      status={messageStatus}
                      id={msg.id}
                      timestamp={msg.created_at}
                      onRetry={handleRetry}
                      type={msg.type || MessageType.Text}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            );
          })}
          
          {/* Render loading indicator for new message */}
          {ui.messageLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4"
            >
              <MessageSkeleton role={MessageRole.Assistant} lines={3} />
            </motion.div>
          )}
        </div>
      </ScrollArea>
    </ErrorBoundary>
  );
}
