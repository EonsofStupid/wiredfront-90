
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ConversationItem } from './ConversationItem';
import { useConversationManager } from '@/components/chat/hooks/conversation/useConversationManager';
import { Conversation } from '@/types/chat/conversation';
import { ChatMode } from '@/types/chat/enums';
import { EnumUtils } from '@/lib/enums';

export function ConversationList() {
  const { 
    activeConversations, 
    createConversation, 
    switchConversation, 
    currentConversationId 
  } = useConversationManager();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  
  // Filter conversations based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConversations(activeConversations);
      return;
    }
    
    const filtered = activeConversations.filter(
      conv => conv.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredConversations(filtered);
  }, [searchQuery, activeConversations]);
  
  // Handle new conversation click
  const handleNewConversation = async () => {
    await createConversation();
  };
  
  // Create a specialized conversation
  const createSpecializedChat = async (mode: ChatMode) => {
    await createConversation({
      mode,
      title: `New ${EnumUtils.getChatModeLabel(mode)} Chat`
    });
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Button 
          onClick={handleNewConversation}
          className="w-full justify-start bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Chat
        </Button>
        
        <div className="mt-2 flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 text-xs"
            onClick={() => createSpecializedChat(ChatMode.Dev)}
          >
            Dev
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 text-xs"
            onClick={() => createSpecializedChat(ChatMode.Image)}
          >
            Image
          </Button>
        </div>
      </div>
      
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-9 w-9"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === currentConversationId}
                onClick={() => switchConversation(conversation.id)}
              />
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {searchQuery ? 'No matching conversations' : 'No conversations found'}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
