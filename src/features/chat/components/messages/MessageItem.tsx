import { CodeBlock } from '@/components/ui/code-block';
import { cn } from '@/lib/utils';
import { Message } from '@/types/chat/messages';
import { formatMessageTimestamp } from '@/utils/messageConversion';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, Clock, Sparkles, Terminal, User } from 'lucide-react';
import React, { useState } from 'react';
import { MessageActions } from './MessageActions';

interface MessageItemProps {
  message: Message;
  isLast?: boolean;
  onRetry?: () => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, content: string) => void;
}

export function MessageItem({
  message,
  isLast,
  onRetry,
  onDelete,
  onEdit
}: MessageItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  // Get message status with backward compatibility
  const messageStatus = message.message_status || message.status || 'sent';
  const isStreaming = messageStatus === 'pending';

  // Get timestamp with backward compatibility
  const timestamp = message.timestamp || message.created_at || new Date().toISOString();

  // Determine icon based on role
  const getIcon = () => {
    if (isUser) return <User className="h-4 w-4 text-neon-pink" />;
    if (isSystem) return <Terminal className="h-4 w-4 text-neon-green" />;
    return <Bot className="h-4 w-4 text-neon-blue" />;
  };

  // Add animation when component mounts
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "chat-message flex items-start gap-2 mb-4 group",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className={cn(
        "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
        isUser ? "bg-neon-pink/20" : isSystem ? "bg-neon-green/20" : "bg-neon-blue/20",
        isUser ? "cyber-border-pink" : isSystem ? "cyber-border-green" : "cyber-border"
      )}>
        {getIcon()}
      </div>

      <div className={cn(
        "max-w-[80%] px-4 py-2 rounded-lg relative",
        isUser ?
          "chat-message-user cyber-border-pink text-right ml-auto" :
          isSystem ?
            "bg-dark-purple/40 cyber-border-green text-left mr-auto" :
            "chat-message-assistant cyber-border text-left mr-auto",
        isStreaming && "chat-pulse"
      )}>
        <div className="text-sm">
          <CodeBlock content={message.content} />
          {isStreaming && (
            <span className="chat-typing-indicator ml-1">
              <span></span>
              <span></span>
              <span></span>
            </span>
          )}
        </div>

        <div className="text-xs opacity-50 mt-1 flex items-center justify-end gap-1">
          {isUser && <ArrowRight className="h-3 w-3" />}
          {messageStatus === 'pending' && <Clock className="h-3 w-3 animate-spin" />}
          {formatMessageTimestamp(timestamp)}
          {!isUser && !isSystem && <Sparkles className="h-3 w-3 ml-1" />}
        </div>

        <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <MessageActions
            messageId={message.id}
            content={message.content}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>
      </div>
    </motion.div>
  );
}
