
import React from 'react';
import { cn } from '@/lib/utils';
import { Message } from '@/types/chat';

interface ChatMessageProps {
  message: Message;
  className?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, className = '' }) => {
  const isUser = message.role === 'user';
  
  return (
    <div
      className={cn(
        'chat-message',
        isUser ? 'chat-message-user ml-auto' : 'chat-message-assistant',
        message.message_status === 'error' && 'border-destructive/40',
        className
      )}
    >
      <div className="message-content">
        {message.content}
      </div>
      
      {message.timestamp && (
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
