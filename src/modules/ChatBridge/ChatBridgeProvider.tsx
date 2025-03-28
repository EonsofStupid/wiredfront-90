
import React, { createContext, useContext, useMemo } from 'react';
import { ChatBridge } from './ChatBridge';
import { ChatBridge as ChatBridgeInterface } from '@/types/chat/bridge';

// Create context for using the bridge
const ChatBridgeContext = createContext<ChatBridgeInterface | null>(null);

/**
 * Hook to access the chat bridge
 */
export const useChatBridge = () => {
  const context = useContext(ChatBridgeContext);
  if (!context) {
    throw new Error('useChatBridge must be used within a ChatBridgeProvider');
  }
  return context;
};

/**
 * Component that provides the ChatBridge to the app
 */
export const ChatBridgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Create a memoized instance of the bridge
  const bridge = useMemo(() => new ChatBridge(), []);
  
  // Render the provider
  return (
    <ChatBridgeContext.Provider value={bridge}>
      {children}
    </ChatBridgeContext.Provider>
  );
};
