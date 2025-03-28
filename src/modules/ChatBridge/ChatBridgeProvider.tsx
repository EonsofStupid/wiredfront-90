
import React, { createContext, useContext, ReactNode } from 'react';
import { ChatBridge } from './ChatBridge';

// Context for the chat bridge
const ChatBridgeContext = createContext<ChatBridge | undefined>(undefined);

// Hook to use the chat bridge
export const useChatBridge = () => {
  const context = useContext(ChatBridgeContext);
  if (context === undefined) {
    throw new Error('useChatBridge must be used within a ChatBridgeProvider');
  }
  return context;
};

interface ChatBridgeProviderProps {
  children: ReactNode;
}

// Provider component for the chat bridge
export const ChatBridgeProvider: React.FC<ChatBridgeProviderProps> = ({ children }) => {
  // Create a new ChatBridge instance
  const chatBridge = new ChatBridge();

  return (
    <ChatBridgeContext.Provider value={chatBridge}>
      {children}
    </ChatBridgeContext.Provider>
  );
};
