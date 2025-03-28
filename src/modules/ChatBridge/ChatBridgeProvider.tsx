
import React, { createContext, useContext, ReactNode } from 'react';

interface ChatBridgeContextType {
  sendMessage: (message: string) => void;
}

const ChatBridgeContext = createContext<ChatBridgeContextType | undefined>(undefined);

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

export const ChatBridgeProvider: React.FC<ChatBridgeProviderProps> = ({ children }) => {
  const sendMessage = (message: string) => {
    console.log('Message sent:', message);
  };

  return (
    <ChatBridgeContext.Provider value={{ sendMessage }}>
      {children}
    </ChatBridgeContext.Provider>
  );
};

export default useChatBridge;
