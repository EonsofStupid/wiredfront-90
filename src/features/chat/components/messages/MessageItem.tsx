import { useChatLayoutStore } from '@/features/chat/store/chatLayoutStore';
import { cn } from '@/lib/utils';
import { Message } from '@/types/chat/types';
import { format } from 'date-fns';
import React from 'react';

interface MessageItemProps {
  message: Message;
  className?: string;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, className }) => {
  const { uiPreferences } = useChatLayoutStore();
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex w-full gap-2 p-2',
        isUser ? 'justify-end' : 'justify-start',
        className
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-lg p-3',
          'transition-all duration-[var(--chat-transition-normal)]',
          isUser
            ? 'bg-[var(--chat-accent-color)] text-white'
            : 'bg-[var(--chat-bg-secondary)] text-[var(--chat-text-primary)]',
          uiPreferences.fontSize === 'small' && 'text-sm',
          uiPreferences.fontSize === 'large' && 'text-lg'
        )}
      >
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
        {uiPreferences.showTimestamps && (
          <div className="mt-1 text-xs opacity-70">
            {format(new Date(message.timestamp), 'HH:mm')}
          </div>
        )}
      </div>
    </div>
  );
};
