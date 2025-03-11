
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { Toaster } from "sonner";
import { useLocation } from 'react-router-dom';
import { useChatUIStore } from '../stores/uiStore';
import { useMessageStore } from '../hooks/useMessageStore';
import { useSessionStore } from '../stores/sessionStore';
import { ChatMode, ChatSessionMetadata } from '../types';

interface ChatContextType {
  isEditorPage: boolean;
  mode: ChatMode;
  setMode: (mode: ChatMode) => void;
  setSessionContext: (metadata: Partial<ChatSessionMetadata>) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isEditorPage = location.pathname === '/editor';
  const { toggleChat, isOpen } = useChatUIStore();
  const { clearMessages } = useMessageStore();
  const { currentSessionId, updateSessionMetadata, loadSessions } = useSessionStore();
  const [mode, setMode] = useState<ChatMode>(isEditorPage ? 'editor' : 'standard');
  const [isInitialized, setIsInitialized] = useState(false);

  // Reset mode when switching pages
  useEffect(() => {
    setMode(isEditorPage ? 'editor' : 'standard');
  }, [isEditorPage]);

  // Initialize session store
  useEffect(() => {
    const initializeChat = async () => {
      if (!isInitialized) {
        await loadSessions();
        setIsInitialized(true);
      }
    };
    
    initializeChat();
  }, [loadSessions, isInitialized]);

  // Set session context data (for GitHub integration, code context, etc.)
  const setSessionContext = async (metadata: Partial<ChatSessionMetadata>) => {
    if (currentSessionId) {
      await updateSessionMetadata(currentSessionId, metadata);
    }
  };

  return (
    <ChatContext.Provider value={{ 
      isEditorPage, 
      mode, 
      setMode,
      setSessionContext
    }}>
      {children}
      <Toaster />
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
