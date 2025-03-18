
import React from 'react';
import { cn } from '@/lib/utils';
import { Message } from '@/types/chat';

interface ChatMessageProps {
  message: Message;
  className?: string;
  showTimestamp?: boolean;
  isCompact?: boolean;
  isHighlighted?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  className = '',
  showTimestamp = true,
  isCompact = false,
  isHighlighted = false
}) => {
  const isUser = message.role === 'user';
  const isError = message.message_status === 'error';
  const isSystem = message.role === 'system';
  
  return (
    <div
      className={cn(
        'chat-message mb-3 max-w-[85%]',
        isUser ? 'chat-message-user ml-auto' : 'chat-message-assistant',
        isSystem && 'chat-message-system mx-auto max-w-[95%] italic text-center',
        isError && 'border-destructive/40',
        isCompact && 'py-1.5 px-2.5',
        isHighlighted && 'ring-2 ring-neon-blue/50 shadow-[0_0_10px_rgba(0,255,255,0.3)]',
        className
      )}
    >
      <div className={cn(
        "message-content",
        isUser ? 'bg-neon-blue/20 text-white' : 'bg-dark-lighter text-white',
        isSystem && 'bg-black/40 text-white/70',
        'p-3 rounded-lg',
        isUser ? 'rounded-br-sm' : 'rounded-bl-sm',
        'border border-white/10'
      )}>
        {message.content}
      </div>
      
      {showTimestamp && message.timestamp && (
        <div className="text-[10px] opacity-50 mt-1 text-right">
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit'
          })}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
