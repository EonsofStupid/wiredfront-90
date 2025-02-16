
import React, { createContext, useContext, ReactNode } from 'react';
import { DraggableChat } from '@/components/chat/DraggableChat';
import { useMessageSubscription } from '@/hooks/useMessageSubscription';
import { useSessionId } from '@/hooks/useSessionId';

interface ChatContextType {
  isOpen: boolean;
  toggleChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const sessionId = useSessionId();

  const handleNewMessage = React.useCallback((message: any) => {
    console.log('New message received:', message);
  }, []);

  useMessageSubscription(sessionId, handleNewMessage);

  const toggleChat = React.useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <ChatContext.Provider value={{ isOpen, toggleChat }}>
      {children}
      {isOpen && <DraggableChat />}
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
