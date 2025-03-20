import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Copy, Trash2 } from 'lucide-react';
import React from 'react';
import { messageStyles as styles } from '../../styles';
import type { ChatMessage } from '../../types';

interface MessageItemProps {
  message: ChatMessage;
  onCopy?: (message: ChatMessage) => void;
  onDelete?: (message: ChatMessage) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onCopy,
  onDelete,
}) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  return (
    <div
      className={cn(styles.message, {
        [styles.messageUser]: isUser,
        [styles.messageAssistant]: !isUser && !isSystem,
        [styles.messageSystem]: isSystem,
      })}
    >
      <Avatar
        className={cn(
          'h-8 w-8',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        <span className="text-xs">{isUser ? 'U' : 'A'}</span>
      </Avatar>
      <div className={styles.messageContent}>
        <div className={styles.messageHeader}>
          <span className={styles.messageSender}>
            {isUser ? 'You' : isSystem ? 'System' : 'Assistant'}
          </span>
          <div className={styles.messageActions}>
            {onCopy && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onCopy(message)}
                title="Copy message"
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(message)}
                title="Delete message"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <div className={styles.messageText}>
          {message.content}
        </div>
        {message.metadata && (
          <div className={styles.messageTimestamp}>
            {new Date(message.createdAt).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};
