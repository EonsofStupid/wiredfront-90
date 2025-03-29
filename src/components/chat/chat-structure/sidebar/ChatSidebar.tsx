
import React, { useState } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useConversationManager } from '../../hooks/conversation/useConversationManager';
import { Conversation } from '@/components/chat/types/chat/conversation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMode } from '@/components/chat/types/chat/enums';
import { ConversationList } from './ConversationList';
import { EnumUtils } from '@/lib/enums/EnumUtils';

export function ChatSidebar() {
  const { currentMode } = useChatStore();
  const { 
    activeConversations, 
    archivedConversations, 
    createConversation,
    currentConversationId,
    switchConversation,
    archiveConversation,
    deleteConversation,
    updateConversation
  } = useConversationManager();
  
  const [view, setView] = useState<'active' | 'archived'>('active');
  const [isCreating, setIsCreating] = useState(false);
  
  const handleCreateConversation = async () => {
    if (isCreating) return;
    
    setIsCreating(true);
    try {
      // Convert string mode to ChatMode enum if needed
      const chatMode = typeof currentMode === 'string' 
        ? EnumUtils.stringToChatMode(currentMode) 
        : currentMode;
      
      await createConversation({
        mode: chatMode,
        title: `New ${EnumUtils.getChatModeLabel(chatMode)} conversation`
      });
    } catch (error) {
      console.error('Failed to create conversation:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRestoreConversation = async (id: string) => {
    // Unarchive conversation
    await updateConversation(id, { archived: false });
  };
  
  return (
    <div className="h-full w-[240px] flex flex-col border-r border-border/50 bg-background/30 backdrop-blur-sm">
      <div className="p-3 border-b border-border/50">
        <h2 className="text-sm font-medium">Conversations</h2>
      </div>
      
      <div className="flex p-2 border-b border-border/50">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex-1 text-xs",
            view === 'active' && "bg-accent text-accent-foreground"
          )}
          onClick={() => setView('active')}
        >
          Active
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex-1 text-xs",
            view === 'archived' && "bg-accent text-accent-foreground"
          )}
          onClick={() => setView('archived')}
        >
          Archived
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {view === 'active' ? (
          <ConversationList 
            conversations={activeConversations}
            currentConversationId={currentConversationId}
            isArchived={false}
            onSelectConversation={switchConversation}
            onArchiveConversation={archiveConversation}
            onDeleteConversation={deleteConversation}
          />
        ) : (
          <ConversationList 
            conversations={archivedConversations}
            currentConversationId={currentConversationId}
            isArchived={true}
            onSelectConversation={switchConversation}
            onRestoreConversation={handleRestoreConversation}
            onDeleteConversation={deleteConversation}
          />
        )}
      </div>
      
      <div className="p-2 border-t border-border/50">
        <Button
          className="w-full justify-start"
          size="sm"
          onClick={handleCreateConversation}
          disabled={isCreating}
        >
          <MessageSquarePlus className="h-4 w-4 mr-2" />
          New Conversation
        </Button>
      </div>
    </div>
  );
}
