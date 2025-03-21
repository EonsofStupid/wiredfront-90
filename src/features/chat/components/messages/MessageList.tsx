import { cn } from '@/lib/utils';
import { Message } from '@/types/chat/types';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { MessageItem } from './MessageItem';

interface MessageListProps {
  messages: Message[];
  className?: string;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, className }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className={cn('flex flex-col gap-4 overflow-y-auto', className)}
    >
      <AnimatePresence mode="popLayout">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <MessageItem message={message} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
