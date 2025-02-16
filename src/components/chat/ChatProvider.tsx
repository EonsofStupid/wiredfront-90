
import React, { createContext, useContext, ReactNode } from 'react';
import { Toaster } from "sonner";

interface ChatContextType {
  isOpen: boolean;
  toggleChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleChat = React.useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <ChatContext.Provider value={{ isOpen, toggleChat }}>
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
