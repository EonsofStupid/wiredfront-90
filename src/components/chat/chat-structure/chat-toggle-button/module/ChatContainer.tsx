
import React from 'react';
import { cn } from '@/lib/utils';

export function ChatContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("chat-container relative", className)}>
      {children}
    </div>
  );
}

export default ChatContainer;
