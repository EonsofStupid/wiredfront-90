import { useChatLayoutStore } from '@/features/chat/store/chatLayoutStore';
import { useChatMessageStore } from '@/features/chat/store/messageStore';
import { useChatModeStore } from '@/features/chat/store/modeStore';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { ChatHeader } from '../ChatHeader';
import { ChatInputArea } from '../ChatInputArea';
import { MessageList } from '../messages/MessageList';

interface ChatContentProps {
  className?: string;
}

export const ChatContent: React.FC<ChatContentProps> = ({ className }) => {
  const { isMinimized, isOpen } = useChatLayoutStore();
  const { messages } = useChatMessageStore();
  const { currentMode } = useChatModeStore();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex flex-col h-full bg-background border rounded-lg shadow-lg overflow-hidden',
        isMinimized ? 'w-96' : 'w-[600px]',
        className
      )}
    >
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="popLayout">
          <MessageList messages={messages} />
        </AnimatePresence>
      </div>
      <ChatInputArea />
    </motion.div>
  );
};
