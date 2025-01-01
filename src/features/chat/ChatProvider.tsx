import React, { createContext, useContext, useEffect } from 'react';
import { ChatWindow } from './ui/ChatWindow';
import { useMessageStore } from './core/messaging/MessageManager';
import { useWindowStore } from './core/window/WindowManager';
import { useCommandStore } from './core/commands/CommandRegistry';
import { toast } from 'sonner';

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
  const { registerCommand } = useCommandStore();

  useEffect(() => {
    // Initialize chat position
    resetPosition();

    // Register basic commands
    registerCommand('clear', async () => {
      clearMessages();
      toast.success('Chat cleared');
    });

    registerCommand('help', async () => {
      addMessage({
        content: 'Available commands:\n/clear - Clear chat\n/help - Show this message',
        role: 'system',
        status: 'sent',
      });
    });
  }, [resetPosition, registerCommand, clearMessages, addMessage]);

  const sendMessage = async (content: string) => {
    await addMessage({
      content,
      role: 'user',
      status: 'sending',
    });
    // AI response handling will be implemented next
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