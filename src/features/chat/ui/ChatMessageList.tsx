import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMessageStore } from '../core/messaging/MessageManager';

export const ChatMessageList: React.FC = () => {
  const { messages } = useMessageStore();

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-[80%] ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              {message.status === 'error' && (
                <p className="text-xs text-destructive mt-1">
                  Failed to send message
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};