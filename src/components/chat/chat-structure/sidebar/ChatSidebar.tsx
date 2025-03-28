
import React from 'react';
import { Card } from "@/components/ui/card";
import { ChatConversationHeader } from "./ChatConversationHeader";
import { ChatConversationList } from "./ChatConversationList";
import { ChatConversationControls } from "./ChatConversationControls";
import { useConversationStore } from '../../store/conversation/store';
import { useEffect, useState } from 'react';
import { Conversation } from '@/types/chat/conversation';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '../../store/chatStore';
import { useTokenStore } from '../../store/token';
import { ChatMode } from '@/types/chat/enums';
import { EnumUtils } from '@/lib/enums';

export function ChatSidebar() {
  const navigate = useNavigate();
  const { balance } = useTokenStore();
  const { 
    conversations, 
    fetchConversations, 
    isLoading,
    createConversation,
    currentConversationId,
    setCurrentConversationId,
    updateConversation,
    archiveConversation,
    deleteConversation
  } = useConversationStore();
  
  const [conversationOpen, setConversationOpen] = useState(true);
  const [activeConversations, setActiveConversations] = useState<Conversation[]>([]);
  const [archivedConversations, setArchivedConversations] = useState<Conversation[]>([]);
  
  const { currentMode } = useChatStore();
  
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);
  
  useEffect(() => {
    if (conversations.length > 0) {
      setActiveConversations(conversations.filter(c => !c.archived));
      setArchivedConversations(conversations.filter(c => c.archived));
    }
  }, [conversations]);
  
  const handleDeleteConversation = (conversationId: string) => {
    deleteConversation(conversationId);
  };
  
  const handleArchiveConversation = (conversationId: string) => {
    archiveConversation(conversationId);
  };
  
  const handleCreateConversation = () => {
    const dbMode = EnumUtils.chatModeForDatabase(currentMode);
    const newConversationId = createConversation({
      mode: dbMode,
      title: "New Conversation"
    });
    
    setCurrentConversationId(newConversationId);
  };
  
  const handleRestoreConversation = (conversationId: string) => {
    updateConversation(conversationId, { archived: false });
  };
  
  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
  };

  return (
    <Card className="w-[250px] h-full glass-card neon-border flex flex-col overflow-hidden">
      <ChatConversationHeader
        title="Conversations"
        isOpen={conversationOpen} 
        onToggle={() => setConversationOpen(!conversationOpen)}
      />
      
      <ChatConversationList 
        isLoading={isLoading}
        activeConversations={activeConversations}
        archivedConversations={archivedConversations}
        isOpen={conversationOpen}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onArchiveConversation={handleArchiveConversation}
        onRestoreConversation={handleRestoreConversation}
      />
      
      <ChatConversationControls>
        <div className="flex justify-center p-2">
          <Button 
            variant="outline" 
            size="sm"
            className="w-full"
            onClick={handleCreateConversation}
            disabled={balance <= 0}
          >
            <PlusCircle className="h-4 w-4 mr-2" /> 
            New Conversation
          </Button>
        </div>
      </ChatConversationControls>
    </Card>
  );
}
