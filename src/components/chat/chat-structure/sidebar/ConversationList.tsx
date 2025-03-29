
import React from 'react';
import { Conversation } from '@/types/chat/conversation';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ConversationItem } from './ConversationItem';
import { EnumUtils } from '@/lib/enums/EnumUtils';

interface ConversationListProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  isArchived?: boolean;
  onSelectConversation: (id: string) => void;
}

export function ConversationList({
  conversations,
  currentConversationId,
  isArchived = false,
  onSelectConversation
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        {isArchived 
          ? "No archived conversations found" 
          : "No active conversations yet"
        }
      </div>
    );
  }

  // Sort conversations by last accessed (recent first)
  const sortedConversations = [...conversations].sort((a, b) => {
    const dateA = new Date(a.last_accessed || a.created_at).getTime();
    const dateB = new Date(b.last_accessed || b.created_at).getTime();
    return dateB - dateA;
  });

  // Group conversations by mode
  const groupedConversations: Record<string, Conversation[]> = {};
  
  sortedConversations.forEach(conversation => {
    const mode = typeof conversation.mode === 'string' 
      ? conversation.mode 
      : EnumUtils.chatModeToString(conversation.mode);
    
    const modeLabel = EnumUtils.getChatModeLabel(
      typeof conversation.mode === 'string' 
        ? EnumUtils.stringToChatMode(conversation.mode) 
        : conversation.mode
    );
    
    if (!groupedConversations[mode]) {
      groupedConversations[mode] = [];
    }
    
    groupedConversations[mode].push(conversation);
  });

  return (
    <ScrollArea className={cn("h-full", isArchived ? "opacity-75" : "")}>
      <div className="px-1 py-2">
        {Object.entries(groupedConversations).map(([mode, modeConversations]) => (
          <div key={mode} className="mb-3">
            <div className="px-2 mb-1 text-xs font-semibold text-muted-foreground">
              {EnumUtils.getChatModeLabel(EnumUtils.stringToChatMode(mode))}
            </div>
            {modeConversations.map(conversation => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === currentConversationId}
                onClick={() => onSelectConversation(conversation.id)}
              />
            ))}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
