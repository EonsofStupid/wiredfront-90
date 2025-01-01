import React, { createContext, useContext, useEffect } from 'react';
import { ChatWindow } from './ui/ChatWindow';
import { useMessageStore } from './core/messaging/MessageManager';
import { useWindowStore } from './core/window/WindowManager';

interface ChatContextValue {
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addMessage, clearMessages } = useMessageStore();
  const { resetPosition } = useWindowStore();

  useEffect(() => {
    // Initialize chat position
    resetPosition();
  }, [resetPosition]);

  const sendMessage = async (content: string) => {
    await addMessage({
      content,
      role: 'user',
      status: 'sending',
    });
    // TODO: Implement AI response handling
  };

  const value = {
    sendMessage,
    clearChat: clearMessages,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
      <ChatWindow />
    </ChatContext.Provider>
  );
};