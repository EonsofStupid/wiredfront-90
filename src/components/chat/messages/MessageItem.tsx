import { cn } from '@/lib/utils';
import { chatLayoutStateAtom } from '@/stores/ui/chat/layout/atoms';
import type { Message } from '@/types/chat';
import { useAtom } from 'jotai';
import React from 'react';

interface MessageItemProps {
  message: Message;
  className?: string;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, className }) => {
  const [layout] = useAtom(chatLayoutStateAtom);
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
          layout.uiPreferences.fontSize === 'small' && 'text-sm',
          layout.uiPreferences.fontSize === 'large' && 'text-lg'
        )}
      >
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
        {layout.uiPreferences.showTimestamps && (
          <div className="mt-1 text-xs opacity-70">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};
