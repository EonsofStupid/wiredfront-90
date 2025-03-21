
import React from 'react';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/utils/dateUtils';
import { MessageRole, Message } from '@/types/chat';
import { useChatLayoutStore } from '@/stores/chat/layoutStore';

interface ChatMessageProps {
  message: Message;
  className?: string;
}

export function ChatMessage({ message, className }: ChatMessageProps) {
  const { uiPreferences } = useChatLayoutStore();
  const { showTimestamps } = uiPreferences;
  const timestamp = message.timestamp || message.created_at;
  
  const getMessageClassName = (role: MessageRole) => {
    switch (role) {
      case 'user':
        return 'chat-message-user';
      case 'assistant':
        return 'chat-message-assistant';
      case 'system':
        return 'chat-message-system';
      case 'error':
        return 'chat-message-error bg-red-500/20 text-red-200';
      case 'warning':
        return 'chat-message-warning bg-amber-500/20 text-amber-200';
      case 'info':
        return 'chat-message-info bg-blue-500/20 text-blue-200';
      default:
        return 'chat-message-assistant';
    }
  };
  
  return (
    <div 
      className={cn(
        'chat-message',
        getMessageClassName(message.role),
        className
      )}
    >
      <div className="chat-message-content">
        {message.content}
      </div>
      
      {showTimestamps && timestamp && (
        <div className="text-xs opacity-60 mt-1">
          {formatRelativeTime(new Date(timestamp))}
        </div>
      )}
    </div>
  );
}
