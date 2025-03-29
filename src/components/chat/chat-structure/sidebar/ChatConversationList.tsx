
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Conversation } from '@/components/chat/types/chat/conversation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Loader2 } from 'lucide-react';
import { ChatConversationItem } from './ChatConversationItem';

interface ChatConversationListProps {
  isLoading: boolean;
  activeConversations: Conversation[];
  archivedConversations: Conversation[];
  isOpen: boolean;
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onArchiveConversation: (id: string) => void;
  onRestoreConversation: (id: string) => void;
}

export function ChatConversationList({
  isLoading,
  activeConversations,
  archivedConversations,
  isOpen,
  currentConversationId,
  onSelectConversation,
  onDeleteConversation,
  onArchiveConversation,
  onRestoreConversation
}: ChatConversationListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} className="flex-1 overflow-hidden">
      <CollapsibleContent className="h-full">
        <Tabs defaultValue="active" className="h-full flex flex-col">
          <TabsList className="grid grid-cols-2 mx-3 mt-2">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="flex-1 overflow-hidden">
            <ScrollArea className="h-[calc(100%-2rem)]">
              {activeConversations.length === 0 ? (
                <div className="text-center p-4 text-sm text-muted-foreground">
                  No active conversations
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {activeConversations.map((conversation) => (
                    <ChatConversationItem
                      key={conversation.id}
                      conversation={conversation}
                      isActive={conversation.id === currentConversationId}
                      onClick={() => onSelectConversation(conversation.id)}
                      onDelete={() => onDeleteConversation(conversation.id)}
                      onArchive={() => onArchiveConversation(conversation.id)}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="archived" className="flex-1 overflow-hidden">
            <ScrollArea className="h-[calc(100%-2rem)]">
              {archivedConversations.length === 0 ? (
                <div className="text-center p-4 text-sm text-muted-foreground">
                  No archived conversations
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {archivedConversations.map((conversation) => (
                    <ChatConversationItem
                      key={conversation.id}
                      conversation={conversation}
                      isActive={false}
                      isArchived={true}
                      onClick={() => onSelectConversation(conversation.id)}
                      onDelete={() => onDeleteConversation(conversation.id)}
                      onRestore={() => onRestoreConversation(conversation.id)}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CollapsibleContent>
    </Collapsible>
  );
}
