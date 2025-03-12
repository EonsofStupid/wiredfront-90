
import React, { useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "../Message";
import { useMessageStore } from "../messaging/MessageManager";
import { AnimatePresence, motion } from "framer-motion";
import { useAutoScroll } from '../hooks/useAutoScroll';

interface MessageModuleProps {
  scrollRef: React.RefObject<HTMLDivElement>;
}

export function MessageModule({ scrollRef }: MessageModuleProps) {
  const { messages } = useMessageStore();
  const { scrollToBottom } = useAutoScroll(scrollRef);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length, scrollToBottom]);

  return (
    <ScrollArea 
      ref={scrollRef}
      className="h-[300px] w-full pr-4 chat-messages-container"
    >
      <div className="flex flex-col gap-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Message
                content={msg.content}
                role={msg.role}
                status={msg.message_status}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
}
