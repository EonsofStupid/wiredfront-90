
import React from 'react';
import { Conversation } from '@/components/chat/types/chat/conversation';
import { ConversationItem } from './ConversationItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EnumUtils } from '@/lib/enums/EnumUtils';

export interface ConversationListProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  isArchived: boolean;
  onSelectConversation: (id: string) => void;
  onDeleteConversation?: (id: string) => void;
  onArchiveConversation?: (id: string) => void;
  onRestoreConversation?: (id: string) => void;
}

export function ConversationList({
  conversations,
  currentConversationId,
  isArchived,
  onSelectConversation,
  onDeleteConversation,
  onArchiveConversation,
  onRestoreConversation
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        {isArchived 
          ? "No archived conversations" 
          : "No active conversations"
        }
      </div>
    );
  }

  return (
    <ScrollArea className="h-full pr-2">
      <div className="p-2 space-y-1">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isActive={conversation.id === currentConversationId}
            onClick={() => onSelectConversation(conversation.id)}
            onDelete={onDeleteConversation ? () => onDeleteConversation(conversation.id) : undefined}
            onArchive={!isArchived && onArchiveConversation ? () => onArchiveConversation(conversation.id) : undefined}
            onRestore={isArchived && onRestoreConversation ? () => onRestoreConversation(conversation.id) : undefined}
            isArchived={isArchived}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
