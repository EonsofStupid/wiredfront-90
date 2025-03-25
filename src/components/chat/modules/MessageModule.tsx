import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { logger } from "@/services/chat/LoggingService";
import { MessageStatus } from "@/types/chat";
import { useVirtualizer } from "@tanstack/react-virtual";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect } from "react";
import { useAutoScroll } from "../hooks/useAutoScroll";
import { useErrorBoundary } from "../hooks/useErrorBoundary";
import { Message as MessageComponent } from "../Message";
import { useMessageStore } from "../messaging/MessageManager";
import { useChatStore } from "../store/chatStore";

interface MessageModuleProps {
  scrollRef: React.RefObject<HTMLDivElement>;
}

function MessageSkeleton({
  role,
  lines,
}: {
  role: "user" | "assistant";
  lines: number;
}) {
  return (
    <div
      className={`flex ${
        role === "user" ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div className="max-w-[80%]">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full mb-2" />
        ))}
      </div>
    </div>
  );
}

// Map MessageStatus to Message component status
function mapMessageStatus(
  status: MessageStatus
): "pending" | "sent" | "failed" {
  switch (status) {
    case "error":
      return "failed";
    case "cached":
      return "sent";
    default:
      return status as "pending" | "sent" | "failed";
  }
}

export function MessageModule({ scrollRef }: MessageModuleProps) {
  const { messages } = useMessageStore();
  const { ui } = useChatStore();
  const { scrollToBottom } = useAutoScroll(scrollRef);
  const { ErrorBoundary, DefaultErrorFallback } = useErrorBoundary();

  // Handle retry logic for failed messages
  const handleRetry = useCallback((messageId: string) => {
    logger.info("Attempting to retry message", { messageId });
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
          <MessageSkeleton role="user" lines={1} />
          <MessageSkeleton role="assistant" lines={2} />
          <MessageSkeleton role="user" lines={1} />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-muted-foreground mb-2">No messages yet</p>
        <p className="text-xs text-muted-foreground">
          Start a conversation by typing a message below
        </p>
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
                    <MessageComponent
                      content={msg.content}
                      role={msg.role}
                      status={mapMessageStatus(msg.message_status)}
                      id={msg.id}
                      timestamp={msg.created_at}
                      onRetry={handleRetry}
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
              <MessageSkeleton role="assistant" lines={3} />
            </motion.div>
          )}
        </div>
      </ScrollArea>
    </ErrorBoundary>
  );
}
