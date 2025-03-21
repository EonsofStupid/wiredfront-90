import { chatLayoutStateAtom } from '@/features/chat/store/layout/atoms';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import React from 'react';

interface ChatContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ children, className }) => {
  const [layout] = useAtom(chatLayoutStateAtom);

  return (
    <div
      className={cn(
        'flex flex-col h-full w-full bg-[var(--chat-bg-primary)] text-[var(--chat-text-primary)]',
        'transition-all duration-[var(--chat-transition-normal)]',
        layout.isMinimized ? 'rounded-lg shadow-lg' : 'rounded-none shadow-none',
        className
      )}
      style={{
        transform: `scale(${layout.scale})`,
        transformOrigin: 'top left'
      }}
    >
      {children}
    </div>
  );
};
