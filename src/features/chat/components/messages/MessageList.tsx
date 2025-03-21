import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatModeStore } from '@/stores/features/chat/modeStore';
import type { ChatMessage, Message } from '@/types/chat/messages';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { MessageItem } from './MessageItem';

interface MessageListProps {
  messages: (Message | ChatMessage)[];
  isWaitingForResponse?: boolean;
  onRetry?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, content: string) => void;
}

export function MessageList({
  messages,
  isWaitingForResponse,
  onRetry,
  onDelete,
  onEdit,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentMode = useChatModeStore(state => state.currentMode);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Get welcome message based on current mode
  const getWelcomeMessage = (): string => {
    switch (currentMode) {
      case 'dev':
        return 'I can help you with your code. Ask me anything about development!';
      case 'image':
        return 'Describe the image you want to generate, and I\'ll create it for you.';
      case 'training':
        return 'I\'m here to help you learn. What would you like to practice today?';
      case 'planning':
        return 'Let\'s plan your project together. What are you working on?';
      case 'code':
        return 'I can help you write, review, or debug code. What are you working on?';
      default:
        return 'How can I help you today?';
    }
  };

  // Convert message to Message type if needed
  const convertToMessage = (msg: Message | ChatMessage): Message => {
    if ('timestamp' in msg) return msg;
    const chatMsg = msg as ChatMessage;
    return {
      ...chatMsg,
      timestamp: chatMsg.created_at || new Date().toISOString(),
    };
  };

  return (
    <ScrollArea ref={scrollRef} className="h-full">
      <div className="p-4 space-y-4">
        <div className="text-center opacity-60">
          <p className="text-xs text-white/60">
            {new Date().toLocaleDateString()} • {currentMode.charAt(0).toUpperCase() + currentMode.slice(1)} Mode
          </p>
        </div>

        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="chat-message chat-message-assistant cyber-border cyber-pulse"
          >
            <span className="cyber-glitch" data-text={getWelcomeMessage()}>
              {getWelcomeMessage()}
            </span>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => {
              const message = convertToMessage(msg);
              return (
                <MessageItem
                  key={message.id}
                  message={message}
                  isLast={index === messages.length - 1}
                  onRetry={() => onRetry?.(message.id)}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              );
            })}
          </div>
        )}

        {isWaitingForResponse && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="chat-message chat-message-assistant cyber-border opacity-70 flex items-center space-x-2"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Thinking...</span>
          </motion.div>
        )}
      </div>
    </ScrollArea>
  );
}
