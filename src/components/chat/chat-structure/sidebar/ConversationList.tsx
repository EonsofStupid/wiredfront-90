
import React from 'react';
import { useConversationManager } from '../../hooks/conversation';
import { Conversation } from '@/types/chat/conversation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Archive, Trash, RefreshCw } from 'lucide-react';
import { EnumUtils } from '@/lib/enums';

interface ConversationListProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  isArchived: boolean;
}

export function ConversationList({ 
  conversations, 
  currentConversationId,
  isArchived
}: ConversationListProps) {
  const { 
    switchConversation,
    archiveConversation,
    deleteConversation
  } = useConversationManager();
  
  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        {isArchived ? 'No archived conversations' : 'No active conversations'}
      </div>
    );
  }
  
  return (
    <div className="space-y-1 p-2">
      {conversations.map((conversation) => {
        const isActive = currentConversationId === conversation.id;
        const modeLabel = EnumUtils.chatModeToUiMode(
          typeof conversation.mode === 'string'
            ? EnumUtils.stringToChatMode(conversation.mode)
            : conversation.mode
        );
        
        return (
          <div 
            key={conversation.id}
            className={cn(
              "relative group rounded-md",
              isActive && "bg-accent"
            )}
          >
            <Button
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className="w-full justify-start text-left h-auto py-2 px-3"
              onClick={() => switchConversation(conversation.id)}
            >
              <div className="truncate">
                <span>{conversation.title || 'Untitled'}</span>
                <div className="text-xs opacity-70 mt-0.5 flex items-center gap-1">
                  <span className="capitalize">{modeLabel}</span>
                  <span>•</span>
                  <span>{new Date(conversation.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </Button>
            
            <div className={cn(
              "absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1",
              isActive && "opacity-70"
            )}>
              {isArchived ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => archiveConversation(conversation.id, false)}
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => archiveConversation(conversation.id, true)}
                >
                  <Archive className="h-3 w-3" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => deleteConversation(conversation.id)}
              >
                <Trash className="h-3 w-3" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
