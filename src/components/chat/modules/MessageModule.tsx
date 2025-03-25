
import React, { useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "../Message";
import { useMessageStore } from "../messaging/MessageManager";
import { AnimatePresence, motion } from "framer-motion";
import { useAutoScroll } from '../hooks/useAutoScroll';
import { useErrorBoundary } from '../hooks/useErrorBoundary';
import { MessageSkeleton } from '../components/MessageSkeleton';
import { useChatStore } from '../store/chatStore';

interface MessageModuleProps {
  scrollRef: React.RefObject<HTMLDivElement>;
}

export function MessageModule({ scrollRef }: MessageModuleProps) {
  const { messages } = useMessageStore();
  const { ui } = useChatStore();
  const { scrollToBottom } = useAutoScroll(scrollRef);
  const { ErrorBoundary } = useErrorBoundary();
  
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
        <p className="text-xs text-muted-foreground">Start a conversation by typing a message below</p>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<div className="p-4 text-center">Error displaying messages</div>}>
      <ScrollArea 
        className="w-full h-full relative p-4"
      >
        <div className="space-y-4">
          {messages.map((msg) => (
            <AnimatePresence key={msg.id} initial={false}>
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
                />
              </motion.div>
            </AnimatePresence>
          ))}
          
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
