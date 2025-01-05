import React, { createContext, useContext, useEffect, useCallback, useRef } from 'react';
import { ChatWindow } from './ui/ChatWindow';
import { useMessageStore } from './core/messaging/MessageManager';
import { useWindowStore } from './core/window/WindowManager';
import { useCommandStore } from './core/commands/CommandRegistry';
import { generateResponse } from './core/ai/huggingFaceService';
import { toast } from 'sonner';
import { useSession } from '@/hooks/useSession';
import { debounce } from 'lodash';

const MAX_MESSAGES = 50; // Limit stored messages
const DEBOUNCE_DELAY = 300; // ms

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
  const { addMessage, clearMessages, messages } = useMessageStore();
  const { setPosition } = useWindowStore();
  const { registerCommand } = useCommandStore();
  const { user } = useSession();
  
  // Refs for cleanup
  const commandCleanupRef = useRef<(() => void)[]>([]);

  // Debounced message handler
  const debouncedAddMessage = useCallback(
    debounce(async (message) => {
      await addMessage(message);
      
      // Cleanup old messages if we exceed the limit
      if (messages.length > MAX_MESSAGES) {
        const messagesToRemove = messages.slice(0, messages.length - MAX_MESSAGES);
        messagesToRemove.forEach(msg => {
          // Cleanup any associated resources (e.g., file attachments)
          if ('file_url' in msg) {
            // Add cleanup logic for files if needed
          }
        });
        clearMessages();
        messages.slice(-MAX_MESSAGES).forEach(msg => addMessage(msg));
      }
    }, DEBOUNCE_DELAY),
    [addMessage, messages, clearMessages]
  );

  // Register commands with cleanup
  useEffect(() => {
    const cleanupFns: (() => void)[] = [];

    // Clear command
    const clearCleanup = registerCommand('clear', () => {
      clearMessages();
      toast.success('Chat cleared');
      return () => {}; // Return cleanup function
    });
    cleanupFns.push(clearCleanup);

    // Help command
    const helpCleanup = registerCommand('help', () => {
      debouncedAddMessage({
        content: 'Available commands:\n/clear - Clear chat\n/help - Show this message',
        type: 'system',
        user_id: user?.id,
      });
      return () => {}; // Return cleanup function
    });
    cleanupFns.push(helpCleanup);

    // Store cleanup functions
    commandCleanupRef.current = cleanupFns;

    // Cleanup on unmount
    return () => {
      debouncedAddMessage.cancel();
      cleanupFns.forEach(cleanup => cleanup());
    };
  }, [registerCommand, clearMessages, debouncedAddMessage, user]);

  // Set initial position with cleanup
  useEffect(() => {
    setPosition('bottom-right');
    return () => setPosition('bottom-right'); // Reset position on unmount
  }, [setPosition]);

  const sendMessage = useCallback(async (content: string) => {
    if (content.startsWith('/')) {
      const [command, ...args] = content.slice(1).split(' ');
      try {
        await useCommandStore.getState().executeCommand(command, args.join(' '));
      } catch (error) {
        toast.error(`Command failed: ${error.message}`);
      }
      return;
    }

    // Add user message
    await debouncedAddMessage({
      content,
      type: 'text',
      user_id: user?.id,
    });

    try {
      // Generate AI response
      const response = await generateResponse(content);
      await debouncedAddMessage({
        content: response,
        type: 'text',
        user_id: null, // AI message
      });
    } catch (error) {
      toast.error('Failed to generate response');
      console.error('Error:', error);
    }
  }, [debouncedAddMessage, user]);

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