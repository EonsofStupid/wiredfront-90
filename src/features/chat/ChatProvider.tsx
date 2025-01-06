import React, { createContext, useContext, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ChatWindow } from './ui/ChatWindow';
import { useMessageStore } from './core/messaging/MessageManager';
import { useWindowStore } from './core/window/WindowManager';
import { useCommandStore } from './core/commands/CommandRegistry';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth';
import { debounce } from 'lodash';
import { supabase } from '@/integrations/supabase/client';

const MAX_MESSAGES = 50;
const DEBOUNCE_DELAY = 300;

interface ChatContextValue {
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  isDevelopmentMode: boolean;
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
  const location = useLocation();
  const { addMessage, clearMessages, messages } = useMessageStore();
  const { setPosition } = useWindowStore();
  const { registerCommand } = useCommandStore();
  const { user } = useAuthStore();
  
  // Determine if we're in development mode based on route
  const isDevelopmentMode = location.pathname === '/editor';
  
  // Refs for cleanup
  const commandCleanupRef = useRef<(() => void)[]>([]);

  // Fetch active API configuration
  const fetchActiveConfig = async () => {
    try {
      const { data: config, error } = await supabase
        .from('api_configurations')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_enabled', true)
        .eq('is_default', true)
        .single();

      if (error) throw error;
      return config;
    } catch (error) {
      console.error('Error fetching API configuration:', error);
      toast.error('Failed to load AI provider configuration');
      return null;
    }
  };

  // Debounced message handler
  const debouncedAddMessage = useCallback(
    debounce(async (message) => {
      await addMessage(message);
      
      if (messages.length > MAX_MESSAGES) {
        const messagesToRemove = messages.slice(0, messages.length - MAX_MESSAGES);
        messagesToRemove.forEach(msg => {
          if ('file_url' in msg) {
            // Cleanup logic for files if needed
          }
        });
        clearMessages();
        messages.slice(-MAX_MESSAGES).forEach(msg => addMessage(msg));
      }
    }, DEBOUNCE_DELAY),
    [addMessage, messages, clearMessages]
  );

  // Register commands
  useEffect(() => {
    const cleanupFns: (() => void)[] = [];

    // Clear command
    const clearCleanup = registerCommand('clear', async () => {
      clearMessages();
      toast.success('Chat cleared');
    });
    cleanupFns.push(clearCleanup);

    // Help command
    const helpCleanup = registerCommand('help', async () => {
      await debouncedAddMessage({
        content: isDevelopmentMode 
          ? 'Development Mode Commands:\n/clear - Clear chat\n/help - Show this message\n/generate - Generate code'
          : 'Available commands:\n/clear - Clear chat\n/help - Show this message',
        type: 'system',
        user_id: user?.id,
      });
    });
    cleanupFns.push(helpCleanup);

    // Store cleanup functions
    commandCleanupRef.current = cleanupFns;

    return () => {
      debouncedAddMessage.cancel();
      cleanupFns.forEach(cleanup => cleanup());
    };
  }, [registerCommand, clearMessages, debouncedAddMessage, user, isDevelopmentMode]);

  // Set initial position
  useEffect(() => {
    setPosition('bottom-right');
    return () => setPosition('bottom-right');
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
      metadata: { mode: isDevelopmentMode ? 'development' : 'chat' }
    });

    try {
      const config = await fetchActiveConfig();
      if (!config) {
        toast.error('No active AI provider configured');
        return;
      }

      // Call the appropriate edge function based on mode
      const functionName = isDevelopmentMode ? 'generate-code' : 'chat-completion';
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { message: content, config_id: config.id }
      });

      if (error) throw error;

      await debouncedAddMessage({
        content: data.response,
        type: 'text',
        user_id: null,
        metadata: {
          provider: config.api_type,
          mode: isDevelopmentMode ? 'development' : 'chat'
        }
      });
    } catch (error) {
      toast.error('Failed to generate response');
      console.error('Error:', error);
    }
  }, [debouncedAddMessage, user, isDevelopmentMode]);

  const value = {
    sendMessage,
    clearChat: clearMessages,
    isDevelopmentMode
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
      <ChatWindow />
    </ChatContext.Provider>
  );
};