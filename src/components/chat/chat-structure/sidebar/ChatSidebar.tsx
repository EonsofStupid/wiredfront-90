
import React from 'react';
import { Card } from "@/components/ui/card";
import { SessionHeader } from "./SessionHeader";
import { SessionList } from "./SessionList";
import { SessionControls } from "./SessionControls";
import { useConversationStore } from '../../store/conversation/store';
import { useEffect, useState } from 'react';
import { Conversation } from '@/types/chat/conversation';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '../../store/chatStore';
import { useTokenStore } from '../../store/token';
import { ChatMode } from '@/types/chat/enums';

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
  
  const [sessionOpen, setSessionOpen] = useState(true);
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
    const newConversationId = createConversation({
      mode: currentMode,
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
      <SessionHeader
        title="Sessions"
        isOpen={sessionOpen} 
        onToggle={() => setSessionOpen(!sessionOpen)}
      />
      
      <SessionList 
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
      
      <SessionControls>
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
      </SessionControls>
    </Card>
  );
}
