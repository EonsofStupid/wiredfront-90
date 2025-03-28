
import React from 'react';
import { Card } from "@/components/ui/card";
import { ChatSessionHeader } from "./ChatSessionHeader";
import { ChatSessionList } from "./ChatSessionList";
import { ChatSessionControls } from "./ChatSessionControls";
import { useConversationStore } from '../../store/conversation/store';
import { useEffect, useState } from 'react';
import { Conversation } from '@/types/chat/conversation';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '../../store/chatStore';
import { useTokenStore } from '../../store/token';
import { ChatMode } from '@/types/chat/enums';
import { chatModeForDatabase } from '../../types/enums-mapper';

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
  
  const [ChatsessionOpen, setChatSessionOpen] = useState(true);
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
  
  const handleDeleteSession = (sessionId: string) => {
    deleteConversation(sessionId);
  };
  
  const handleArchiveSession = (sessionId: string) => {
    archiveConversation(sessionId);
  };
  
  const handleCreateSession = () => {
    const dbMode = chatModeForDatabase(currentMode);
    const newConversationId = createConversation({
      mode: dbMode,
      title: "New Conversation"
    });
    
    setCurrentConversationId(newConversationId);
  };
  
  const handleRestoreSession = (sessionId: string) => {
    updateConversation(sessionId, { archived: false });
  };
  
  const handleSelectSession = (sessionId: string) => {
    setCurrentConversationId(sessionId);
  };

  return (
    <Card className="w-[250px] h-full glass-card neon-border flex flex-col overflow-hidden">
      <ChatSessionHeader
        title="Conversations"
        isOpen={sessionOpen} 
        onToggle={() => setChatSessionOpen(!sessionOpen)}
      />
      
      <ChatSessionList 
        isLoading={isLoading}
        activeConversations={activeConversations}
        archivedConversations={archivedConversations}
        isOpen={sessionOpen}
        currentSessionId={currentConversationId}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onArchiveSession={handleArchiveSession}
        onRestoreSession={handleRestoreSession}
      />
      
      <ChatSessionControls>
        <div className="flex justify-center p-2">
          <Button 
            variant="outline" 
            size="sm"
            className="w-full"
            onClick={handleCreateSession}
            disabled={balance <= 0}
          >
            <PlusCircle className="h-4 w-4 mr-2" /> 
            New Conversation
          </Button>
        </div>
      </ChatSessionControls>
    </Card>
  );
}
